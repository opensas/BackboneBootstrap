package utils.query

import play.Logger

import exceptions.InvalidQueryConditionException

case class Condition(
  original : String, 
  field    : String, 
  negated  : Boolean, 
  operator : ConditionOperator.Value, 
  values   : List[String]) {

  def description: String = {

    import utils.query.ConditionOperator._

    val neg = if (negated) " not" else ""
    val value = this.values(0)
    operator match {
      case Equal           => "%s should%s be equal to %s".format(field, neg, value)
      case NotEqual        => "%s should%s be not equal to %s".format(field, neg, value)
      case GreaterOrEqual  => "%s should%s be greater than or equal to %s".format(field, neg, value)
      case Greater         => "%s should%s be greater than %s".format(field, neg, value)
      case LessOrEqual     => "%s should%s be less than or equal to %s".format(field, neg, value)
      case Less            => "%s should%s be less than %s".format(field, neg, value)
      case Between         => "%s should%s be between %s and %s".format(field, neg, this.values(0), this.values(1))
      case In              => "%s should%s be one of %s".format(field, neg, this.values.mkString(", "))
      case StartsWith      => "%s should%s start with %s".format(field, neg, value)
      case EndsWith        => "%s should%s end with %s".format(field, neg, value)
      case Contains        => "%s should%s contain %s".format(field, neg, value)
      case Unknown         => "%s should%s have something to do with %s".format(field, neg, value)
    }
  }

}

object Condition {
  def apply(original: String, field: String, negated: Boolean, operator: ConditionOperator.Value, 
            value: String): Condition = {
    Condition(original, field, negated, operator, List(value))
  }

  def apply(original: String, field: String, negated: Boolean, operator: ConditionOperator.Value,
            value1: String, value2: String): Condition = {
    Condition(original, field, negated, operator, List(value1, value2))
  }

}

object ConditionParser {

  import ConditionOperator._

  def parse(conditions: String): List[Condition] = {
    conditions.split(",").map{ condition =>
      parseSingleCondition(condition)
    }.toList
  }

  def parseSingleCondition(condition: String): Condition = {

    if (condition == "") {
      return Condition("", "", false, Missing, List[String]())
      throw new InvalidQueryConditionException(
        "Error parsing query condition. Condition is empty.")
    }

    val conditionRegExp = """^([\w-]*)(!?)[:]?(=|:|\$|<=|>=|<>|<|>|){1}+(.*)$""".r

    if (!conditionRegExp.pattern.matcher(condition).matches) {
      throw new InvalidQueryConditionException(
        "Error parsing query condition '%s'.".format(condition))
    }

    val conditionRegExp(parsedField, parsedNegated, parsedOperator, parsedValue) = condition

    if (parsedField == "") {
      throw new InvalidQueryConditionException(
        "Error parsing query condition '%s' No field specified.".format(condition))
    }

    if (parsedValue == "") {
      throw new InvalidQueryConditionException(
        "Error parsing query condition '%s' No value specified.".format(condition))
    }

    val negated = (parsedNegated == "!")
    val operator = ConditionOperator.toConditionOperator(parsedOperator)

    // check between, in, startswith, contains
    if (List(Equal, Missing, Unknown).contains(operator)) {

      //between
      val betweenRegExp = """^(\w*)\.\.(\w*)$""".r
      if (betweenRegExp.pattern.matcher(parsedValue).matches) {
        val betweenRegExp(from, to) = parsedValue
        if (!from.isEmpty || !to.isEmpty) {
          if (from.isEmpty) {
            return Condition(condition, parsedField, negated, LessOrEqual, to)
          } else if (to.isEmpty) {
            return Condition(condition, parsedField, negated, GreaterOrEqual, from)
          } else {
            return Condition(condition, parsedField, negated, Between, from, to)
          }
        }
      // in
      } else if (parsedValue.contains(";")) {
        return Condition(condition, parsedField, negated, In, parsedValue.split(";").toList)
      
      // contains
      } else if (parsedValue.startsWith("*") && parsedValue.endsWith("*")) {
        return Condition(condition, parsedField, negated, Contains, 
          parsedValue.substring(1,parsedValue.length-1))

      // startsWith
      } else if (parsedValue.endsWith("*")) {
        return Condition(condition, parsedField, negated, StartsWith, 
          parsedValue.substring(0,parsedValue.length-1))

      // endsWith
      } else if (parsedValue.startsWith("*")) {
        return Condition(condition, parsedField, negated, EndsWith, 
          parsedValue.substring(1))
      }

    }

    return Condition(condition, parsedField, negated, operator, parsedValue)

  }
}

object ConditionOperator extends Enumeration {

  val Equal           = Value("equal")
  val NotEqual        = Value("notEqual")
  val GreaterOrEqual  = Value("greaterOrEqual")
  val Greater         = Value("greater")
  val LessOrEqual     = Value("lessOrEqual")
  val Less            = Value("less")
  val Between         = Value("between")
  val In              = Value("in")
  val StartsWith      = Value("startsWith")
  val EndsWith        = Value("endsWith")
  val Contains        = Value("contains")
  val Missing         = Value("missing")
  val Unknown         = Value("unknown")

  def toSqlOperator(value: ConditionOperator.Value): String = {
    value match {
      case ConditionOperator.Equal            => "="
      case ConditionOperator.NotEqual         => "<>"
      case ConditionOperator.GreaterOrEqual   => ">="
      case ConditionOperator.Greater          => ">"
      case ConditionOperator.LessOrEqual      => "<="
      case ConditionOperator.Less             => "<"
      case ConditionOperator.Between          => "between %s and %s"
      case ConditionOperator.In               => "in (%s)"
      case ConditionOperator.StartsWith       => "like '%s*'"
      case ConditionOperator.EndsWith         => "like '*%s'"
      case ConditionOperator.Contains         => "like '*%s*'"
      case ConditionOperator.Missing          => ""
      case ConditionOperator.Unknown          => ""
    }
  }

  def toConditionOperator(value: String): ConditionOperator.Value = {
    if (value==null) {
      ConditionOperator.Unknown
    } else {
      value.toLowerCase match {
        case "equal" | "=" | ":"             => ConditionOperator.Equal
        case "notequal" | "!=" | "!:" | "<>" => ConditionOperator.NotEqual
        case "greaterorequal" | ">="         => ConditionOperator.GreaterOrEqual
        case "greater" | ">"                 => ConditionOperator.Greater
        case "lessorequal" | "<="            => ConditionOperator.LessOrEqual
        case "less" | "<"                    => ConditionOperator.Less
        case "between"                       => ConditionOperator.Between
        case "in"                            => ConditionOperator.In
        case "startswith"                    => ConditionOperator.StartsWith
        case "endswith"                      => ConditionOperator.EndsWith
        case "contains" | "$"                => ConditionOperator.Contains
        case "missing" | ""                  => ConditionOperator.Missing
        case "unknown" | _                   => ConditionOperator.Unknown
      }
    }
  }

}