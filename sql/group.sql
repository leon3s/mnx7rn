USE nanocl;

CREATE TABLE IF NOT EXISTS group (
  id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(100)
) ENGINE = InnoDB;
