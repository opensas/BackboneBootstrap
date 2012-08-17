package utils

import com.codahale.jerkson.Json.generate

import play.api.libs.json.JsValue

object Json {

  def asJson(any: Any) = {
    com.codahale.jerkson.Json.generate(any)
  }

  def asOptionLong(jsValue: JsValue): Option[Long] = {
    try {
      jsValue.as[Option[Long]]
    } catch {
      case e => None
    }
  }

}