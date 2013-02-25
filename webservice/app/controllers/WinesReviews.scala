package controllers

import play.api._
import play.api.mvc._

import models.{Review, Wine, Error}
import anorm.Id

import play.api.libs.json.Json.toJson

import formatters.json.ReviewFormatter._
import formatters.json.ErrorFormatter._

import scala.collection.immutable.Map
import utils.CORSAction
import utils.{JsonBadRequest, JsonNotFound, JsonOk}
import utils.Http

object WinesReviews extends Controller {

  def list(wineId: Long) = CORSAction { request =>
    Ok(toJson(Review.findWithCondition(request.queryString, "wine_id=%s".format(wineId))))
  }

  def count(wineId: Long) = CORSAction { request =>
    Ok(toJson(Review.countWithCondition(request.queryString, "wine_id=%s".format(wineId))))
  }

  def show(wineId: Long, id: Long) = CORSAction {
    Wine.findById(wineId).map { wine =>
      Review.findById(id).map { review =>
        if (review.wine.get.id.get != wineId) {
          JsonNotFound("The review with id %s is not about the wine with id %s".format(id, wineId))
        } else {
          Ok(toJson(review))
        }
      }.getOrElse(JsonNotFound("Review with id %s not found".format(id)))
    }.getOrElse(JsonNotFound("Wine with id %s not found".format(wineId)))
  }

  def save(wineId: Long) = CORSAction { request =>
    request.body.asJson.map { json =>
      json.asOpt[Review].map { review =>
        review.copy(wine = Wine.findById(wineId)).save.fold(
          errors => JsonBadRequest(errors),
          review => Ok(toJson(review).toString)
        )
      }.getOrElse     (JsonBadRequest("Invalid Review entity"))
    }.getOrElse       (JsonBadRequest("Expecting JSON data"))
  }

  def update(wineId: Long, id: Long) = CORSAction { implicit request =>
    Wine.findById(wineId).map { wine =>
      Review.findById(id).map { review =>
        if (review.wine.get.id.get != wineId) {
          JsonNotFound("The review with id %s is not about the wine with id %s".format(id, wineId))
        } else {
          request.body.asJson.map { json =>
            json.asOpt[Review].map { review =>
              review.copy(id=Id(id)).update.fold(
                errors => JsonBadRequest(errors),
                review => Ok(toJson(review).toString)
              )
            }.getOrElse     (JsonBadRequest("Invalid Review entity"))
          }.getOrElse       (JsonBadRequest("Expecting JSON data"))
        }
      }.getOrElse(JsonNotFound("Review with id %s not found".format(id)))
    }.getOrElse(JsonNotFound("Wine with id %s not found".format(wineId)))
  }

  def delete(wineId: Long, id: Long) = CORSAction {
    Wine.findById(wineId).map { wine =>
      Review.findById(id).map { review =>
        if (review.wine.get.id.get != wineId) {
          JsonNotFound("The review with id %s is not about the wine with id %s".format(id, wineId))
        } else {
          Review.delete(id)
          JsonOk("Review successfully deleted","Review with id %s deleted".format(id))
        }
      }.getOrElse(JsonNotFound("Review with id %s not found".format(id)))
    }.getOrElse(JsonNotFound("Wine with id %s not found".format(wineId)))
  }

}
