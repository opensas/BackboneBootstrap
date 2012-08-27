# --- First database schema

# --- !Ups

DROP TABLE IF EXISTS `wine`;

CREATE TABLE `wine` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `year` varchar(45) DEFAULT NULL,
  `grapes` varchar(45) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `region` varchar(45) DEFAULT NULL,
  `description` varchar(2000),
  `picture` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wine_uk_name` (`name`)
);

# --- !Downs

DROP TABLE IF EXISTS `wine`;