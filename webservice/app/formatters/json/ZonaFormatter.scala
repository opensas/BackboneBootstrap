package formatters.json

import play.api.libs.json.Format
import play.api.libs.json.JsValue
import play.api.libs.json.Json.toJson

import models.Zona

import anorm._

import PkFormatter._
import DateFormatter._

object ZonaFormatter {

  implicit object JsonZonaFormatter extends Format[Zona] {

    def writes(o: Zona): JsValue = {
      toJson( Map(
        "ZonaId"        -> toJson(o.id),
        "Codigo"        -> toJson(o.codigo),
        "Descripcion"   -> toJson(o.descripcion)
      ))
    }

    def reads(j: JsValue): Zona = {
      Zona(
        id          = (j \ "ZonaId")      .as[Option[Pk[Long]]] .getOrElse(NotAssigned),
        codigo      = (j \ "Codigo")      .as[Option[String]]   .getOrElse("NN"),
        descripcion = (j \ "Descripcion") .as[Option[String]]   .getOrElse("zona desconocida")
      )
    }

  }

}
