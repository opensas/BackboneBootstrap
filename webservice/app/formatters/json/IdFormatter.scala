package formatters.json

import play.api.libs.json.Json.toJson
import play.api.libs.json.JsValue
import play.api.libs.json.Format

import anorm.Pk
import anorm.NotAssigned
import anorm.Id

object IdFormatter {

  implicit object JsonIdFormatter extends Format[Option[Long]] {

    def writes(id: Option[Long]): JsValue = {
      toJson(
        id.map(id=>id).getOrElse(0L)
      )
    }

    def reads(j: JsValue): Option[Long] = {
      j.as[Long] match {
        case 0 => None
        case id => Option[Long](id)
      }
    }

  }

}
