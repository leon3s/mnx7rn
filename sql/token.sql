USE `nanocl`;

CREATE TABLE IF NOT EXISTS `token` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `value` varchar(512),
  `user_id` BIGINT UNSIGNED NOT NULL,
  CONSTRAINT `fk_token_user` FOREIGN KEY (user_id) REFERENCES `user` (id)
) ENGINE = InnoDB;
