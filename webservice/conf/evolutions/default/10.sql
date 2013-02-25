# --- First database schema

# --- !Ups

INSERT INTO provincia VALUES
  (1, 3, 'CABA', 'Ciudad de Buenos Aires', 1),
  (2, 1, 'JUJ',  'Jujuy', 0),
  (3, 3, 'SFE',  'Santa Fe', 1),
  (4, 4, 'COR',  'Corrients', 0),
  (5, 4, 'ERI',  'Entre Rios', 1),
  (6, 1, 'SAL',  'Salta', 1),
  (7, 4, 'CHA',  'Chaco', 0),
  (8, 4, 'FOR',  'Formosa', 1),
  (9, 1, 'TUC',  'Tucuman', 1),
  (10,5, 'TIE',  'Tierra del Fuego', 0),
  (11,3, 'PAM',  'La Pampa', 1),
  (12,5, 'CHU',  'Chubut', 1)
;

# --- !Downs
truncate table provincia;
