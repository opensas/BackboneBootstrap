package controllers

import play.api._
import play.api.mvc._

import models.{Zona, Error}
import anorm.Id

import play.api.libs.json.Json.toJson

import formatters.json.ZonaFormatter._
import formatters.json.ErrorFormatter._

import scala.collection.immutable.Map
import utils.CORSAction
import utils.{JsonBadRequest, JsonNotFound, JsonOk}
import utils.Http

object Zonas extends Controller {

  def list = CORSAction { request =>
    Ok(toJson(Zona.find(request.queryString)))
  }

  def count = CORSAction { request =>
    Ok(toJson(Zona.count(request.queryString)))
  }

  def show(id: Long) = CORSAction {
    Zona.findById(id).map { zona =>
      Ok(toJson(zona))
    }.getOrElse(JsonNotFound("No existe la zona con id %s".format(id)))
  }

  def save() = CORSAction { request =>
    request.body.asJson.map { json =>
      json.asOpt[Zona].map { zona =>
        zona.save.fold(
          errors => JsonBadRequest(errors),
          zona => Ok(toJson(zona).toString)
        )
      }.getOrElse     (JsonBadRequest("Entidad de zona no valida"))
    }.getOrElse       (JsonBadRequest("JSON no valido"))
  }

  def update(id: Long) = CORSAction { implicit request =>
    request.body.asJson.map { json =>
      json.asOpt[Zona].map { zona =>
        zona.copy(id=Id(id)).update.fold(
          errors => JsonBadRequest(errors),
          zona => Ok(toJson(zona).toString)
        )
      }.getOrElse     (JsonBadRequest("Entidad de zona no valida"))
    }.getOrElse       (JsonBadRequest("JSON no valido"))
  }

  def delete(id: Long) = CORSAction {
    Zona.delete(id)
    JsonOk("Se ha eliminado la zona","Zona con id %s eliminada".format(id))
  }

}
