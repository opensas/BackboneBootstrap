# --- First database schema

# --- !Ups

INSERT INTO provincia VALUES
  (1, 3, 'CABA', 'Ciudad de Buenos Aires', 1, '1820-09-24'),
  (2, 1, 'JUJ',  'Jujuy', 0, '1820-09-24'),
  (3, 3, 'SFE',  'Santa Fe', 1, '1820-09-24'),
  (4, 4, 'COR',  'Corrients', 0, '1820-09-24'),
  (5, 4, 'ERI',  'Entre Rios', 1, '1820-09-24'),
  (6, 1, 'SAL',  'Salta', 1, '1820-09-24'),
  (7, 4, 'CHA',  'Chaco', 0, '1820-09-24'),
  (8, 4, 'FOR',  'Formosa', 1, '1820-09-24'),
  (9, 1, 'TUC',  'Tucuman', 1, '1820-09-24'),
  (10,5, 'TIE',  'Tierra del Fuego', 0, '1820-09-24'),
  (11,3, 'PAM',  'La Pampa', 1, '1820-09-24'),
  (12,5, 'CHU',  'Chubut', 1, '1820-09-24')
;

# --- !Downs
truncate table provincia;
