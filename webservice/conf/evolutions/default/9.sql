# --- First database schema

# --- !Ups

DROP TABLE IF EXISTS provincia;

CREATE TABLE provincia (
  id            int(11)       NOT NULL AUTO_INCREMENT,
  zona_id       int(11)       NOT NULL,
  codigo        varchar(20)   NOT NULL,
  descripcion   varchar(50)   NOT NULL,
  habilitada    int(1)        NOT NULL,
  fundacion     timestamp     NULL,

  PRIMARY KEY (id),
  UNIQUE KEY provincia_uk_codigo (codigo),
  UNIQUE KEY provincia_uk_descripcion (descripcion)
);

ALTER TABLE provincia
ADD CONSTRAINT provincia_fk_zona
FOREIGN KEY (zona_id)
REFERENCES zona(id);

# --- !Downs
ALTER TABLE provincia DROP CONSTRAINT provincia_fk_zona;

DROP TABLE IF EXISTS provincia;
