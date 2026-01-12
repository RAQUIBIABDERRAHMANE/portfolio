-- Create page_settings table for controlling page visibility
-- Copy and paste this entire script into phpMyAdmin SQL tab

CREATE TABLE IF NOT EXISTS `page_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_path` varchar(255) NOT NULL,
  `page_name` varchar(100) NOT NULL,
  `is_enabled` tinyint(1) DEFAULT 1,
  `disabled_message` varchar(500) DEFAULT 'Cette page est temporairement indisponible.',
  `redirect_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `page_path` (`page_path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default page settings
INSERT INTO `page_settings` (`page_path`, `page_name`, `is_enabled`, `disabled_message`) VALUES
('/event', 'Événement', 1, 'La page événement est temporairement désactivée.'),
('/blog', 'Blog', 1, 'Le blog est temporairement indisponible.'),
('/newsletter', 'Newsletter', 1, 'La newsletter est temporairement désactivée.'),
('/dashboard', 'Dashboard', 1, 'Le dashboard est temporairement indisponible.')
ON DUPLICATE KEY UPDATE `page_name` = VALUES(`page_name`);
