package formatters.json

import play.api.libs.json.Format
import play.api.libs.json.JsValue
import play.api.libs.json.Json.toJson

import models.{Provincia, Zona}

import anorm._

import java.util.Date

import PkFormatter._
import DateFormatter._
import ZonaFormatter._
import DateFormatter._

object ProvinciaFormatter {

  implicit object JsonProvinciaFormatter extends Format[Provincia] {

    def writes(o: Provincia): JsValue = {
      toJson( Map(
        "ProvinciaId"     -> toJson(o.id),
        "Zona"            -> toJson(o.zona),
        "Codigo"          -> toJson(o.codigo),
        "Descripcion"     -> toJson(o.descripcion),
        "Habilitada"      -> toJson(o.habilitada),
        "Fundacion"       -> toJson(o.fundacion)
      ))
    }

    def reads(j: JsValue): Provincia = {
      Provincia.fromParser(
        id          = (j \ "ProvinciaId")     .as[Option[Pk[Long]]]  .getOrElse(NotAssigned),
        zona_id     = (j \ "Zona" \ "ZonaId") .as[Option[Long]],
        codigo      = (j \ "Codigo")          .as[Option[String]]    .getOrElse("NN"),
        descripcion = (j \ "Descripcion")     .as[Option[String]]    .getOrElse("provincia desconocida"),
        habilitada  = (j \ "Habilitada")      .as[Option[Int]]       .getOrElse(1),
        fundacion   = (j \ "Fundacion")       .as[Option[Date]]
      )
    }

  }

}
