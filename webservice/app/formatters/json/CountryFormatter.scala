package formatters.json

import play.api.libs.json.Format
import play.api.libs.json.JsValue
import play.api.libs.json.Json.toJson

import java.util.Date

import models.Country

import anorm._

import PkFormatter._
import DateFormatter._

object CountryFormatter {

  implicit object JsonCountryFormatter extends Format[Country] {

    def writes(o: Country): JsValue = {
      toJson( Map(
        "id"          -> toJson(o.id),
        "code"        -> toJson(o.code),
        "name"        -> toJson(o.name)
      ))
    }

    def reads(j: JsValue): Country = {
      Country(
        id = (j \ "id").as[Option[Pk[Long]]]                  .getOrElse(NotAssigned),
        code = (j \ "code").as[Option[String]]                .getOrElse("NN"),
        name = (j \ "name").as[Option[String]]                .getOrElse("unknown country")
      )
    }

  }

}