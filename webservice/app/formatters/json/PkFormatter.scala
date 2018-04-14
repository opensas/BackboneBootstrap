package formatters.json

import play.api.libs.json.Json.toJson
import play.api.libs.json.JsValue
import play.api.libs.json.Format
import play.api.libs.json.{JsResult, JsSuccess}


import anorm.Pk
import anorm.NotAssigned
import anorm.Id

object PkFormatter {

  implicit object JsonPkFormatter extends Format[Pk[Long]] {

    def writes(pk: Pk[Long]): JsValue = {
      toJson(
        pk.map(id=>id).getOrElse(0L)
      )
    }

    def reads(j: JsValue): JsResult[Pk[Long]] = {
      j.as[Long] match {
        case 0 => JsSuccess(NotAssigned)
        case id => JsSuccess(Id[Long](id))
      }
    }

  }

}
