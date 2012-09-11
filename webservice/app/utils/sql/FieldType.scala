package utils.sql

import java.sql.Types._

object FieldType extends Enumeration {

  val Numeric         = Value("numeric")
  val String          = Value("string")
  val Date            = Value("date")
  val Boolean         = Value("boolean")
  val Unknown         = Value("unknown")

  def toFieldType(value: String): FieldType.Value = {
    if (value==null) {
      FieldType.Unknown
    } else {
      value.toLowerCase match {
        case "numeric" | "integer"    => FieldType.Numeric
        case "string"                 => FieldType.String
        case "date"                   => FieldType.Date
        case "boolean"                => FieldType.Boolean
        case "unknown" | _            => FieldType.Unknown
      }
    }
  }

  def toFieldType(value: Int): FieldType.Value = {
    value match {
      case  BIGINT | DECIMAL | DOUBLE | FLOAT | INTEGER | 
            NUMERIC | REAL | SMALLINT | TINYINT             => FieldType.Numeric
      case  CHAR | NCHAR | LONGVARCHAR | LONGNVARCHAR | 
            VARCHAR | NVARCHAR                              => FieldType.String
      case  DATE | TIME                                     => FieldType.Date
      case  BIT | BOOLEAN                                   => FieldType.Boolean
      case _                                                => FieldType.Unknown
    }
  }

}