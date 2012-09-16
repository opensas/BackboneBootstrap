package test.utils

import org.specs2.mutable._

import play.api.test._
import play.api.test.Helpers._

import play.Logger

class ConvertSpec extends Specification {

  import utils.query._
  import exceptions.InvalidQueryConditionException

  "ConditionParser.parseSingleCondition" should {

    import utils.query.ConditionParser.parseSingleCondition

    "handle the basic operators" in {
      parseSingleCondition("field=value")
        .description must equalTo("field should be equal to value")

      parseSingleCondition("field<>value")
        .description must equalTo("field should be not equal to value")

      parseSingleCondition("field>=value")
        .description must equalTo("field should be greater than or equal to value")

      parseSingleCondition("field>value")
        .description must equalTo("field should be greater than value")

      parseSingleCondition("field<=value")
        .description must equalTo("field should be less than or equal to value")

      parseSingleCondition("field<value")
        .description must equalTo("field should be less than value")

      parseSingleCondition("field=value1..value2")
        .description must equalTo("field should be between value1 and value2")

      parseSingleCondition("field=value1;value2;value3")
        .description must equalTo("field should be one of value1, value2, value3")

      parseSingleCondition("field=value*")
        .description must equalTo("field should start with value")

      parseSingleCondition("field=*value")
        .description must equalTo("field should end with value")

      parseSingleCondition("field=*value*")
        .description must equalTo("field should contain value")

      parseSingleCondition("field$value")
        .description must equalTo("field should contain value")

    }

     "retrieve the field, negated value, operator and values" in {
      parseSingleCondition("field=value").description must equalTo("field should be equal to value")

      parseSingleCondition("field!=value")
        .description must equalTo("field should not be equal to value")

      parseSingleCondition("field<>value")
        .description must equalTo("field should be not equal to value")
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

    "handle operator $ as a synonim of contains" in {
      parseSingleCondition("field$value1")
        .description must equalTo("field should contain value1")

      parseSingleCondition("field!$value1")
        .description must equalTo("field should not contain value1")
    }

    "handle : as separator and report Missing operator" in {
      parseSingleCondition("field:value1")
        .description must equalTo("field should (missing operator!) value1")

      parseSingleCondition("field:!value1")
        .description must equalTo("field should not (missing operator!) value1")

    }

    "handle negated conditions, infering the correct operator" in {
      parseSingleCondition("field!value1..value2")
        .description must equalTo("field should not be between value1 and value2")

      parseSingleCondition("field!value1;value2;value3")
        .description must equalTo("field should not be one of value1, value2, value3")

      parseSingleCondition("field!value1*")
        .description must equalTo("field should not start with value1")

      parseSingleCondition("field!*value1")
        .description must equalTo("field should not end with value1")

      parseSingleCondition("field!*value1*")
        .description must equalTo("field should not contain value1")
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

  "ConditionParser.parse" should {

    import utils.query.ConditionParser.parse

    "retrieve multiple conditions parsed" in {
      def asDescriptions(conditions: List[Condition]): List[String] = {
        conditions.map(x => x.description)
      }

      asDescriptions(parse("field1=value1,field2=value2")) must equalTo(List(
        "field1 should be equal to value1",
        "field2 should be equal to value2"
      ))

      asDescriptions(parse("f1!v1..v2,f2>=v2,f3=*v3*,f4!v4a;v4b;v4c;v4d")) must equalTo(List(
        "f1 should not be between v1 and v2",
        "f2 should be greater than or equal to v2",
        "f3 should contain v3",
        "f4 should not be one of v4a, v4b, v4c, v4d"
      ))
    }

  }


}