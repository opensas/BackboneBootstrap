package utils.query

import play.Logger;

import exceptions.InvalidQueryConditionException

import java.sql.ResultSetMetaData

import utils.Conversion.isNumeric
import utils.Sql.sanitize
import utils.Sql.formatValue
import utils.sql.FieldType
import utils.sql.ColumnInfo

import utils.query

object ConditionBuilder {

  val CASE_SENSITIVE = false

  def build(conditions: String, columnsInfo: List[ColumnInfo]): String = {
    val conds: List[query.Condition] = query.ConditionParser.parse(conditions)

    val sqlConditions: List[String] = conds.map { condition =>
      buildSingleCondition(condition, columnsInfo).trim
    }.filter( _ != "" )

    // sqlConditions.map { "(" + _ + ")"}.mkString(" and ")
    sqlConditions.mkString(" and ")
  }

  def buildSingleCondition(
    condition: Condition, columnsInfo: List[ColumnInfo]
  ): String = {
    columnsInfo.find(_.name.toLowerCase == condition.field.toLowerCase).map { columnInfo =>
      buildSingleCondition(
        condition, FieldType.toFieldType(columnInfo.fieldType)
      )
    }.getOrElse {
      throw new InvalidQueryConditionException(
        "Error building query condition '%s'. Field '%s' not found."
        .format(condition.original, condition.field)
      )
    }
  }

  def buildSingleCondition(
    condition: Condition, fieldType: FieldType.Value
  ): String = {

    import ConditionOperator._
    import FieldType._

    // validations
    if (condition.field == "") {
      throw new InvalidQueryConditionException(
        "Error building query condition '%s' No field specified.".format(condition.original))
    }

    if (condition.values.length == 0) {
      throw new InvalidQueryConditionException(
        "Error building query condition '%s' No value specified.".format(condition.original))
    }

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
      if (condition.operator == Missing || condition.operator == ConditionOperator.Unknown) {
        if (fieldType == String) Contains else Equal
      } else {
        condition.operator
      }
    }

    implicit val implicitFieldType = fieldType

    // turn every value to lowerCase if dealing with strings and not case sensitive
    val values = condition.values.map { value =>
      if (fieldType == String && !CASE_SENSITIVE) value.toLowerCase else value
    }

    val field = (if (fieldType == String && !CASE_SENSITIVE)
      "lower(%s)".format(condition.field) else condition.field
    )

    val formattedValues = values.map { formatValue(_) }
    val formattedValue = formattedValues(0)
    val neg = if (condition.negated) "not " else ""

    operator match {
      case Equal | NotEqual | GreaterOrEqual | Greater | LessOrEqual | Less => {
        val op = toSqlOperator(operator)
        val cond = "%s %s %s".format(field, op, formattedValue)
        return if (condition.negated) "(not " + cond + ")" else cond
      }
      case Between => {
        return "%s %sbetween %s and %s".format(
          field, neg, formattedValues(0), formattedValues(1)
        )
      }
      case StartsWith | EndsWith | Contains => {
        val value = values(0)
        val likeValue = operator match {
          case StartsWith     => value + "%"
          case EndsWith       => "%" + value
          case Contains       => "%" + value + "%"
        }
       return "%s %slike %s".format(field, neg, formatValue(likeValue))
      }
      case In => {
        if (fieldType == Numeric || fieldType == Boolean) {
          return ("%s %sin (" + formattedValues.mkString(", ") + ")").format(field, neg)
        } else {
          val operator = if (fieldType == String) Contains else Equal
          return "( " + values.map( value =>
            buildSingleCondition( Condition(condition.original, condition.field, condition.negated, operator, value), fieldType)
          ).mkString(if (condition.negated) " and " else " or ") + " )"
        }
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

