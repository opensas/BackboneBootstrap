package controllers

import play.api._
import play.api.mvc._

object Application extends Controller {
  
  def frontend = Action {
    Redirect(routes.Assets.at("index.html"))
  }

  def index = Action {
    Ok(views.html.index())
  }

  def options(url: String) = Action {
    Ok("").withHeaders(
      "Access-Control-Allow-Origin" -> "*",
      "Access-Control-Allow-Methods" -> "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers" -> "Content-Type, X-Requested-With, Accept",
      // cache access control response for one day
      "Access-Control-Max-Age" -> (60 * 60 * 24).toString
    )
  }

}
