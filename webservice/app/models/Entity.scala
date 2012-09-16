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

import utils.Conversion.toUpperFirst
import utils.Conversion.pkToLong

import java.sql.ResultSetMetaData

import exceptions.ValidationException

import play.Logger

trait Entity {
  val id: Pk[Long]

  def asSeq(): Seq[(String, Any)]
}

trait EntityCompanion[A<:Entity] {

  val tableName: String

  def entityName: String = toUpperFirst(tableName)

  val defaultOrder: String

  val saveCommand: String
  val updateCommand: String

  val filterFields: List[String]

  lazy val columnsInfo: List[ColumnInfo] = {
    DB.withConnection { implicit conn =>
      ColumnInfo(tableName)
    }
  }

  val simpleParser: RowParser[A]

  def validate(entity: A): List[Error]

  def isDuplicate(entity: A, field: String): Boolean = {
    val fields = entity.asSeq.toMap
    if (!fields.contains(field)) {
      throw new ValidationException(
        "Cannot check for duplicate record. There's no field '%s' in table '%s'.".
        format(field, tableName)
      )
    }
    val value = fields(field).toString
    val exists = {
      // it's a new record
      if (entity.id == NotAssigned) {
        count(condition = "%s = '%s'".format(field, value))
      } else {
        count(condition = "id <> %s and %s = '%s'".
          format(pkToLong(entity.id), field, value)
        )
      }
    }
    (exists > 0)
  }

  def findById(id: Long): Option[A] = {
    Logger.info(entityName)
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
          Logger.info("q: %s".format(q))
          Logger.info("query: %s".format(query))
          if (query != "") conditions ::= query
        }
        if (condition != "") conditions ::= condition
        if (conditions.length > 0) {
          "where (" + conditions.mkString(") and (") + ")"
        } else {
          ""
        }
      }

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

  def save(entity: A): Either[List[Error],A] = {

    import utils.sql.AnormHelper.toParamsValue

    val errors = validate(entity)
    if (errors.length > 0) {
      Left(errors)
    } else {

      DB.withConnection { implicit connection =>
        val newId = SQL(saveCommand)
          .on(toParamsValue(entity.asSeq): _*)
          .executeInsert()
        
        val savedEntity = for (
          id <- newId;
          entity <- findById(id)
        ) yield entity

        savedEntity.map { entity =>
          Right(entity)
        }.getOrElse {
          Left(List(ValidationError("Could not create %s".format(entityName))))
        }

      }
    }
  }

  def update(entity: A): Either[List[Error],A] = {

    import utils.sql.AnormHelper.toParamsValue

    val errors = validate(entity)
    if (errors.length > 0) {
      Left(errors)
    } else {

      DB.withConnection { implicit connection =>
        SQL(updateCommand)
          .on(toParamsValue(entity.asSeq): _*)
          .executeUpdate()
        
        val updatedEntity = for (
          id <- entity.id;
          entity <- findById(id)
        ) yield entity

        updatedEntity.map { entity =>
          Right(entity)
        }.getOrElse {
          Left(List(ValidationError("Could not update %s".format(entityName))))
        }

      }
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