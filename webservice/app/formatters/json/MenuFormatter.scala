package formatters.json

import play.api.libs.json.Format
import play.api.libs.json.JsValue
import play.api.libs.json.Json.toJson

import models.Menu

import anorm._

import PkFormatter._
import DateFormatter._

object MenuFormatter {

  implicit object JsonMenuFormatter extends Format[Menu] {

    def writes(o: Menu): JsValue = {
      toJson( Map(
        "MenuId"          -> toJson(o.MenuId),
        "Tipo"            -> toJson(o.Tipo),
        "MenuPadreId"     -> toJson(o.MenuPadreId),
        "Orden"           -> toJson(o.Orden),
        "Nombre"          -> toJson(o.Nombre),
        "Descripcion"     -> toJson(o.Descripcion),
        "Url"             -> toJson(o.Url),
        "Permiso"         -> toJson(o.Permiso),
        "Ayuda"           -> toJson(o.Ayuda),
        "Mostrar"         -> toJson(o.Mostrar)
      ))
    }

    def reads(j: JsValue): Menu = {
      Menu(
        MenuId      = (j \ "MenuId")        .as[Option[Pk[Long]]]     .getOrElse(NotAssigned),
        Tipo        = (j \ "Tipo")          .as[Option[String]]       .getOrElse("menu"),
        MenuPadreId = (j \ "MenuPadreId")   .as[Option[Option[Long]]] .getOrElse(None),
        Orden       = (j \ "Orden")         .as[Option[Long]]         .getOrElse(1L),
        Nombre      = (j \ "Nombre")        .as[Option[String]]       .getOrElse(""),
        Descripcion = (j \ "Descripcion")   .as[Option[String]]       .getOrElse(""),
        Url         = (j \ "Url")           .as[Option[String]]       .getOrElse(""),
        Permiso     = (j \ "Permiso")       .as[Option[String]]       .getOrElse(""),
        Ayuda       = (j \ "Ayuda")         .as[Option[String]]       .getOrElse(""),
        Mostrar     = (j \ "Mostrar")       .as[Option[Boolean]]      .getOrElse(true)
      )
    }

  }

}