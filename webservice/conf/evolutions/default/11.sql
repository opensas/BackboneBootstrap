# --- First database schema

# --- !Ups

DROP TABLE IF EXISTS localidad;

CREATE TABLE localidad (
  id            int(11)       NOT NULL AUTO_INCREMENT,
  provincia_id  int(11)       NOT NULL,
  codigo        varchar(20)   NOT NULL,
  descripcion   varchar(50)   NOT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY localidad_uk_codigo (codigo),
  UNIQUE KEY localidad_uk_descripcion (descripcion)
);

ALTER TABLE localidad
ADD CONSTRAINT localidad_fk_provincia
FOREIGN KEY (provincia_id)
REFERENCES provincia(id);

# --- !Downs
ALTER TABLE localidad DROP CONSTRAINT localidad_fk_provincia;

DROP TABLE IF EXISTS localidad;
