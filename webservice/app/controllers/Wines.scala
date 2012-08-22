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

object Wines extends Controller {
  
  def list = CORSAction { request =>
    val (page, len, order, filter) = parseQuery(request.queryString)
    Ok(toJson(Wine.find(page, len, order, filter)))
  }

  def count = CORSAction { request =>
    val (page, len, order, filter) = parseQuery(request.queryString)
    Ok(toJson(Wine.count(filter)))
  }

  // page, len, order, filter
  private def parseQuery(query: Map[String, Seq[String]]): (Int, Int, String, String) = {
    //val map: Map[String, String] = Http.flatQueryString(query)

    import utils.Http._

    val map: Map[String, String] = query          // Http.toFlatQueryString

    val page: Int = map.getOrElse("page","1").toInt
    val len: Int = map.getOrElse("len", Wine.DEFAULT_PAGE_LEN.toString).toInt
    val order = map.getOrElse("order", "name")
    val filter = map.getOrElse("filter", "")

    (page, len, order, filter)
  }

  def show(id: Long) = CORSAction {
    Wine.findById(id).map { Wine =>
      Ok(toJson(Wine))
    }.getOrElse(JsonNotFound("Wine with id %s not found".format(id)))
  }

  def save() = CORSAction { request =>
    request.body.asJson.map { json =>
      json.asOpt[Wine].map { wine =>
        wine.save.map { wine => 
          Ok(toJson(wine.update).toString)
        }.getOrElse   (JsonBadRequest("Error creating Wine entity"))
      }.getOrElse     (JsonBadRequest("Invalid Wine entity"))
    }.getOrElse       (JsonBadRequest("Expecting JSON data"))
  }

  def update(id: Long) = CORSAction { implicit request =>
    request.body.asJson.map { json =>
      json.asOpt[Wine].map { wine =>
        wine.copy(id=Id(id)).update.map { wine => 
          Ok(toJson(wine.update).toString)
        }.getOrElse     (JsonBadRequest("Error updating Wine entity"))
      }.getOrElse       (JsonBadRequest("Invalid Wine entity"))
    }.getOrElse         (JsonBadRequest("Expecting JSON data"))
  }

  def delete(id: Long) = CORSAction {
    Wine.delete(id)
    JsonOk("Wine successfully deleted","Wine with id %s deleted".format(id))
  }

}