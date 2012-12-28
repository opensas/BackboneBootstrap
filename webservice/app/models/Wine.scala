package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._

import utils.Validate

import utils.Conversion.pkToLong

case class Wine (

  val id: Pk[Long] = NotAssigned,

  val name:         String = "unknown wine",
  val year:         String = "",
  val grapes:       String = "",
  val country:      Country = Country(),
  val region:       String = "",
  val description:  String = "",
  val picture:      String = ""
)
  extends Entity
{
  def update()  = Wine.update(this)
  def save()    = Wine.save(this)
  def delete()  = Wine.delete(this)

  def asSeq(): Seq[(String, Any)] = Seq(
    "id"            -> pkToLong(id),
    "name"          -> name,
    "year"          -> year,
    "grapes"        -> grapes,
    "country"       -> country,
    "region"        -> region,
    "description"   -> description,
    "picture"       -> picture
  )
}

object Wine extends EntityCompanion[Wine] {

  val tableName = "wine"

  val defaultOrder = "country"

  val filterFields = List("name", "grapes", "country", "region", "year")

  val saveCommand = """
    insert into wine (
      name, year, grapes, country, region, description, picture
    ) values (
      {name}, {year}, {grapes}, {country}, {region}, {description}, {picture}
    )"""

  val updateCommand = """
    update wine set
      name        = {name},
      year        = {year},
      grapes      = {grapes},
      country     = {country},
      region      = {region},
      description = {description},
      picture     = {picture}
    where 
      id        = {id}"""

  override lazy val findCommand = """
    select
      w.id,
      w.name,
      w.year,
      w.grapes,

      w.country_id, 
        c.code as country_code,
        c.name as country_name, 

      w.region,
      w.description,
      w.picture
    from 
                  wine as w 
      inner join  country as c on   w.country_id = c.id
  """

  val simpleParser: RowParser[Wine] = {
    get[Pk[Long]]("id") ~
    get[String]("name") ~
    get[String]("year") ~
    get[String]("grapes") ~
    get[Pk[Long]]("country_id") ~
    get[String]("country_code") ~
    get[String]("country_name") ~
    get[String]("region") ~
    get[String]("description") ~
    get[String]("picture") map {
      case id~name~year~grapes~country_id~country_code~country_name~region~description~picture => 
      Wine(
        id, name, year, grapes, 
        Country(country_id, country_code, country_name),
        region, description, picture
      )
    }
  }

  def validate(wine: Wine): List[Error] = {

    var errors = List[Error]()

    // name
    if (Validate.isEmptyWord(wine.name)) {
      errors ::= ValidationError("name", "Name not specified")
    } else {
      if (isDuplicate(wine, "name")) {
        errors ::= ValidationError("name", "There already exists a wine with the name '%s'".format(wine.name))
      }
    }

    // year
    if (!Validate.isNumeric(wine.year)) {
      errors ::= ValidationError("year", "Year should be a number")
    } else {
      val iYear = wine.year.toInt
      if (iYear < 1900) {
        errors ::= ValidationError("year", "Year should be greater than 1900")
      }
      if (iYear > Validate.currentYear) {
        errors ::= ValidationError("year", "Year can't be greater than current year")
      }
    }

    // grapes
    if (Validate.isEmptyWord(wine.grapes)) {
      errors ::= ValidationError("grapes", "Grapes not specified")
    }

    // country
    // if (Validate.isEmptyWord(wine.country)) {
    if (wine.country.id == NotAssigned) {
      errors ::= ValidationError("country", "Country not specified")
    }

    // description
    if (Validate.isEmptyWord(wine.description)) {
      errors ::= ValidationError("description", "Description not specified")
    }

    errors.reverse
  }

}