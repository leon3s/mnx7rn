USE `nanocl`;

CREATE TABLE IF NOT EXISTS `user_group` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` MEDIUMINT NOT NULL,
  `group_id` MEDIUMINT NOT NULL,
  CONSTRAINT `fk_user_group_user` FOREIGN KEY (`user_id`) REFERENCES `user` (id),
  CONSTRAINT `fk_user_group_group` FOREIGN KEY (`group_id`) REFERENCES `group` (id)
) ENGINE = InnoDB;
