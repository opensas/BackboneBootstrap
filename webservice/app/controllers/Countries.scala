package controllers

import play.api._
import play.api.mvc._

import models.{Country, Error}
import anorm.Id

import play.api.libs.json.Json.toJson

import formatters.json.CountryFormatter._
import formatters.json.ErrorFormatter._

import scala.collection.immutable.Map
import utils.CORSAction
import utils.{JsonBadRequest, JsonNotFound, JsonOk}
import utils.Http

object Countries extends Controller {
  
  def list = CORSAction { request =>
    Ok(toJson(Country.find(request.queryString)))
  }

  def count = CORSAction { request =>
    Ok(toJson(Country.count(request.queryString)))
  }

  def show(id: Long) = CORSAction {
    Country.findById(id).map { country =>
      Ok(toJson(country))
    }.getOrElse(JsonNotFound("Country with id %s not found".format(id)))
  }

  def save() = CORSAction { request =>
    request.body.asJson.map { json =>
      json.asOpt[Country].map { country =>
        country.save.fold(
          errors => JsonBadRequest(errors),
          country => Ok(toJson(country).toString)
        )
      }.getOrElse     (JsonBadRequest("Invalid Country entity"))
    }.getOrElse       (JsonBadRequest("Expecting JSON data"))
  }

  def update(id: Long) = CORSAction { implicit request =>
    request.body.asJson.map { json =>
      json.asOpt[Country].map { country =>
        country.copy(id=Id(id)).update.fold(
          errors => JsonBadRequest(errors),
          country => Ok(toJson(country).toString)
        )
      }.getOrElse       (JsonBadRequest("Invalid Country entity"))
    }.getOrElse         (JsonBadRequest("Expecting JSON data"))
  }

  def delete(id: Long) = CORSAction {
    Country.delete(id)
    JsonOk("Country successfully deleted","Country with id %s deleted".format(id))
  }

  def parse[T: play.api.libs.json.Reads](request: Request[AnyContent]): Option[T] = {
    request.body.asJson.map { json =>
      json.asOpt[T]
    }.getOrElse(None)
  }

}