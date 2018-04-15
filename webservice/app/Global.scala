import play.api._
import play.api.mvc._
import play.api.mvc.Results._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

import models.Error
import formatters.json.ErrorFormatter._

import play.api.libs.json.Json.toJson

import play.api.http.Status

object Global extends GlobalSettings {

  override def onError(request: RequestHeader, ex: Throwable) = Future {
    InternalServerError(toJson(
      Error(
        status = Status.INTERNAL_SERVER_ERROR,
        message = "Internal server error",
        developerMessage = ex.getMessage()
      )
    ))
  }

  override def onBadRequest(request: RequestHeader, error: String) = Future {
    BadRequest(toJson(
      Error(status = Status.BAD_REQUEST, message = error)
    ))

  }

}
