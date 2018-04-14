package formatters.json

import play.api.libs.json.Format
import play.api.libs.json.JsValue
import play.api.libs.json.Json.toJson
import play.api.libs.json.{JsResult, JsSuccess}

import models.Error

object ErrorFormatter {

  implicit object JsonErrorFormatter extends Format[Error] {

    def writes(o: Error): JsValue = {
      toJson( Map(
        "status"            -> toJson(o.status),
        "errorCode"         -> toJson(o.errorCode),
        "field"             -> toJson(o.field),
        "message"           -> toJson(o.message),
        "developerMessage"  -> toJson(o.developerMessage)
      ))
    }

    def reads(j: JsValue): JsResult[Error] = {
      JsSuccess(Error(
        status            = (j \ "status").as[Int],
        errorCode         = (j \ "errorCode").as[Int],
        field             = (j \ "field").as[String],
        message           = (j \ "message").as[String],
        developerMessage  = (j \ "developerMessage").as[String]
      ))
    }

  }

}
