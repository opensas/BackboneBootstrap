package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._
import play.api.Play

import utils.Http
import utils.Validate

import utils.Sql.sanitize

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
}

object Country extends EntityCompanion[Country] {

  val tableName = "country"

  val defaultOrder = "name"

  val filterFields = List("code", "name")

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

    var errors: List[Error] = List()

    // code
    if (Validate.isEmptyWord(country.code)) {
      errors ::= ValidationError("code", "Code not specified")
    } else {
      val c = count(condition = "id <> %s and code = '%s'".format(country.id.getOrElse(0), country.code))
      if (count(condition = "id <> %s and code = '%s'".format(country.id.getOrElse(0), country.code))!=0) {
        errors ::= ValidationError("code", "There already exists a country with the code '%s'".format(country.code))
      }
    }

    // name
    if (Validate.isEmptyWord(country.name)) {
      errors ::= ValidationError("name", "Name not specified")
    } else {
      val c = count(condition = "id <> %s and name = '%s'".format(country.id.getOrElse(0), country.name))
      if (count(condition = "id <> %s and name = '%s'".format(country.id.getOrElse(0), country.name))!=0) {
        errors ::= ValidationError("name", "There already exists a country with the name '%s'".format(country.name))
      }
    }

    errors.reverse
  }

  def save(country: Country): Either[List[Error],Country] = {

    val errors = validate(country)
    if (errors.length > 0) {
      Left(errors)
    } else {
      DB.withConnection { implicit connection =>
        val newId = SQL("""
          insert into country (
            code, name
          ) values (
            {code}, {name}
          )"""
        ).on(
          'code         -> country.code,
          'name         -> country.name
        ).executeInsert()

        val newcountry = for {
          id <- newId;
          country <- findById(id)
        } yield country

        newcountry.map { country =>
          Right(country)
        }.getOrElse {
          Left(List(ValidationError("Could not create country")))
        }
      }
    }
  }

  def update(country: Country): Either[List[Error],Country] = {

    val errors = validate(country)
    if (errors.length > 0) {
      Left(errors)
    } else {

      DB.withConnection { implicit connection =>
        SQL("""
          update Country set
            code        = {code},
            name        = {name}
          where 
            id        = {id}"""
        ).on(
          'id           -> country.id,
          'code         -> country.code,
          'name         -> country.name
        ).executeUpdate()
        
        val savedCountry = for (
          id <- country.id;
          country <- findById(id)
        ) yield country

        savedCountry.map { country =>
          Right(country)
        }.getOrElse {
          Left(List(ValidationError("Could not update Country")))
        }

      }
    }
  }

}