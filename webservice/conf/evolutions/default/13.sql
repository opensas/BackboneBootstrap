# --- First database schema

# --- !Ups

DROP TABLE IF EXISTS Menu;

CREATE TABLE Menu (
  MenuId        int(11)       NOT NULL AUTO_INCREMENT,
  Tipo          varchar(50)   NOT NULL default 'menu',      -- menu | separador
  MenuPadreId   int(11)       NULL,
  Orden         int(2)        NOT NULL default 0,
  Nombre        varchar(100)  NOT NULL,
  Descripcion   varchar(500)  NOT NULL default '',
  Url           varchar(500)  NOT NULL default '',
  Permiso       varchar(100)  NOT NULL default '',
  Ayuda         varchar(2000) NOT NULL default '',
  Mostrar       boolean NOT NULL default true,

  PRIMARY KEY (MenuId)
);

ALTER TABLE Menu 
ADD CONSTRAINT Menu_fk_MenuPadre
FOREIGN KEY (MenuPadreId) 
REFERENCES Menu(MenuId);

# --- !Downs
ALTER TABLE Menu DROP CONSTRAINT Menu_fk_MenuPadre;

DROP TABLE IF EXISTS Menu;