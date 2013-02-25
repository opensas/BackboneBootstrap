# --- First database schema

# --- !Ups

DROP TABLE IF EXISTS zona;

CREATE TABLE zona (
  id            int(11)       NOT NULL AUTO_INCREMENT,
  codigo        varchar(20)   NOT NULL,
  descripcion   varchar(50)   NOT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY zona_uk_codigo (codigo),
  UNIQUE KEY zona_uk_descripcion (descripcion)
);

# --- !Downs
DROP TABLE IF EXISTS zona;
