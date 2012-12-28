# --- First database schema

# --- !Ups

INSERT INTO provincia VALUES
  (1,'CABA','Ciudad de Buenos Aires'),
  (2,'BUE','Buenos Aires'),
  (3,'SFE','Santa Fe'),
  (4,'JUJ','Jujuy'),
  (5,'ERI','Entre Rios'),
  (6,'SAL','Salta'),
  (7,'CHA','Chaco'),
  (8,'FOR','Formosa'),
  (9,'TUC','Tucuman'),
  (10,'TIE','Tierra del Fuego'),
  (11,'PAM','La Pampa'),
  (12,'CHU','Chubut')
;

# --- !Downs
truncate table provincia;