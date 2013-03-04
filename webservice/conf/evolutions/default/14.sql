# --- First database schema

# --- !Ups

INSERT INTO Menu VALUES
  (01, 'menu', null, 01, 'Start',             '', '/',         '', '#Menu.Start', true) ,

  (10, 'menu', null, 02, 'Wines',             '', '#',         '', '#Menu.Wines', true) ,
  (11, 'menu', 10,   01, 'Wines',             '', 'Wine',      '', '#Menu.Wines', true) ,
  (12, 'menu', 10,   02, 'Countries',         '', 'Country',   '', '#Menu.Countries', true) ,
  (14, 'menu', 10,   03, 'Reviews',           '', 'Review',    '', '#Menu.Reviews', true),
  (13, 'sep',  10,   04, '-',                 '', '',          '', '', true) ,
  (15, 'menu', 10,   05, 'Wines with Reviews','', 'WineParent','', '#Menu.WinesReviews', true),

  (20, 'menu', null,  03, 'Configuration',    '', '#',        '', '#Menu.Configuration', false) ,
  (21, 'menu', 20,    01, 'Option1',          '', 'Option1',  '', '#Menu.Option1', false) ,
  (22, 'sep',  20,    02, '-',                '', '',         '', '', true) ,
  (24, 'menu', 20,    03, 'Option2',          '', 'Option2',  '', '#Menu.Option2', true)

# --- !Downs
truncate table Menu;
