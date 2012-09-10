package test

import org.specs2.mutable._

import play.api.test._
import play.api.test.Helpers._

import play.Logger

class ConditionParserSpec extends Specification {

  import utils.query._
  import exceptions.InvalidQueryConditionException

  import utils.query.ConditionParser.parseSingleCondition

  "ConditionParser.parseSingleCondition" should {

    "retrieve the field, negated value, operator and values" in {

      parseSingleCondition("field=value").description must equalTo("field should be equal to value")

      parseSingleCondition("field!=value")
        .description must equalTo("field should not be equal to value")

      parseSingleCondition("field<>value")
        .description must equalTo("field should be not equal to value")
    }

    "rewrite field!value as field notEqual value" in {

      parseSingleCondition("field!value")
        .description must equalTo("field should be not equal to value")

    }

    "treat : and = as synonyms" in {

      parseSingleCondition("field=value")
        .description must equalTo("field should be equal to value")

      parseSingleCondition("field:value")
        .description must equalTo("field should be equal to value")

      parseSingleCondition("field!=value")
        .description must equalTo("field should not be equal to value")

      parseSingleCondition("field!:value")
        .description must equalTo("field should not be equal to value")

    }

    "handle missing parameters in 'between' operator as greater and less than" in {

      parseSingleCondition("field=value1..value2")
        .description must equalTo("field should be between value1 and value2")

      parseSingleCondition("field=..value2")
        .description must equalTo("field should be less than or equal to value2")

      parseSingleCondition("field=value1..")
        .description must equalTo("field should be greater than or equal to value1")

    }

    "handle in operator with multiples values" in {

      parseSingleCondition("field=value1;value2;value3")
        .description must equalTo("field should be one of value1, value2, value3")

    }

    "handle contains, begins and ends with operators" in {

      parseSingleCondition("field=*value1*")
        .description must equalTo("field should contain value1")

      parseSingleCondition("field=value1*")
        .description must equalTo("field should start with value1")

      parseSingleCondition("field=*value1")
        .description must equalTo("field should end with value1")

    }

    "throw and exception if no field is defined" in {

      parseSingleCondition("=value") must throwA[InvalidQueryConditionException].like {
        case e => e.getMessage must contain("No field specified")
      }

      parseSingleCondition("field=") must throwA[InvalidQueryConditionException].like {
        case e => e.getMessage must contain("No value specified")
      }

    }

  }
  
}