// test with play "test-only test.ConditionBuilder.*"
package test.utils.query

import org.specs2.mutable._

import play.api.test._
import play.api.test.Helpers._

import play.Logger

class ConditionBuilderSpec extends Specification {
  import utils.query.ConditionOperator._
  import utils.sql.ColumnInfo
  import utils.sql.FieldType._
  import java.sql.Types._

  import utils.query.Condition
  import exceptions.InvalidQueryConditionException

  "ConditionBuilder.build" should {

    import utils.query.ConditionBuilder.build

    val columnsInfo = List(
      ColumnInfo("test", "test", "finteger",  "finteger", INTEGER,  "integer",  10),
      ColumnInfo("test", "test", "fnumeric",  "fnumeric", NUMERIC,  "numeric",  10),
      ColumnInfo("test", "test", "fstring",   "fstring",  VARCHAR,  "string",   50),
      ColumnInfo("test", "test", "fdate",     "fdate",    DATE,     "date",     10),
      ColumnInfo("test", "test", "fboolean",  "fboolean", BOOLEAN,  "boolean",  10)
    )

    "build the sql condition when dealing with numbers in" in {

      build("finteger=1", columnsInfo) must equalTo("finteger = 1")
      build("finteger:1", columnsInfo) must equalTo("finteger = 1")
      build("finteger>1", columnsInfo) must equalTo("finteger > 1")
      build("finteger:>1", columnsInfo) must equalTo("finteger > 1")
      build("finteger>=1", columnsInfo) must equalTo("finteger >= 1")
      build("finteger:>=1", columnsInfo) must equalTo("finteger >= 1")
      build("finteger<1", columnsInfo) must equalTo("finteger < 1")
      build("finteger:<1", columnsInfo) must equalTo("finteger < 1")
      build("finteger<=1", columnsInfo) must equalTo("finteger <= 1")
      build("finteger:<=1", columnsInfo) must equalTo("finteger <= 1")
      build("finteger<>1", columnsInfo) must equalTo("finteger <> 1")
      build("finteger:<>1", columnsInfo) must equalTo("finteger <> 1")
      build("finteger=1..2", columnsInfo) must equalTo("finteger between 1 and 2")
      build("finteger:1..2", columnsInfo) must equalTo("finteger between 1 and 2")

      build("finteger=*1*", columnsInfo
      ) must throwA[InvalidQueryConditionException].like {
        case e => e.getMessage must matching(""".*Operator '.*' is only allowed for string fields\..*""")
      }

      build("finteger:*1*", columnsInfo
      ) must throwA[InvalidQueryConditionException].like {
        case e => e.getMessage must matching(""".*Operator '.*' is only allowed for string fields\..*""")
      }

      build("finteger$1", columnsInfo
      ) must throwA[InvalidQueryConditionException].like {
        case e => e.getMessage must matching(""".*Operator '.*' is only allowed for string fields\..*""")
      }

      build("finteger:$1", columnsInfo
      ) must throwA[InvalidQueryConditionException].like {
        case e => e.getMessage must matching(""".*Operator '.*' is only allowed for string fields\..*""")
      }

      build("finteger=1*", columnsInfo
      ) must throwA[InvalidQueryConditionException].like {
        case e => e.getMessage must matching(""".*Operator '.*' is only allowed for string fields\..*""")
      }

      build("finteger:1*", columnsInfo
      ) must throwA[InvalidQueryConditionException].like {
        case e => e.getMessage must matching(""".*Operator '.*' is only allowed for string fields\..*""")
      }

      build("finteger=*1", columnsInfo
      ) must throwA[InvalidQueryConditionException].like {
        case e => e.getMessage must matching(""".*Operator '.*' is only allowed for string fields\..*""")
      }

      build("finteger:*1", columnsInfo
      ) must throwA[InvalidQueryConditionException].like {
        case e => e.getMessage must matching(""".*Operator '.*' is only allowed for string fields\..*""")
      }

    }

    "build the sql condition when dealing with string in" in {

      build("fstring=text", columnsInfo) must equalTo("lower(fstring) = 'text'")
      build("fstring:=text", columnsInfo) must equalTo("lower(fstring) = 'text'")
      build("fstring:text", columnsInfo) must equalTo("lower(fstring) like '%text%'")
    }

    "accept ':' char as separator" in {

      build("fstring<>value", columnsInfo) must equalTo(
      build("fstring:<>value", columnsInfo))

      build("fstring>=value", columnsInfo) must equalTo(
      build("fstring:>=value", columnsInfo))

      build("fstring>value", columnsInfo) must equalTo(
      build("fstring:>value", columnsInfo))

      build("fstring<=value", columnsInfo) must equalTo(
      build("fstring:<=value", columnsInfo))

      build("fstring<value", columnsInfo) must equalTo(
      build("fstring:<value", columnsInfo))

      build("fstring=value1..value2", columnsInfo) must equalTo(
      build("fstring:=value1..value2", columnsInfo))

      build("fstring=value1;value2;value3", columnsInfo) must equalTo(
      build("fstring:=value1;value2;value3", columnsInfo))

      build("fstring=value*", columnsInfo) must equalTo(
      build("fstring:=value*", columnsInfo))

      build("fstring=*value", columnsInfo) must equalTo(
      build("fstring:=*value", columnsInfo))

      build("fstring=*value*", columnsInfo) must equalTo(
      build("fstring:=*value*", columnsInfo))

      build("fstring$value", columnsInfo) must equalTo(
      build("fstring$value", columnsInfo))
    }

    "assume contains as operator when no operator is passed and field is a string" in {

      build("fstring=text", columnsInfo) must equalTo("lower(fstring) = 'text'")
      build("fstring:text", columnsInfo) must equalTo("lower(fstring) like '%text%'")

      build("fstring!=text", columnsInfo) must equalTo("(not lower(fstring) = 'text')")
      build("fstring!text", columnsInfo) must equalTo("lower(fstring) not like '%text%'")
      build("fstring:!text", columnsInfo) must equalTo("lower(fstring) not like '%text%'")
    }

    "assume Equal as operator when no operator is passed and field is not a string" in {
      build("finteger=10", columnsInfo) must equalTo("finteger = 10")
      build("finteger:10", columnsInfo) must equalTo("finteger = 10")

      build("finteger!=10", columnsInfo) must equalTo("(not finteger = 10)")
      build("finteger!10", columnsInfo) must equalTo("(not finteger = 10)")
      build("finteger:!10", columnsInfo) must equalTo("(not finteger = 10)")
    }

  }

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
      buildSingleCondition(Condition("field=TexT", "field", false, Equal, List("TexT")), String
      ) must equalTo("lower(field) = 'text'")

