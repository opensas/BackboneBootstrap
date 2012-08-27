# --- First database schema

# --- !Ups

DROP TABLE IF EXISTS `country`;

CREATE TABLE `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(2) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `country_uk_code` (`code`),
  UNIQUE KEY `country_uk_name` (`name`)
)
# --- !Downs

DROP TABLE IF EXISTS `country`;