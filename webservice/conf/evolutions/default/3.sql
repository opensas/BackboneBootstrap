# --- First database schema

# --- !Ups

DROP TABLE IF EXISTS `wine`;

CREATE TABLE `wine` (
  `id`          int(11)       NOT NULL AUTO_INCREMENT,
  `name`        varchar(45)   DEFAULT  NULL,
  `year`        varchar(45)   DEFAULT   NULL,
  `grapes`      varchar(45)   DEFAULT   NULL,
  `country_id`  int(11)       NOT NULL,
  `region`      varchar(45)   DEFAULT   NULL,
  `description` varchar(2000) DEFAULT   NULL,
  `picture`     varchar(256)  DEFAULT  NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wine_uk_name` (`name`)
);

ALTER TABLE wine 
ADD FOREIGN KEY (country_id) 
REFERENCES country(id)

# --- !Downs

DROP TABLE IF EXISTS `wine`;