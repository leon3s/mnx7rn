USE `nanocl`;

CREATE TABLE IF NOT EXISTS `group` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(100)
) ENGINE = InnoDB;
