USE `nanocl`;

CREATE TABLE IF NOT EXISTS `namespace` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(100)
) ENGINE = InnoDB;
