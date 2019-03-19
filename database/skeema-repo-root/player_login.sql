CREATE TABLE `player_login` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `int_auth_token` varchar(64) NOT NULL,
  `player_id` int(20) unsigned NOT NULL,
  `from_public_ip` varchar(32) DEFAULT NULL,
  `created_at` bigint(20) unsigned NOT NULL,
  `updated_at` bigint(20) unsigned NOT NULL,
  `deleted_at` bigint(20) unsigned DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
