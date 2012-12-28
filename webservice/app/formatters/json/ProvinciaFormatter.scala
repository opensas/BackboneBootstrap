package formatters.json

import play.api.libs.json.Format
import play.api.libs.json.JsValue
import play.api.libs.json.Json.toJson

import models.Provincia

import anorm._

import PkFormatter._
import DateFormatter._

object ProvinciaFormatter {

  implicit object JsonProvinciaFormatter extends Format[Provincia] {

    def writes(o: Provincia): JsValue = {
      toJson( Map(
        "id"            -> toJson(o.id),
        "codigo"        -> toJson(o.codigo),
        "nombre"        -> toJson(o.nombre)
      ))
    }

    def reads(j: JsValue): Provincia = {
      Provincia(
        id      = (j \ "id")      .as[Option[Pk[Long]]]     .getOrElse(NotAssigned),
        codigo  = (j \ "codigo")  .as[Option[String]]       .getOrElse("NN"),
        nombre  = (j \ "nombre")  .as[Option[String]]       .getOrElse("provincia desconocida")
      )
    }

  }

}