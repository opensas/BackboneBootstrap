package controllers

import play.api._
import play.api.mvc._

import models.{Review, Error}
import anorm.Id

import play.api.libs.json.Json.toJson

import formatters.json.ReviewFormatter._
import formatters.json.ErrorFormatter._

import scala.collection.immutable.Map
import utils.CORSAction
import utils.{JsonBadRequest, JsonNotFound, JsonOk}
import utils.Http

object Reviews extends Controller {

  def list = CORSAction { request =>
    Ok(toJson(Review.find(request.queryString)))
  }

  def count = CORSAction { request =>
    Ok(toJson(Review.count(request.queryString)))
  }

  def show(id: Long) = CORSAction {
    Review.findById(id).map { review =>
      Ok(toJson(review))
    }.getOrElse(JsonNotFound("Review with id %s not found".format(id)))
  }

  def save() = CORSAction { request =>
    request.body.asJson.map { json =>
      json.asOpt[Review].map { review =>
        review.save.fold(
          errors => JsonBadRequest(errors),
          review => Ok(toJson(review).toString)
        )
      }.getOrElse     (JsonBadRequest("Invalid Review entity"))
    }.getOrElse       (JsonBadRequest("Expecting JSON data"))
  }

  def update(id: Long) = CORSAction { implicit request =>
    request.body.asJson.map { json =>
      json.asOpt[Review].map { review =>
        review.copy(id=Id(id)).update.fold(
          errors => JsonBadRequest(errors),
          review => Ok(toJson(review).toString)
        )
      }.getOrElse       (JsonBadRequest("Invalid Review entity"))
    }.getOrElse         (JsonBadRequest("Expecting JSON data"))
  }

  def delete(id: Long) = CORSAction {
    Review.delete(id)
    JsonOk("Review successfully deleted","Review with id %s deleted".format(id))
  }

}
