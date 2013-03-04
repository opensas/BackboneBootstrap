package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._

import java.util.Date

import utils.Validate

import utils.Conversion.{pkToLong, fkToLong}

case class Review (

  val id: Pk[Long] = NotAssigned,

  val wine:         Option[Wine] = None,
  val author:       String = "unknown author",
  val text:         String = "",
  val date:         Option[Date] = None
)
  extends Entity
{
  def update()  = Review.update(this)
  def save()    = Review.save(this)
  def delete()  = Review.delete(this)

  def asSeq(): Seq[(String, Any)] = Seq(
    "id"        -> pkToLong(id),
    "wine_id"   -> fkToLong(wine),
    "author"    -> author,
    "text"      -> text,
    "date"      -> date
  )
}

object Review extends EntityCompanion[Review] {

  def fromParser(
    id:           Pk[Long] = NotAssigned,
    wine_id:      Option[Long] = None,
    author:       String = "",
    text:         String = "",
    date:         Option[Date] = None
  ): Review = {
    new Review(
      id,
      wine_id.map(Wine.findById _).getOrElse(None),
      author,
      text,
      date
    )
  }

  val tableName = "review"

  val defaultOrder = "date"

  val filterFields = List("author", "text", "date")

  val saveCommand = """
    insert into review (
      wine_id, author, text, date
    ) values (
      {wine_id}, {author}, {text}, {date}
    )"""

  val updateCommand = """
    update review set
      wine_id  = {wine_id},
      author   = {author},
      text  = {text},
      date     = {date}
    where
      id       = {id}"""

  val simpleParser: RowParser[Review] = {
    get[Pk[Long]]("id") ~
    get[Option[Long]]("wine_id") ~
    get[String]("author") ~
    get[String]("text") ~
    get[Option[Date]]("date") map {
      case id~wine_id~author~text~date => fromParser(
        id, wine_id, author, text, date
      )
    }
  }

  def validate(review: Review): List[Error] = {

    var errors = List[Error]()

    if (!review.wine.isDefined) {
      errors ::= ValidationError("wine", "Wine not specified")
    }

    if (Validate.isEmptyWord(review.author)) {
      errors ::= ValidationError("author", "Author not specified")
    }

    if (Validate.isEmptyWord(review.text)) {
      errors ::= ValidationError("text", "Text not specified")
    }

    if (!review.date.isDefined) {
      errors ::= ValidationError("date", "Date not specified")
    }

    errors.reverse
  }

}
