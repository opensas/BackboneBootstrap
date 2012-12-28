package formatters.json

import play.api.libs.json.Format
import play.api.libs.json.JsValue
import play.api.libs.json.Json.toJson

import models.Localidad

import anorm._

import PkFormatter._
import DateFormatter._

object LocalidadFormatter {

  implicit object JsonLocalidadFormatter extends Format[Localidad] {

    def writes(o: Localidad): JsValue = {
      toJson( Map(
        "id"            -> toJson(o.id),
        "provincia_id"  -> toJson(o.provincia_id),
        "codigo"        -> toJson(o.codigo),
        "nombre"        -> toJson(o.nombre)
      ))
    }

    def reads(j: JsValue): Localidad = {
      Localidad(
        id              = (j \ "id")            .as[Option[Pk[Long]]]     .getOrElse(NotAssigned),
        provincia_id    = (j \ "provincia_id")  .as[Option[Long]]         .getOrElse(-1),
        codigo          = (j \ "codigo")        .as[Option[String]]       .getOrElse("NN"),
        nombre          = (j \ "nombre")        .as[Option[String]]       .getOrElse("localidad desconocida")
      )
    }

  }

}