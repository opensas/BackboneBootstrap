package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._
import play.api.Play

import utils.Http
import utils.Validate

import utils.Sql.sanitize

import utils.Conversion.pkToLong

import play.Logger

case class Country (

  val id: Pk[Long] = NotAssigned,

  val code: String = "NN",
  val name: String = "unknown country"
)
  extends Entity
{
  def update()  = Country.update(this)
  def save()    = Country.save(this)
  def delete()  = Country.delete(this)
  
  def asSeq(): Seq[(String, Any)] = Seq(
    "id"      -> pkToLong(id),
    "code"    -> code,
    "name"    -> name
  )
}

object Country extends EntityCompanion[Country] {

  val tableName = "country"

  val defaultOrder = "name"

  val filterFields = List("code", "name")

  val saveCommand = """
    insert into country (
      code, name
    ) values (
      {code}, {name}
    )"""

  val updateCommand = """
    update country set
      code        = {code},
      name        = {name}
    where 
      id          = {id}"""

  val simpleParser = {
    get[Pk[Long]]("id") ~
    get[String]("code") ~
    get[String]("name") map {
      case id~code~name => Country(
        id, code, name
      )
    }
  }

  def validate(country: Country): List[Error] = {

    var errors = List[Error]()
    
    // code
    if (Validate.isEmptyWord(country.code)) {
      errors ::= ValidationError("code", "Code not specified")
    } else {
      // if (count(condition = "id <> %s and code = '%s'".format(country.id.getOrElse(0), country.code))!=0) {
      if (isDuplicate(country, "code")) {
        errors ::= ValidationError("code", "There already exists a country with the code '%s'".format(country.code))
      }
    }

    // name
    if (Validate.isEmptyWord(country.name)) {
      errors ::= ValidationError("name", "Name not specified")
    } else {
      if (isDuplicate(country, "name")) {
        errors ::= ValidationError("name", "There already exists a country with the name '%s'".format(country.name))
      }
    }

    errors.reverse
  }

}