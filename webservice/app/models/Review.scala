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
  val content:      String = "",
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
    "content"   -> content,
    "date"      -> date
  )
}

object Review extends EntityCompanion[Review] {

  def fromParser(
    id:           Pk[Long] = NotAssigned,
    wine_id:      Option[Long] = None,
    author:       String = "",
    content:      String = "",
    date:         Option[Date]     = None
  ): Review = {
    new Review(
      id,
      wine_id.map(Wine.findById _).getOrElse(None),
      author,
      content,
      date
    )
  }

  val tableName = "review"

  val defaultOrder = "date"

  val filterFields = List("author", "content", "date")

  val saveCommand = """
    insert into review (
      wine_id, author, content, date
    ) values (
      {wine_id}, {author}, {content}, {date}
    )"""

  val updateCommand = """
    update review set
      wine_id  = {wine_id},
      author   = {author},
      content  = {content},
      date     = {date}
    where
      id       = {id}"""

  val simpleParser: RowParser[Review] = {
    get[Pk[Long]]("id") ~
    get[Option[Long]]("wine_id") ~
    get[String]("author") ~
    get[String]("content") ~
    get[Option[Date]]("date") map {
      case id~wine_id~author~content~date => fromParser(
        id, wine_id, author, content, date
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

    if (Validate.isEmptyWord(review.content)) {
      errors ::= ValidationError("content", "Content not specified")
    }

    if (review.date.isDefined) {
      errors ::= ValidationError("date", "Date not specified")
    }

    errors.reverse
  }

}
