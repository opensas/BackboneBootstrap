# --- First database schema

# --- !Ups

INSERT INTO Ayuda VALUES
  (01, 'Provincia.ProvinciaId', 'Ayuda contextual del campo Provincia.ProvinciaId') ,
  (02, 'Provincia.Codigo', 'Ayuda contextual del campo Provincia.Codigo') ,
  (03, 'Localidad.LocalidadId', 'Ayuda contextual del campo Localidad.LocalidadId') ,
  (04, 'Localidad.Codigo', 'Ayuda contextual del campo Localidad.Codigo') ,
  (05, 'Localidad.Descripcion', 'Ayuda contextual del campo Localidad.Descripcion')

# --- !Downs
truncate table Ayuda;