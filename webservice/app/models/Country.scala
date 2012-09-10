package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._
import play.api.Play

import utils.Http
import utils.Validate

import utils.Sql.sanitize

case class Country (

  val id: Pk[Long] = NotAssigned,

  val code: String = "NN",
  val name: String = "unknown country"
) {
  def update()  = Country.update(this)
  def save()    = Country.save(this)
  def delete()  = Country.delete(this)
}

object Country {

  val filterFields = List("code", "name")

  val simpleParser = {
    get[Pk[Long]]("id") ~
    get[String]("code") ~
    get[String]("name") map {
      case id~code~name => Country(
        id, code, name
      )
    }
  }

  def findById(id: Long): Option[Country] = {
    DB.withConnection { implicit connection =>
      SQL(
        "select * from Country where id = {id}"
      ).on(
        'id   -> id
      ).as(Country.simpleParser.singleOpt)
    }
  }

  def find(query: Map[String, Seq[String]]): List[Country] = {
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
  ): List[Country] = {
    findWithParser(fields="*", page=page, len=len, order=order, 
      filter=filter, condition=condition, parser=Country.simpleParser *
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
            this.filterFields
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
      val sql = "select %s from Country %s %s limit {offset}, {len}"

      SQL(
        sql.format(fields, where, orderBy)
      ).on(
        'offset     -> (page-1) * len,
        'len        -> len,
        'filter     -> ("%"+filter.toLowerCase()+"%")
      ).as(parser)
    }

  }

  def validate(country: Country): List[Error] = {

    var errors: List[Error] = List()

    // code
    if (Validate.isEmptyWord(country.code)) {
      errors ::= ValidationError("code", "Code not specified")
    } else {
      val c = count(condition = "id <> %s and code = '%s'".format(country.id.getOrElse(0), country.code))
      if (count(condition = "id <> %s and code = '%s'".format(country.id.getOrElse(0), country.code))!=0) {
        errors ::= ValidationError("code", "There already exists a country with the code '%s'".format(country.code))
      }
    }

    // name
    if (Validate.isEmptyWord(country.name)) {
      errors ::= ValidationError("name", "Name not specified")
    } else {
      val c = count(condition = "id <> %s and name = '%s'".format(country.id.getOrElse(0), country.name))
      if (count(condition = "id <> %s and name = '%s'".format(country.id.getOrElse(0), country.name))!=0) {
        errors ::= ValidationError("name", "There already exists a country with the name '%s'".format(country.name))
      }
    }

    errors.reverse
  }

  def save(country: Country): Either[List[Error],Country] = {

    val errors = validate(country)
    if (errors.length > 0) {
      Left(errors)
    } else {
      DB.withConnection { implicit connection =>
        val newId = SQL("""
          insert into country (
            code, name
          ) values (
            {code}, {name}
          )"""
        ).on(
          'code         -> country.code,
          'name         -> country.name
        ).executeInsert()

        val newcountry = for {
          id <- newId;
          country <- findById(id)
        } yield country

        newcountry.map { country =>
          Right(country)
        }.getOrElse {
          Left(List(ValidationError("Could not create country")))
        }
      }
    }
  }

  def update(country: Country): Either[List[Error],Country] = {

    val errors = validate(country)
    if (errors.length > 0) {
      Left(errors)
    } else {

      DB.withConnection { implicit connection =>
        SQL("""
          update Country set
            code        = {code},
            name        = {name}
          where 
            id        = {id}"""
        ).on(
          'id           -> country.id,
          'code         -> country.code,
          'name         -> country.name
        ).executeUpdate()
        
        val savedCountry = for (
          id <- country.id;
          country <- findById(id)
        ) yield country

        savedCountry.map { country =>
          Right(country)
        }.getOrElse {
          Left(List(ValidationError("Could not update Country")))
        }

      }
    }
  }

  def delete(country: Country): Unit = {
    delete(country.id)
  }

  def delete(id: Pk[Long]): Unit = {
    id.map { id => delete(id) }
  }

  def delete(id: Long): Unit = {
    DB.withConnection { implicit connection =>
      SQL("delete from Country where id = {id}").on('id -> id).executeUpdate()
    }
  }

}