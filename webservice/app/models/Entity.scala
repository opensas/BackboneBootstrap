package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._
import play.api.Play

import utils.Http
import utils.Validate
import utils.query.ConditionBuilder
import utils.sql.ColumnInfo

import java.sql.ResultSetMetaData

import play.Logger

trait Entity {
  val id: Pk[Long]
}

trait EntityCompanion[A<:Entity] {
  val tableName: String

  val defaultOrder: String

  // val filterFields: List[String] = List[String]()
  val filterFields: List[String]

  lazy val columnsInfo: List[ColumnInfo] = {
    DB.withConnection { implicit conn =>
      ColumnInfo(tableName)
    }
  }

  val simpleParser: RowParser[A]

  def validate(entity: A): List[Error]

  def findById(id: Long): Option[A] = {
    DB.withConnection { implicit connection =>
      SQL(
        "select * from %s where id = {id}".format(tableName)
      ).on(
        'id   -> id
      ).as(simpleParser.singleOpt)
    }
  }

  def find(query: Map[String, Seq[String]]): List[A] = {
    val (page, len, order, filter, q) = Http.parseQuery(query)
    find(page, len, order, filter, q)
  }

  def find(
    page: Int = 1, len: Int = Http.DEFAULT_PAGE_LEN, 
    order: String = defaultOrder, filter: String = "", q: String = "", condition: String = ""
  ): List[A] = {
    findWithParser(fields="*", page=page, len=len, order=order, 
      filter=filter, q=q, condition=condition, parser=simpleParser *
    )
  }

  def count(query: Map[String, Seq[String]]): Long = {
    val (page, len, order, filter, q) = Http.parseQuery(query)
    count(filter,q)
  }

  def count(filter: String = "", q: String = "", condition: String = ""): Long = {
    findWithParser(fields="count(*)", page=1, len=1, order = "", 
      filter=filter, q=q, condition=condition, parser=scalar[Long].single
    )
  }

  protected def findWithParser[A](
    page: Int = 1, len: Int = Http.DEFAULT_PAGE_LEN, order: String = "name",
    filter: String = "", q: String = "", condition: String = "", fields: String = "*",
    parser: ResultSetParser[A]
  ): A = {
    DB.withConnection { implicit connection =>

      val where = {
        var conditions: List[String] = List()
        if (filter != "") {
          conditions ::=
            this.filterFields
            .map( field => "lower(%s) like {filter}".format(field) )
            .mkString(" or ")
        }
        if (q != "") {
          val query = ConditionBuilder.build(q, columnsInfo)
          if (query != "") conditions ::= query
        }
        if (condition != "") conditions ::= condition
        if (conditions.length > 0) {
          "where (" + conditions.mkString(") and (") + ")"
        } else {
          ""
        }
      }

      Logger.info("filter: " + filter)
      Logger.info("q: " + q)
      Logger.info("condition: " + condition)
      Logger.info("where: " + where)

      val orderBy = if (order == "") "" else "order by " + order
      val sql = "select %s from %s %s %s limit {offset}, {len}"

      SQL(
        sql.format(fields, tableName, where, orderBy)
      ).on(
        'offset     -> (page-1) * len,
        'len        -> len,
        'filter     -> ("%"+filter.toLowerCase()+"%")
      ).as(parser)
    }

  }

  def delete(entity: A): Unit = {
    delete(entity.id)
  }

  def delete(id: Pk[Long]): Unit = {
    id.map { id => delete(id) }
  }

  def delete(id: Long): Unit = {
    DB.withConnection { implicit connection =>
      SQL("delete from %s where id = {id}"
        .format(tableName))
        .on('id -> id)
      .executeUpdate()
    }
  }


}