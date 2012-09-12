package utils.sql

import anorm.ParameterValue
import anorm.SimpleSql
import anorm.SqlQuery
import anorm.RowParser
import anorm.Row

object AnormHelper {

  implicit def toParamsValue[A](params: Seq[(String, A)]): Seq[(String, ParameterValue[A])] = {
    params.map { param =>
      param._1 -> anorm.toParameterValue(param._2)
    }
  }

  implicit def sqlToWithOnSeq(sql: SqlQuery): SimpleSqlWithOnSeq[Row] = {
    val simpleSql = sql.asSimple
    new SimpleSqlWithOnSeq(simpleSql.sql, simpleSql.params, simpleSql.defaultParser)
  }
}

class SimpleSqlWithOnSeq[T](
  sql: SqlQuery, 
  params: Seq[(String, ParameterValue[_])], 
  defaultParser: RowParser[T]
) extends SimpleSql[T](sql, params, defaultParser) {

  def onSeq[A](args: Seq[(String, A)]): SimpleSql[T] = {
    val argsValue = AnormHelper.toParamsValue(args)
    this.copy(params = (this.params) ++ argsValue)
  }

}