package controllers

import play.api._
import play.api.mvc._

import models.{Menu, Error}
import anorm.Id

import play.api.libs.json.Json.toJson

import formatters.json.MenuFormatter._
import formatters.json.ErrorFormatter._

import scala.collection.immutable.Map
import utils.CORSAction
import utils.{JsonBadRequest, JsonNotFound, JsonOk}
import utils.Http

object Menues extends Controller {
  
  def list = CORSAction { request =>
    Ok(toJson(Menu.find(request.queryString)))
  }

  def count = CORSAction { request =>
    Ok(toJson(Menu.count(request.queryString)))
  }

  def show(id: Long) = CORSAction {
    Menu.findById(id).map { menu =>
      Ok(toJson(menu))
    }.getOrElse(JsonNotFound("No existe el menu con id %s".format(id)))
  }

  def save() = CORSAction { request =>
    request.body.asJson.map { json =>
      json.asOpt[Menu].map { menu =>
        menu.save.fold(
          errors => JsonBadRequest(errors),
          menu => Ok(toJson(menu).toString)
        )
      }.getOrElse     (JsonBadRequest("Entidad de menu no valida"))
    }.getOrElse       (JsonBadRequest("JSON no valido"))
  }

  def update(id: Long) = CORSAction { implicit request =>
    request.body.asJson.map { json =>
      json.asOpt[Menu].map { menu =>
        menu.copy(MenuId=Id(id)).update.fold(
          errors => JsonBadRequest(errors),
          menu => Ok(toJson(menu).toString)
        )
      }.getOrElse     (JsonBadRequest("Entidad de menu no valida"))
    }.getOrElse       (JsonBadRequest("JSON no valido"))
  }

  def delete(id: Long) = CORSAction {
    Menu.delete(id)
    JsonOk("Se ha eliminado la menu","Menu con id %s eliminada".format(id))
  }

}