      buildSingleCondition(Condition("field=TexT*", "field", false, StartsWith, List("TexT")), String
      ) must equalTo("lower(field) like 'text%'")

      buildSingleCondition(Condition("field=*TexT", "field", false, EndsWith, List("TexT")), String
      ) must equalTo("lower(field) like '%text'")

      buildSingleCondition(Condition("field=*TexT", "field", false, Contains, List("TexT")), String
      ) must equalTo("lower(field) like '%text%'")

      buildSingleCondition(Condition("field=*TexT*", "field", false, Contains, List("TexT")), String
      ) must equalTo("lower(field) like '%text%'")

      buildSingleCondition(Condition("field$TexT", "field", false, Contains, List("TexT")), String
      ) must equalTo("lower(field) like '%text%'")
    }

    "build the sql condition when dealing with string operations, with case unsensitive" in {
      buildSingleCondition(Condition("field$Hi Fellows!", "field", false, Contains, List("Hi Fellows!")), String
      ) must equalTo("lower(field) like '%hi fellows!%'")
    }

    "build the sql negated condition when dealing with string operations" in {
      buildSingleCondition(Condition("field=10", "field", true, Equal, List("10")), String
      ) must equalTo("(not lower(field) = '10')")
    }

    "build the sql condition escaping single quotes when dealing with string operations" in {
      buildSingleCondition(Condition("field=Paul's home", "field", false, Equal, List("Paul's home")), String
      ) must equalTo("lower(field) = 'paul''s home'")
    }

    "build the sql condition leaving double quotes and slashes untouched, case unsensitive" in {
      buildSingleCondition(Condition("""field=Paul"s home""", "field", false, Equal, List("""Paul"s home""")), String
      ) must equalTo("""lower(field) = 'paul"s home'""")

      buildSingleCondition(Condition("""field=Paul\s home""", "field", false, Equal, List("""Paul\s home""")), String
      ) must equalTo("""lower(field) = 'paul\s home'""")
    }

    "build the sql condition when dealing with numeric operations" in {
      buildSingleCondition(Condition("field=10", "field", false, Equal, List("10")), Numeric
      ) must equalTo("field = 10")

      buildSingleCondition(Condition("field:10", "field", false, Equal, List("10")), Numeric
      ) must equalTo("field = 10")

      buildSingleCondition(Condition("field>10", "field", false, Greater, List("10")), Numeric
      ) must equalTo("field > 10")
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
      ) must equalTo("lower(field) between '12' and '15'")
    }

    "build the sql negated condition when dealing with between operator" in {
      buildSingleCondition(Condition("field=12..15", "field", true, Between, List("12", "15")), Numeric
      ) must equalTo("field not between 12 and 15")

      buildSingleCondition(Condition("field=TextA..TextB", "field", true, Between, List("TextA", "TextB")), String
      ) must equalTo("lower(field) not between 'texta' and 'textb'")
    }

    "build the sql condition when dealing with in operator" in {
      buildSingleCondition(Condition("field=12;13;14", "field", false, In, List("12", "13", "14")), Numeric
      ) must equalTo("field in (12, 13, 14)")

      buildSingleCondition(Condition("field=on,true,false", "field", false, In, List("on", "true", "false")), Boolean
      ) must equalTo("field in (1, 1, 0)")

      buildSingleCondition(Condition("field=TexTA;TexTB;teXTc", "field", false, In, List("TexTA", "TexTB", "teXTc")), String
      ) must equalTo("( lower(field) like '%texta%' or lower(field) like '%textb%' or lower(field) like '%textc%' )")

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