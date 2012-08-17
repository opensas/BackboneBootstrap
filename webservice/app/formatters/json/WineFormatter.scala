package formatters.json

import play.api.libs.json.Format
import play.api.libs.json.JsValue
import play.api.libs.json.Json.toJson

import java.util.Date

import models.Wine

import anorm._

import PkFormatter._
import DateFormatter._

object WineFormatter {

  implicit object JsonWineFormatter extends Format[Wine] {

    def writes(o: Wine): JsValue = {
      toJson( Map(
        "id"          -> toJson(o.id),
        "name"        -> toJson(o.name),
        "year"        -> toJson(o.year),
        "grapes"      -> toJson(o.grapes),
        "country"     -> toJson(o.country),
        "region"      -> toJson(o.region),
        "description" -> toJson(o.description),
        "picture"     -> toJson(o.picture)
      ))
    }

    def reads(j: JsValue): Wine = {
      Wine(
        id = (j \ "id").as[Option[Pk[Long]]]                  .getOrElse(NotAssigned),
        name = (j \ "name").as[Option[String]]                .getOrElse("unknown name"),
        year = (j \ "year").as[Option[String]]                .getOrElse(""),
        grapes = (j \ "grapes").as[Option[String]]            .getOrElse(""),
        country = (j \ "country").as[Option[String]]          .getOrElse(""),
        region = (j \ "region").as[Option[String]]            .getOrElse(""),
        description = (j \ "description").as[Option[String]]  .getOrElse(""),
        picture = (j \ "picture").as[Option[String]]          .getOrElse("")
      )
    }

  }

}