package controllers

import play.api._
import play.api.mvc._

import models.{Wine, Error}
import anorm.Id

import play.api.libs.json.Json.toJson

import formatters.json.WineFormatter._
import formatters.json.ErrorFormatter._

import scala.collection.immutable.Map
import utils.CORSAction
import utils.{JsonBadRequest, JsonNotFound, JsonOk}
import utils.Http

object Wines extends Controller {
  
  def list = CORSAction { request =>
    Ok(toJson(Wine.find(request.queryString)))
  }

  def count = CORSAction { request =>
    Ok(toJson(Wine.count(request.queryString)))
  }

  def show(id: Long) = CORSAction {
    Wine.findById(id).map { wine =>
      Ok(toJson(wine))
    }.getOrElse(JsonNotFound("Wine with id %s not found".format(id)))
  }

  def save() = CORSAction { request =>
    request.body.asJson.map { json =>
      json.asOpt[Wine].map { wine =>
        wine.save.fold(
          errors => JsonBadRequest(errors),
          wine => Ok(toJson(wine).toString)
        )
      }.getOrElse     (JsonBadRequest("Invalid Wine entity"))
    }.getOrElse       (JsonBadRequest("Expecting JSON data"))
  }

  def update(id: Long) = CORSAction { implicit request =>
    request.body.asJson.map { json =>
      json.asOpt[Wine].map { wine =>
        wine.copy(id=Id(id)).update.fold(
          errors => JsonBadRequest(errors),
          wine => Ok(toJson(wine).toString)
        )
      }.getOrElse       (JsonBadRequest("Invalid Wine entity"))
    }.getOrElse         (JsonBadRequest("Expecting JSON data"))
  }

  def delete(id: Long) = CORSAction {
    Wine.delete(id)
    JsonOk("Wine successfully deleted","Wine with id %s deleted".format(id))
  }

  def parse[T: play.api.libs.json.Reads](request: Request[AnyContent]): Option[T] = {
    request.body.asJson.map { json =>
      json.asOpt[T]
    }.getOrElse(None)
  }

  // import play.api.libs.json.JsValue
  // type EntityWithJsonFormatter[T,F] = T
  // type EntityFormatter[T,F] = F {def reads(j: JsValue): T}

  // def parse[T: EntityWithJsonFormatter, F:EntityFormatter](request: Request[AnyContent]): Option[T] = {
  //   request.body.asJson.map { json =>
  //     json.asOpt[T].map { entity =>
  //       entity
  //     }
  //   }
  // }

}