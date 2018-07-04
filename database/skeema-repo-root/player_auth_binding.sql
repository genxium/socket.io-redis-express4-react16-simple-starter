CREATE TABLE `player_auth_binding` (
  `channel` int(11) NOT NULL,
  `player_id` int(32) unsigned NOT NULL,
  `ext_auth_id` char(255) NOT NULL,
  `created_at` bigint(32) unsigned NOT NULL,
  `deleted_at` bigint(32) unsigned DEFAULT NULL,
  `updated_at` bigint(32) unsigned DEFAULT NULL,
  PRIMARY KEY (`channel`, `player_id`, `ext_auth_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
