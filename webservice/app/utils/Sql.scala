package utils

import utils.sql.FieldType

object Sql {

  def sanitize(value: String): String = {
    value.replaceAll("'", "''")
  }

  def formatValue(value: String)(implicit fieldType: FieldType.Value): String = {

    import utils.sql.FieldType._

    fieldType match {
      case Numeric  => value
      case String   => "'" + sanitize(value) + "'"
      // #TODO
      case Date     => value
      case Boolean  => {
        value.toLowerCase match {
          case "0" | "off" | "false" | "no" | "null" => "0"
          case _ => "1"
        }
      }
      case Unknown  => value
    }
  }
}