package formatters.json

import play.api.libs.json.Format
import play.api.libs.json.JsValue
import play.api.libs.json.Json.toJson

import models.{Review, Wine}

import java.util.Date

import anorm._

import PkFormatter._
import DateFormatter._

import WineFormatter._

object ReviewFormatter {

  implicit object JsonReviewFormatter extends Format[Review] {

    def writes(o: Review): JsValue = {
      toJson( Map(
        "id"          -> toJson(o.id),
        "wine"        -> toJson(o.wine),
        "author"      -> toJson(o.author),
        "text"        -> toJson(o.text),
        "date"        -> toJson(o.date)
      ))
    }

    def reads(j: JsValue): Review = {
      Review.fromParser(
        id       = (j \ "id")           .as[Option[Pk[Long]]] .getOrElse(NotAssigned),
        wine_id  = (j \ "wine" \ "id")  .as[Option[Long]],
        author   = (j \ "author")       .as[Option[String]]   .getOrElse("unknown author"),
        text     = (j \ "text")         .as[Option[String]]   .getOrElse(""),
        date     = (j \ "date")         .as[Option[Date]]
      )
    }

  }

}
