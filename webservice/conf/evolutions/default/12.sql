# --- First database schema

# --- !Ups

INSERT INTO localidad VALUES
  (1,1, 'Caballito','Caballito'),
  (2,1, 'Flores','Flores'),
  (3,1, 'Almagro','Almagro'),
  (4,1, 'Montserrat','Montserrat'),
  (5,1, 'Once','Once'),
  (6,1, 'Mataderos','Mataderos'),
  (7,1, 'Boedo','Boedo'),
  (8,1, 'Belgrano','Belgrano'),
  (9,1, 'Congreso','Congreso'),
  (10,1,'Barracas','Barracas'),
  (11,1,'Constitucion','Constitucion'),
  (12,2,'Moron','Moron'),
  (13,2,'Haedo','Haedo'),
  (14,2,'Ezeiza','Ezeiza'),
  (15,2,'Padua','Padua'),
  (16,2,'La Plata','La Plata'),
  (17,2,'Lanus','Lanus'),
  (18,2,'Merlo','Merlo'),
  (19,2,'Ramos Mejia','Ramos Mejia'),
  (20,3,'Rosario','Rosario'),
  (21,3,'Santa Fe (ciudad)','Santa Fe (ciudad)')
;

# ---1, !Downs
truncate table localidad;