package controllers

import play.api._
import play.api.mvc._

import models.{Provincia, Error}
import anorm.Id

import play.api.libs.json.Json.toJson

import formatters.json.ProvinciaFormatter._
import formatters.json.ErrorFormatter._

import scala.collection.immutable.Map
import utils.CORSAction
import utils.{JsonBadRequest, JsonNotFound, JsonOk}
import utils.Http

object Provincias extends Controller {
  
  def list = CORSAction { request =>
    Ok(toJson(Provincia.find(request.queryString)))
  }

  def count = CORSAction { request =>
    Ok(toJson(Provincia.count(request.queryString)))
  }

  def show(id: Long) = CORSAction {
    Provincia.findById(id).map { provincia =>
      Ok(toJson(provincia))
    }.getOrElse(JsonNotFound("No existe la provincia con id %s".format(id)))
  }

  def save() = CORSAction { request =>
    request.body.asJson.map { json =>
      json.asOpt[Provincia].map { provincia =>
        provincia.save.fold(
          errors => JsonBadRequest(errors),
          provincia => Ok(toJson(provincia).toString)
        )
      }.getOrElse     (JsonBadRequest("Entidad de provincia no valida"))
    }.getOrElse       (JsonBadRequest("JSON no valido"))
  }

  def update(id: Long) = CORSAction { implicit request =>
    request.body.asJson.map { json =>
      json.asOpt[Provincia].map { provincia =>
        provincia.copy(id=Id(id)).update.fold(
          errors => JsonBadRequest(errors),
          provincia => Ok(toJson(provincia).toString)
        )
      }.getOrElse     (JsonBadRequest("Entidad de provincia no valida"))
    }.getOrElse       (JsonBadRequest("JSON no valido"))
  }

  def delete(id: Long) = CORSAction {
    Provincia.delete(id)
    JsonOk("Se ha eliminado la provincia","Provincia con id %s eliminada".format(id))
  }

}