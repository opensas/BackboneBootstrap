# --- First database schema

# --- !Ups

DROP TABLE IF EXISTS Ayuda;

CREATE TABLE Ayuda (
  AyudaId        int(11)      NOT NULL AUTO_INCREMENT,
  Codigo        varchar(100)  NOT NULL,
  Descripcion   varchar(500)  NOT NULL default '',

  PRIMARY KEY (AyudaId)
);

# --- !Downs
DROP TABLE IF EXISTS Ayuda;
