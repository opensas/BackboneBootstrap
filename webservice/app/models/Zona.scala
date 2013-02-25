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

case class Zona (

  val id: Pk[Long]        = NotAssigned,

  val codigo: String      = "NN",
  val descripcion: String = "zona desconocida"
)
  extends Entity
{
  def update()  = Zona.update(this)
  def save()    = Zona.save(this)
  def delete()  = Zona.delete(this)

  def asSeq(): Seq[(String, Any)] = Seq(
    "id"          -> pkToLong(id),
    "codigo"      -> codigo,
    "descripcion" -> descripcion
  )
}

object Zona extends EntityCompanion[Zona] {

  val tableName = "zona"

  val defaultOrder = "codigo"

  val filterFields = List("codigo", "descripcion")

  val saveCommand = """
    insert into zona (
      codigo, descripcion
    ) values (
      {codigo}, {descripcion}
    )"""

  val updateCommand = """
    update zona set
      codigo        = {codigo},
      descripcion   = {descripcion}
    where
      id            = {id}"""

  val simpleParser = {
    get[Pk[Long]]("id") ~
    get[String]("codigo") ~
    get[String]("descripcion") map {
      case id~codigo~descripcion => Zona(
        id, codigo, descripcion
      )
    }
  }

  def validate(zona: Zona): List[Error] = {

    var errors = List[Error]()

    if (Validate.isEmptyWord(zona.codigo)) {
      errors ::= ValidationError("codigo", "Código no especificado")
    } else {
      if (isDuplicate(zona, "codigo")) {
        errors ::= ValidationError("codigo", "Ya existe una zona con el código '%s'".format(zona.codigo))
      }
    }

    if (Validate.isEmptyWord(zona.descripcion)) {
      errors ::= ValidationError("descripcion", "Descripción no especificada")
    } else {
      if (isDuplicate(zona, "descripcion")) {
        errors ::= ValidationError("descripcion", "Ya existe una zona con la descripción '%s'".format(zona.descripcion))
      }
    }

    errors.reverse
  }

}
