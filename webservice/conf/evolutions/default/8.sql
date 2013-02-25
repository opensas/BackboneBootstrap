# --- First database schema

# --- !Ups

INSERT INTO zona VALUES
  (1, 'NOA','Noroeste Argentino'),
  (2, 'CUYO','Cuyo'),
  (3, 'PAMPA','Pampa húmeda'),
  (4, 'NEA','Noreste Argentino'),
  (5, 'PATAGONIA','Patagonia')
;

# ---1, !Downs
truncate table zona;
