package formatters.json

import play.api.libs.json.Json.toJson
import play.api.libs.json.JsValue
import play.api.libs.json.Format
import play.api.libs.json.{JsUndefined, JsNull}

import play.api.libs.json.{JsResult, JsSuccess, JsError}

import java.util.Date
import java.text.SimpleDateFormat

import utils.Conversion.toDate
import play._

object DateFormatter {

  implicit object JsonDateFormatter extends Format[Option[Date]] {

    val dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss'Z'")

    def writes(date: Option[Date]): JsValue = {
      toJson(
        date.map(
          date => dateFormat.format(date)
        ).getOrElse(
          ""
        )
      )
    }

    def reads(j: JsValue): JsResult[Option[Date]] = {
      if (j.isInstanceOf[JsUndefined] || j == JsNull) {
        JsSuccess(None)
      } else {
        toDate(j.as[String], dateFormat).map(
          date => JsSuccess(Some(date))
        ).getOrElse(
          JsError("could not parse date. Valid format: %s".format(dateFormat))
        )
      }
    }
  }

}
