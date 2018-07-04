CREATE TABLE `player` (
  `player_id` int(32) unsigned NOT NULL AUTO_INCREMENT COMMENT 'player id',
  `created_at` bigint(32) unsigned NOT NULL,
  `deleted_at` bigint(20) unsigned DEFAULT NULL,
  `updated_at` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
