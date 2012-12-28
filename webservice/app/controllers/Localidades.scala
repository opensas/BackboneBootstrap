package controllers

import play.api._
import play.api.mvc._

import models.{Localidad, Provincia, Error}
import anorm.Id

import play.api.libs.json.Json.toJson

import formatters.json.LocalidadFormatter._
import formatters.json.ErrorFormatter._

import scala.collection.immutable.Map
import utils.CORSAction
import utils.{JsonBadRequest, JsonNotFound, JsonOk}
import utils.Http

object Localidades extends Controller {
  
  def list(provinciaId: Long) = CORSAction { request =>
    Ok(toJson(Localidad.findWithCondition(request.queryString, "provincia_id=%s".format(provinciaId))))
  }

  def count(provinciaId: Long) = CORSAction { request =>
    Ok(toJson(Localidad.countWithCondition(request.queryString, "provincia_id=%s".format(provinciaId))))
  }

  def show(provinciaId: Long, id: Long) = CORSAction {
    Provincia.findById(provinciaId).map { provincia =>
      Localidad.findById(id).map { localidad =>
        if (localidad.provincia_id != provinciaId) {
          JsonNotFound("La localidad con id %s no pertenece a la provincia con id %s".format(id, provinciaId))
        } else {
          Ok(toJson(localidad))
        }
      }.getOrElse(JsonNotFound("No existe la localidad con id %s".format(id)))
    }.getOrElse(JsonNotFound("No existe la provincia con id %s".format(provinciaId)))
  }

  def save(provinciaId: Long) = CORSAction { request =>
    request.body.asJson.map { json =>
      json.asOpt[Localidad].map { localidad =>
        localidad.copy(provincia_id = provinciaId).save.fold(
          errors => JsonBadRequest(errors),
          localidad => Ok(toJson(localidad).toString)
        )
      }.getOrElse     (JsonBadRequest("Entidad de localidad no valida"))
    }.getOrElse       (JsonBadRequest("JSON no valido"))
  }

  def update(provinciaId: Long, id: Long) = CORSAction { implicit request =>
    Provincia.findById(provinciaId).map { provincia_db =>
      Localidad.findById(id).map { localidad_db =>
        if (localidad_db.provincia_id != provinciaId) {
          JsonNotFound("La localidad con id %s no pertenece a la provincia con id %s".format(id, provinciaId))
        } else {
          request.body.asJson.map { json =>
            json.asOpt[Localidad].map { localidad =>
              localidad.copy(id=Id(id)).update.fold(
                errors => JsonBadRequest(errors),
                localidad => Ok(toJson(localidad).toString)
              )
            }.getOrElse     (JsonBadRequest("Entidad de localidad no valida"))
          }.getOrElse       (JsonBadRequest("JSON no valido"))
        }
      }.getOrElse(JsonNotFound("No existe la localidad con id %s".format(id)))
    }.getOrElse(JsonNotFound("No existe la provincia con id %s".format(provinciaId)))
  }

  def delete(provinciaId: Long, id: Long) = CORSAction {
    Provincia.findById(provinciaId).map { provincia =>
      Localidad.findById(id).map { localidad =>
        if (localidad.provincia_id != provinciaId) {
          JsonNotFound("La localidad con id %s no pertenece a la provincia con id %s".format(id, provinciaId))
        } else {
          Localidad.delete(id)
          JsonOk("Se ha eliminado la localidad","Localidad con id %s eliminada".format(id))
        }
      }.getOrElse(JsonNotFound("No existe la localidad con id %s".format(id)))
    }.getOrElse(JsonNotFound("No existe la provincia con id %s".format(provinciaId)))
  }

}