package formatters.json

import play.api.libs.json.Format
import play.api.libs.json.JsValue
import play.api.libs.json.Json.toJson
import play.api.libs.json.{JsResult, JsSuccess}

import models.Localidad

import anorm._

import PkFormatter._
import DateFormatter._

object LocalidadFormatter {

  implicit object JsonLocalidadFormatter extends Format[Localidad] {

    def writes(o: Localidad): JsValue = {
      toJson( Map(
        "LocalidadId"   -> toJson(o.id),
        "ProvinciaId"   -> toJson(o.provincia_id),
        "Codigo"        -> toJson(o.codigo),
        "Descripcion"   -> toJson(o.descripcion)
      ))
    }

    def reads(j: JsValue): JsResult[Localidad] = {
      JsSuccess(Localidad(
        id              = (j \ "LocalidadId")     .as[Option[Pk[Long]]]     .getOrElse(NotAssigned),
        provincia_id    = (j \ "ProvinciaId")     .as[Option[Long]]         .getOrElse(-1),
        codigo          = (j \ "Codigo")          .as[Option[String]]       .getOrElse("NN"),
        descripcion     = (j \ "Descripcion")     .as[Option[String]]       .getOrElse("localidad desconocida")
      ))
    }

  }

}
