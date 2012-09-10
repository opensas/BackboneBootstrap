package test

import org.specs2.mutable._

import play.api.test._
import play.api.test.Helpers._

import play.Logger

class ConditionBuilderSpec extends Specification {
  import utils.query.ConditionOperator._
  import utils.sql.FieldType._

  import utils.query.Condition
  import exceptions.InvalidQueryConditionException

  "ConditionBuilder.buildSingleCondition" should {

    import utils.query.ConditionBuilder.buildSingleCondition

    "build the sql condition" in {
      buildSingleCondition(Condition("field=10", "field", false, Equal, List("10")), Numeric
      ) must equalTo("field = 10")
    }

    "build the negated sql condition" in {
      buildSingleCondition(Condition("field!=10", "field", true, Equal, List("10")), Numeric
      ) must equalTo("(not field = 10)")
    }

    "build the sql condition when dealing with string operations" in {
      buildSingleCondition(Condition("field=10", "field", false, Equal, List("10")), String
      ) must equalTo("field like '10%'")

      buildSingleCondition(Condition("field=10*", "field", false, StartsWith, List("10")), String
      ) must equalTo("field like '10%'")

      buildSingleCondition(Condition("field=*10", "field", false, EndsWith, List("10")), String
      ) must equalTo("field like '%10'")

      buildSingleCondition(Condition("field=*10", "field", false, Contains, List("10")), String
      ) must equalTo("field like '%10%'")
    }

    "build the sql negated condition when dealing with string operations" in {
      buildSingleCondition(Condition("field=10", "field", true, Equal, List("10")), String
      ) must equalTo("field not like '10%'")
    }

    "build the sql condition escaping single quotes when dealing with string operations" in {
      buildSingleCondition(Condition("field=Paul's home", "field", false, Equal, List("Paul's home")), String
      ) must equalTo("field like 'Paul''s home%'")
    }

    "build the sql condition leacing double quotes and slashes untouched" in {
      buildSingleCondition(Condition("""field=Paul"s home""", "field", false, Equal, List("""Paul"s home""")), String
      ) must equalTo("""field like 'Paul"s home%'""")

      buildSingleCondition(Condition("""field=Paul\s home""", "field", false, Equal, List("""Paul\s home""")), String
      ) must equalTo("""field like 'Paul\s home%'""")
    }


    "build the sql condition when dealing with boolean operations" in {
      List("1", "yes", "on", "true", "TrUE", "anything").foreach { value =>
        buildSingleCondition(Condition("field=" + value, "field", false, Equal, List(value)), Boolean
        ) must equalTo("field = 1")
      }

      List("0", "off", "OFF", "false", "FaLse", "null").foreach { value =>
        buildSingleCondition(Condition("field=" + value, "field", false, Equal, List(value)), Boolean
        ) must equalTo("field = 0")
      }

      buildSingleCondition(Condition("field=false", "field", false, Equal, List("false")), Boolean
      ) must equalTo("field = 0")
    }

    "build the sql condition when dealing with between operator" in {
      buildSingleCondition(Condition("field=12..15", "field", false, Between, List("12", "15")), Numeric
      ) must equalTo("field between 12 and 15")

      buildSingleCondition(Condition("field=12..15", "field", false, Between, List("12", "15")), String
      ) must equalTo("field between '12' and '15'")
    }

    "build the sql negated condition when dealing with between operator" in {
      buildSingleCondition(Condition("field=12..15", "field", true, Between, List("12", "15")), Numeric
      ) must equalTo("field not between 12 and 15")

      buildSingleCondition(Condition("field=12..15", "field", true, Between, List("12", "15")), String
      ) must equalTo("field not between '12' and '15'")
    }

    "build raise an error when it's expecting a number and no number is passed" in {
      buildSingleCondition(Condition("field=10+", "field", false, Equal, List("10+")), Numeric
      ) must throwA[InvalidQueryConditionException].like {
        case e => e.getMessage must contain("Value '10+' is not a valid number.")
      }

      buildSingleCondition(Condition("field=12..1a5", "field", true, Between, List("12", "1a5")), Numeric
      ) must throwA[InvalidQueryConditionException].like {
        case e => e.getMessage must contain("Value '1a5' is not a valid number.")
      }

      buildSingleCondition(Condition("field=12 a 23..15", "field", true, Between, List("12 a 23", "15")), Numeric
      ) must throwA[InvalidQueryConditionException].like {
        case e => e.getMessage must contain("Value '12 a 23' is not a valid number.")
      }
    }

  }

}