# --- First database schema

# --- !Ups

INSERT INTO review VALUES
  ( 1,  1, 'Alberto Antonini', 'Though subtle in its complexities, this wine is sure to please a wide range of enthusiasts.', '2012-09-23 06:22:00'),
  ( 2,  1, 'Eric Asimov', 'Breaking the mold of the classics, this offering will pleasently surprise everyone.', '2012-10-12 11:45:00'),
  ( 3,  1, 'Ted Allen', 'With hints of ginger and spice, this wine makes an excellent complement to light appetizer.', '2012-08-11 17:49:00'),
  ( 4,  1, 'Oz Clarke', 'Though soft in texture, the body of this wine is full and rich.', '2012-09-07 10:22:00'),
  ( 5,  1, 'Michel Dovaz', 'A true summer wine, begging for a picnic lunch.', '2012-07-22 09:13:00'),
  ( 6,  1, 'Peter Gago', 'A truly luxurious experience for the senses.', '2012-09-02 19:23:00'),
  ( 7,  2, 'Eric Asimov', 'Breaking the mold of the classics, the body of this wine is full and rich.', '2013-01-12 18:56:00')
;

# --- !Downs

truncate table review;
