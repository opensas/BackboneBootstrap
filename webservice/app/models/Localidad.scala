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
  val nombre: String = "provincia desconocida"
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
    "nombre"        -> nombre
  )
}

object Localidad extends EntityCompanion[Localidad] {

  val tableName = "localidad"

  val defaultOrder = "codigo"

  val filterFields = List("codigo", "nombre")

  val saveCommand = """
    insert into localidad (
      provincia_id, codigo, nombre
    ) values (
      {provincia_id}, {codigo}, {nombre}
    )"""

  val updateCommand = """
    update localidad set
      provincia_id  = {provincia_id},
      codigo        = {codigo},
      nombre        = {nombre}
    where 
      id            = {id}"""

  val simpleParser = {
    get[Pk[Long]]("id") ~
    get[Long]("provincia_id") ~
    get[String]("codigo") ~
    get[String]("nombre") map {
      case id~provincia_id~codigo~nombre => Localidad(
        id, provincia_id, codigo, nombre
      )
    }
  }

  def validate(localidad: Localidad): List[Error] = {

    var errors = List[Error]()

    if (localidad.provincia_id <=0) {
      errors ::= ValidationError("provincia_id", "Id de provincia no especificado")
    }

    if (Validate.isEmptyWord(localidad.codigo)) {
      errors ::= ValidationError("codigo", "Codigo no especificado")
    } else {
      if (isDuplicate(localidad, "codigo")) {
        errors ::= ValidationError("codigo", "Ya existe una localidad con el codigo '%s'".format(localidad.codigo))
      }
    }

    if (Validate.isEmptyWord(localidad.nombre)) {
      errors ::= ValidationError("nombre", "Nombre no especificado")
    } else {
      if (isDuplicate(localidad, "nombre")) {
        errors ::= ValidationError("nombre", "Ya existe una localidad con el nombre '%s'".format(localidad.nombre))
      }
    }

    errors.reverse
  }

}