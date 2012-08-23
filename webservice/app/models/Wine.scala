package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._
import play.api.Play

import utils.Http
import utils.Validate

case class Wine (

  val id: Pk[Long] = NotAssigned,

  val name: String = "unknown wine",
  val year: String = "",
  val grapes: String = "",
  val country: String = "",
  val region: String = "",
  val description: String = "",
  val picture: String = ""
) {
  def update()  = Wine.update(this)
  def save()    = Wine.save(this)
  def delete()  = Wine.delete(this)
}

object Wine {

  val simpleParser = {
    get[Pk[Long]]("id") ~
    get[String]("name") ~
    get[String]("year") ~
    get[String]("grapes") ~
    get[String]("country") ~
    get[String]("region") ~
    get[String]("description") ~
    get[String]("picture") map {
      case id~name~year~grapes~country~region~description~picture => Wine(
        id, name, year, grapes, country, region, description, picture
      )
    }
  }

  def findById(id: Long): Option[Wine] = {
    DB.withConnection { implicit connection =>
      SQL(
        "select * from wine where id = {id}"
      ).on(
        'id   -> id
      ).as(Wine.simpleParser.singleOpt)
    }
  }

  def find(query: Map[String, Seq[String]]): List[Wine] = {
    val (page, len, order, filter) = Http.parseQuery(query)
    find(page, len, order, filter)
  }

  def count(query: Map[String, Seq[String]]): Long = {
    val (page, len, order, filter) = Http.parseQuery(query)
    count(filter)
  }

  def find(
    page: Int = 1, len: Int = Http.DEFAULT_PAGE_LEN, 
    order: String = "name", filter: String = "", condition: String = ""
  ): List[Wine] = {
    findWithParser(fields="*", page=page, len=len, order=order, 
      filter=filter, condition=condition, parser=Wine.simpleParser *
    )
  }

  def count(filter: String = "", condition: String = ""): Long = {
    findWithParser(fields="count(*)", page=1, len=1, order = "", 
      filter=filter, condition=condition, parser=scalar[Long].single
    )
  }

  private def findWithParser[T](
    page: Int = 1, len: Int = Http.DEFAULT_PAGE_LEN,
    order: String = "name", filter: String = "", condition: String = "", fields: String = "*",
    parser: ResultSetParser[T]
  ): T = {
    DB.withConnection { implicit connection =>

      val where = {
        var conditions: List[String] = List()
        if (filter != "") {
          conditions ::=
            List("name", "grapes", "country", "region", "year")
            .map( field => "lower(%s) like lower({filter})".format(field) )
            .mkString(" or ")
        }
        if (condition != "") conditions ::= condition
        if (conditions.length > 0) {
          "where (" + conditions.mkString(") and (") + ")"
        } else {
          ""
        }
      }

      val orderBy = if (order == "") "" else "order by " + order
      val sql = "select %s from wine %s %s limit {offset}, {len}"

      SQL(
        sql.format(fields, where, orderBy)
      ).on(
        'offset     -> (page-1) * len,
        'len        -> len,
        'filter     -> ("%"+filter.toLowerCase()+"%")
      ).as(parser)
    }

  }

  def validate(wine: Wine): List[Error] = {

    var errors: List[Error] = List()

    // name
    if (Validate.isEmptyWord(wine.name)) {
      errors ::= ValidationError("name", "Name not specified")
    } else {
      val c = count(condition = "id <> %s and name = '%s'".format(wine.id.getOrElse(0), wine.name))
      if (count(condition = "id <> %s and name = '%s'".format(wine.id.getOrElse(0), wine.name))!=0) {
        errors ::= ValidationError("name", "There already exists a wine with the name '%s'".format(wine.name))
      }
    }

    // year
    if (!Validate.isNumeric(wine.year)) {
      errors ::= ValidationError("year", "Year should be a number")
    } else {
      val iYear = wine.year.toInt
      if (iYear < 1900) {
        errors ::= ValidationError("year", "Year should be greater than 1900")
      }
      if (iYear > Validate.currentYear) {
        errors ::= ValidationError("year", "Year can't be greater than current year")
      }
    }

    // grapes
    if (Validate.isEmptyWord(wine.grapes)) {
      errors ::= ValidationError("grapes", "Grapes not specified")
    }

    // country
    if (Validate.isEmptyWord(wine.country)) {
      errors ::= ValidationError("country", "Country not specified")
    }

    // description
    if (Validate.isEmptyWord(wine.description)) {
      errors ::= ValidationError("description", "Description not specified")
    }

    errors.reverse
  }

  def save(wine: Wine): Either[List[Error],Wine] = {

    val errors = validate(wine)
    if (errors.length > 0) {
      Left(errors)
    } else {
      DB.withConnection { implicit connection =>
        val newId = SQL("""
          insert into wine (
            name, year, grapes, country, region, description, picture
          ) values (
            {name}, {year}, {grapes}, {country}, {region}, {description}, {picture}
          )"""
        ).on(
          'name         -> wine.name,
          'year         -> wine.year,
          'grapes       -> wine.grapes,
          'country      -> wine.country,
          'region       -> wine.region,
          'description  -> wine.description,
          'picture      -> wine.picture
        ).executeInsert()

        val newWine = for {
          id <- newId;
          wine <- findById(id)
        } yield wine

        newWine.map { wine =>
          Right(wine)
        }.getOrElse {
          Left(List(ValidationError("Could not create wine")))
        }

        // .map { id =>
        //   findById(id)
        // }.getOrElse(None)
      }
    }
  }

  def update(wine: Wine): Either[List[Error],Wine] = {

    val errors = validate(wine)
    if (errors.length > 0) {
      Left(errors)
    } else {

      DB.withConnection { implicit connection =>
        SQL("""
          update wine set
            name        = {name},
            year        = {year},
            grapes      = {grapes},
            country     = {country},
            region      = {region},
            description = {description},
            picture     = {picture}
          where 
            id        = {id}"""
        ).on(
          'id           -> wine.id,
          'name         -> wine.name,
          'year         -> wine.year,
          'grapes       -> wine.grapes,
          'country      -> wine.country,
          'region       -> wine.region,
          'description  -> wine.description,
          'picture      -> wine.picture
        ).executeUpdate()
        
        val savedWine = for (
          id <- wine.id;
          wine <- findById(id)
        ) yield wine

        savedWine.map { wine =>
          Right(wine)
        }.getOrElse {
          Left(List(ValidationError("Could not update wine")))
        }

      }
    }
  }

  def delete(wine: Wine): Unit = {
    delete(wine.id)
  }

  def delete(id: Pk[Long]): Unit = {
    id.map { id => delete(id) }
  }

  def delete(id: Long): Unit = {
    DB.withConnection { implicit connection =>
      SQL("delete from wine where id = {id}").on('id -> id).executeUpdate()
    }
  }

}