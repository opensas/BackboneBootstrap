# --- First database schema

# --- !Ups

DROP TABLE IF EXISTS `review`;

CREATE TABLE `review` (
  `id`          int(11)       NOT NULL AUTO_INCREMENT,
  `wine_id`     int(11)       NOT NULL,
  `author`      varchar(45)   DEFAULT  NULL,
  `content`     varchar(2000) DEFAULT   NULL,
  `date`        timestamp     NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`)
);

ALTER TABLE review
ADD FOREIGN KEY (wine_id)
REFERENCES wine(id)

# --- !Downs

DROP TABLE IF EXISTS `review`;
