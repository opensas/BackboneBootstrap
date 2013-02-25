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

case class Menu (

  val id: Pk[Long] = NotAssigned,
  val MenuId: Pk[Long] = NotAssigned,

  val Tipo:             String = "menu",
  val MenuPadreId:      Option[Long] = None,
  val Orden:            Long = 1,
  val Nombre:           String = "",
  val Descripcion:      String = "",
  val Url:              String = "",
  val Permiso:          String = "",
  val Ayuda:            String = "",
  val Mostrar:          Boolean = true
)
  extends Entity
{
  def update()  = Menu.update(this)
  def save()    = Menu.save(this)
  def delete()  = Menu.delete(this)
  
  def asSeq(): Seq[(String, Any)] = Seq(
    "MenuId"        -> pkToLong(id),
    "Tipo"          -> Tipo,
    "MenuPadreId"   -> pkToLong(id),
    "Orden"         -> Orden,
    "Nombre"        -> Nombre,
    "Descripcion"   -> Descripcion,
    "Url"           -> Url,
    "Permiso"       -> Permiso,
    "Ayuda"         -> Ayuda,
    "Mostrar"       -> Mostrar
  )
}

object Menu extends EntityCompanion[Menu] {

  val tableName = "Menu"

  val defaultOrder = "MenuPadreId, Orden"

  val filterFields = List("Nombre", "Descripcion")

  val saveCommand = """
    insert into Menu (
      Tipo, MenuPadreId,
      Orden, Nombre, Descripcion,
      Url, Permiso, Ayuda, Mostrar
    ) values (
      {Tipo}, {MenuPadreId},
      {Orden}, {Nombre}, {Descripcion},
      {Url}, {Permiso}, {Ayuda}, {Mostrar}
    )"""

  val updateCommand = """
    update Menu set
      Tipo          = {Tipo},
      MenuPadreId   = {MenuPadreId},
      Orden         = {Orden},
      Nombre        = {Nombre},
      Descripcion   = {Descripcion},
      Url           = {Url},
      Permiso       = {Permiso},
      Ayuda         = {Ayuda},
      Mostrar       = {Mostrar}
    where 
      MenuId        = {MenuId}"""

  val simpleParser = {
    get[Pk[Long]]("MenuId") ~
    get[String]("Tipo") ~
    get[Option[Long]]("MenuPadreId") ~
    get[Long]("Orden") ~
    get[String]("Nombre") ~
    get[String]("Descripcion") ~
    get[String]("Url") ~
    get[String]("Permiso") ~
    get[String]("Ayuda") ~ 
    get[Boolean]("Mostrar") map {
      case menuId~tipo~menuPadreId~orden~nombre~descripcion~url~permiso~ayuda~mostrar => Menu(
          NotAssigned, menuId, tipo, menuPadreId, 
          orden, nombre, descripcion, 
          url, permiso, ayuda, mostrar
        )
    }
  }

  def validate(menu: Menu): List[Error] = {

    var errors = List[Error]()

    if (Validate.isEmptyWord(menu.Nombre)) {
      errors ::= ValidationError("Nombre", "Nombre no especificado")
    }

    errors.reverse
  }

}