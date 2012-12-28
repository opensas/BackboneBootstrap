# --- First database schema

# --- !Ups

DROP TABLE IF EXISTS provincia;

CREATE TABLE provincia (
  id            int(11)       NOT NULL AUTO_INCREMENT,
  codigo        varchar(20)   NOT NULL,
  nombre        varchar(50)   NOT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY provincia_uk_codigo (codigo),
  UNIQUE KEY provincia_uk_nombre (nombre)
)

# --- !Downs
DROP TABLE IF EXISTS provincia;