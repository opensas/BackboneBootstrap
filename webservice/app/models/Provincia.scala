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

case class Provincia (

  val id: Pk[Long] = NotAssigned,

  val codigo: String = "NN",
  val nombre: String = "provincia desconocida"
)
  extends Entity
{
  def update()  = Provincia.update(this)
  def save()    = Provincia.save(this)
  def delete()  = Provincia.delete(this)
  
  def asSeq(): Seq[(String, Any)] = Seq(
    "id"      -> pkToLong(id),
    "codigo"  -> codigo,
    "nombre"  -> nombre
  )
}

object Provincia extends EntityCompanion[Provincia] {

  val tableName = "provincia"

  val defaultOrder = "codigo"

  val filterFields = List("codigo", "nombre")

  val saveCommand = """
    insert into provincia (
      codigo, nombre
    ) values (
      {codigo}, {nombre}
    )"""

  val updateCommand = """
    update provincia set
      codigo        = {codigo},
      nombre        = {nombre}
    where 
      id            = {id}"""

  val simpleParser = {
    get[Pk[Long]]("id") ~
    get[String]("codigo") ~
    get[String]("nombre") map {
      case id~codigo~nombre => Provincia(
        id, codigo, nombre
      )
    }
  }

  def validate(provincia: Provincia): List[Error] = {

    var errors = List[Error]()

    if (Validate.isEmptyWord(provincia.codigo)) {
      errors ::= ValidationError("codigo", "Codigo no especificado")
    } else {
      if (isDuplicate(provincia, "codigo")) {
        errors ::= ValidationError("codigo", "Ya existe una provincia con el codigo '%s'".format(provincia.codigo))
      }
    }

    if (Validate.isEmptyWord(provincia.nombre)) {
      errors ::= ValidationError("nombre", "Nombre no especificado")
    } else {
      if (isDuplicate(provincia, "nombre")) {
        errors ::= ValidationError("nombre", "Ya existe una provincia con el nombre '%s'".format(provincia.nombre))
      }
    }

    errors.reverse
  }

}