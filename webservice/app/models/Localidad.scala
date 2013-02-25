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

case class Localidad (

  val id: Pk[Long] = NotAssigned,

  val provincia_id: Long = -1,
  val codigo: String = "NN",
  val descripcion: String = "provincia desconocida"
)
  extends Entity
{
  def update()  = Localidad.update(this)
  def save()    = Localidad.save(this)
  def delete()  = Localidad.delete(this)
  
  def asSeq(): Seq[(String, Any)] = Seq(
    "id"            -> pkToLong(id),
    "provincia_id"  -> provincia_id,
    "codigo"        -> codigo,
    "descripcion"   -> descripcion
  )
}

object Localidad extends EntityCompanion[Localidad] {

  val tableName = "localidad"

  val defaultOrder = "codigo"

  val filterFields = List("codigo", "descripcion")

  val saveCommand = """
    insert into localidad (
      provincia_id, codigo, descripcion
    ) values (
      {provincia_id}, {codigo}, {descripcion}
    )"""

  val updateCommand = """
    update localidad set
      provincia_id  = {provincia_id},
      codigo        = {codigo},
      descripcion   = {descripcion}
    where 
      id            = {id}"""

  val simpleParser = {
    get[Pk[Long]]("id") ~
    get[Long]("provincia_id") ~
    get[String]("codigo") ~
    get[String]("descripcion") map {
      case id~provincia_id~codigo~descripcion => Localidad(
        id, provincia_id, codigo, descripcion
      )
    }
  }

  def validate(localidad: Localidad): List[Error] = {

    var errors = List[Error]()

    if (localidad.provincia_id <=0) {
      errors ::= ValidationError("provincia_id", "Id de provincia no especificado")
    }

    if (Validate.isEmptyWord(localidad.codigo)) {
      errors ::= ValidationError("codigo", "Código no especificado")
    } else {
      if (isDuplicate(localidad, "codigo")) {
        errors ::= ValidationError("codigo", "Ya existe una localidad con el código '%s'".format(localidad.codigo))
      }
    }

    if (Validate.isEmptyWord(localidad.descripcion)) {
      errors ::= ValidationError("descripcion", "Descripción no especificada")
    } else {
      if (isDuplicate(localidad, "descripcion")) {
        errors ::= ValidationError("descripcion", "Ya existe una localidad con la descripción '%s'".format(localidad.descripcion))
      }
    }

    errors.reverse
  }

}