CREATE TABLE `player` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `raw_password` varchar(64) DEFAULT NULL COMMENT 'NEVER use such a field in an actual product!',
  `unique_name` varchar(255) NOT NULL,
  `created_at` bigint(32) unsigned NOT NULL,
  `deleted_at` bigint(20) unsigned DEFAULT NULL,
  `updated_at` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `player_uk` (`unique_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
