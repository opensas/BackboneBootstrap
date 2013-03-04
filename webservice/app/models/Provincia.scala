package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._
import play.api.Play

import utils.Http
import utils.Validate

import utils.Sql.sanitize

import utils.Conversion.{pkToLong, fkToLong}

import java.util.Date

import play.Logger

case class Provincia (

  val id: Pk[Long] = NotAssigned,

  val zona: Option[Zona]        = None,
  val codigo: String            = "NN",
  val descripcion: String       = "provincia desconocida",
  val habilitada: Int           = 1,
  val fundacion: Option[Date]   = None
)
  extends Entity
{
  def update()  = Provincia.update(this)
  def save()    = Provincia.save(this)
  def delete()  = Provincia.delete(this)

  def asSeq(): Seq[(String, Any)] = Seq(
    "id"            -> pkToLong(id),
    "zona_id"       -> fkToLong(zona),
    "codigo"        -> codigo,
    "descripcion"   -> descripcion,
    "habilitada"    -> habilitada,
    "fundacion"     -> fundacion
  )
}

object Provincia extends EntityCompanion[Provincia] {

  def fromParser(
    id: Pk[Long]            = NotAssigned,
    zona_id: Option[Long]   = None,
    codigo: String          = "NN",
    descripcion: String     = "provincia desconocida",
    habilitada: Int         = 1,
    fundacion: Option[Date] = None
  ): Provincia = {
    new Provincia(
      id,
      zona_id.map(Zona.findById _).getOrElse(None),
      codigo,
      descripcion,
      habilitada,
      fundacion
    )
  }

  val tableName = "provincia"

  val defaultOrder = "codigo"

  val filterFields = List("codigo", "descripcion")

  val saveCommand = """
    insert into provincia (
      zona_id, codigo, descripcion, habilitada, fundacion
    ) values (
      {zona_id}, {codigo}, {descripcion}, {habilitada}, {fundacion}
    )"""

  val updateCommand = """
    update provincia set
      zona_id       = {zona_id},
      codigo        = {codigo},
      descripcion   = {descripcion},
      habilitada    = {habilitada},
      fundacion     = {fundacion}
    where
      id            = {id}"""

  val simpleParser = {
    get[Pk[Long]]("id") ~
    get[Option[Long]]("zona_id") ~
    get[String]("codigo") ~
    get[String]("descripcion") ~
    get[Int]("habilitada") ~
    get[Option[Date]]("fundacion") map {
      case id~zona_id~codigo~descripcion~habilitada~fundacion => fromParser(
        id, zona_id, codigo, descripcion, habilitada, fundacion
      )
    }
  }

  def validate(provincia: Provincia): List[Error] = {

    var errors = List[Error]()

    if (provincia.zona.isEmpty) {
      errors ::= ValidationError("Zona", "Zona no especificada")
    }

    if (Validate.isEmptyWord(provincia.codigo)) {
      errors ::= ValidationError("Codigo", "Código no especificado")
    } else {
      if (isDuplicate(provincia, "codigo")) {
        errors ::= ValidationError("Codigo", "Ya existe una provincia con el código '%s'".format(provincia.codigo))
      }
    }

    if (Validate.isEmptyWord(provincia.descripcion)) {
      errors ::= ValidationError("Descripcion", "Descripción no especificada")
    } else {
      if (isDuplicate(provincia, "descripcion")) {
        errors ::= ValidationError("Descripcion", "Ya existe una provincia con la descripción '%s'".format(provincia.descripcion))
      }
    }

    if (provincia.codigo == provincia.descripcion) {
      errors ::= ValidationError("Codigo & Descripcion", "El codigo no puede ser igual a la descripcion")
    }

    errors.reverse
  }

}
