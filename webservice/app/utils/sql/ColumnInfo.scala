package utils.sql

import java.sql.ResultSetMetaData
import java.sql.Connection

import anorm.SQL

import exceptions.ColumnInfoException

import play.Logger

case class ColumnInfo (
  catalog: String,
  table: String,
  name: String,
  label: String,
  fieldType: Int,
  typeName: String,
  size: Int
)

object ColumnInfo {
  def apply(meta: ResultSetMetaData, index: Int): ColumnInfo = {
    if (index > meta.getColumnCount()) {
      throw new ColumnInfoException(
        "Error fetching column info. " +
        "Column with index %s does not exist, " +
        "only %s columns available.".
        format(index, meta.getColumnCount())
      )
    }
    try {
      ColumnInfo( 
        meta.getCatalogName(index), meta.getTableName(index),
        meta.getColumnName(index), meta.getColumnLabel(index),
        meta.getColumnType(index), meta.getColumnTypeName(index),
        meta.getColumnDisplaySize(index)
      )
    } catch {
      case e: Exception => {
        throw new ColumnInfoException(
          "Error fetching column info for column with index %s.".format(index), e
        )
      }
    }
  }

  def apply(meta: ResultSetMetaData): List[ColumnInfo] = {
    Range(1, meta.getColumnCount()+1).map { index =>
      ColumnInfo(meta, index)
    }.toList
  }

  def apply(tableName: String)(implicit conn: Connection): List[ColumnInfo] = {

    val sql = "select * from %s where false".format(tableName)

    try {
      val resultSet = SQL(sql).resultSet
      try {
        return ColumnInfo(resultSet.getMetaData)
      } catch {
        case e => {
          throw new ColumnInfoException(
            "Error fetching column info for table '%s'.".format(tableName), e
          )
        }
      } finally {
        resultSet.close
      }
    } catch {
      case e => {
        throw new ColumnInfoException(
          "Error fetching column info for table '%s'. Couldn't open resultset".format(tableName), e
        )
      }
    }

  }

}
