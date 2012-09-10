package utils.query

import play.Logger;

import exceptions.InvalidQueryConditionException


import java.sql.ResultSetMetaData

import utils.Conversion.isNumeric
import utils.Sql.sanitize
import utils.Sql.formatValue
import utils.sql.FieldType

object ConditionBuilder {

  def buildSingleCondition(condition: Condition)(implicit meta:ResultSetMetaData): String = {

    def getFieldType(fieldName: String)(implicit meta: ResultSetMetaData): Option[FieldType.Value] = {
      Range(1, meta.getColumnCount).find {
        meta.getColumnName(_) == fieldName
      }.map { index =>
        val metaFieldType = meta.getColumnType(index)
        Option(FieldType.toFieldType(metaFieldType))
      }.getOrElse {
        None
      }
    }
    getFieldType(condition.field).map { fieldType =>
      buildSingleCondition(condition, fieldType)
    }.getOrElse {
      throw new InvalidQueryConditionException(
        "Error parsing query condition '%s'. Field '%s' not found."
        .format(condition.original, condition.field)
      )
    }
  }

  def buildSingleCondition(condition: Condition, fieldType: FieldType.Value): String = {

    import ConditionOperator._
    import FieldType._

    //validate numeric values
    if (fieldType == Numeric) {
      condition.values.foreach { value =>
        if (!isNumeric(value)) {
          throw new InvalidQueryConditionException(
            "Error parsing query condition '%s'. Value '%s' is not a valid number."
            .format(condition.original, value)
          )
        }
      }
    }

    // Check if value is not string and operator is one of startsWith, endsWith, contains
    if (fieldType != String && 
      List(StartsWith, EndsWith, Contains).contains(condition.operator)
    ) {
      throw new InvalidQueryConditionException(
        "Error parsing query condition '%s'. Operator '%s' is only allowed for string fields."
        .format(condition.original, condition.operator.toString)
      )
    }

    val operator = {
      // if field is string, and operator is equal, operator is startsWith
      if (fieldType == String && condition.operator == Equal) {
        StartsWith
      } else {
        condition.operator
      }
    }

    implicit val implicitFieldType = fieldType
    val value = condition.values(0)
    val neg = if (condition.negated) "not " else ""

    operator match {
      case Equal | NotEqual | GreaterOrEqual | Greater | LessOrEqual | Less => {
        val op = toSqlOperator(condition.operator)
        val cond = "%s %s %s".format(condition.field, op, formatValue(value))
        return if (condition.negated) "(not " + cond + ")" else cond
      }
      case Between => {
        return "%s %sbetween %s and %s".format(
          condition.field, 
          neg,
          formatValue(condition.values(0)), 
          formatValue(condition.values(1))
        )
      }
      case StartsWith | EndsWith | Contains => {
        val likeValue = operator match {
          case StartsWith     => value + "%"
          case EndsWith       => "%" + value
          case Contains       => "%" + value + "%"
        }
        return "%s %slike %s".format(condition.field, neg, formatValue(likeValue))
      }
      case _ => {
        throw new InvalidQueryConditionException(
          "Error parsing query condition '%s'. Unknown operator."
          .format(condition.original)
        )
      }

    }

  }

}

