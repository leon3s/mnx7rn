USE `nanocl`;

CREATE TABLE IF NOT EXISTS `user` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(100),
  `password` varchar(255)
) ENGINE = InnoDB;
