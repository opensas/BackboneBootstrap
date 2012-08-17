package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._
import play.api.Play

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

  val DEFAULT_PAGE_LEN = 10

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

  def find(
    page: Int = 1, len: Int = DEFAULT_PAGE_LEN, 
    order: String = "name", filter: String = ""
  ): List[Wine] = {
    findWithParser(fields="*", page=page, len=len, order=order, filter=filter, parser=Wine.simpleParser *)
  }

  def count(filter: String = ""): Long = {
    findWithParser(fields="count(*)", page=1, len=1, order = "", filter=filter, parser=scalar[Long].single)
  }

  private def findWithParser[T](
    page: Int = 1, len: Int = DEFAULT_PAGE_LEN,
    order: String = "name", filter: String = "", fields: String = "*",
    parser: ResultSetParser[T]
    ): T = {
    DB.withConnection { implicit connection =>

      val condition = if (filter == "") "" else {
        "where (" +
          List("name", "grapes", "country", "region", "year")
          .map( field => "lower(%s) like lower({filter})".format(field) )
          .mkString(" or ") + 
        ")"
      }

      val orderBy = if (order == "") "" else "order by " + order

      val sql = "select %s from wine %s %s limit {offset}, {len}"

      SQL(
        sql.format(fields, condition, orderBy)
      ).on(
        'offset     -> (page-1) * len,
        'len        -> len,
        'filter     -> ("%"+filter.toLowerCase()+"%")
      ).as(parser)
    }

  }

  def save(wine: Wine): Option[Wine] = {
    DB.withConnection { implicit connection =>
      SQL("""
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
      ).executeInsert().map { id =>
        findById(id)
      }.getOrElse(None)
    }
  }

  def update(wine: Wine): Option[Wine] = {
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
      
      wine.id.map { id => 
        findById(id)
      }.getOrElse(None)
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