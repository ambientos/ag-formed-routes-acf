<?php

/**
 * Plugin Name: Formed Routes for ACF
 * Version: 0.1
 * Requires PHP: 5.4
 * Author: Anton Grakhov
 * Author URI: https://grakhov.dev/
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: agfr
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Plugin prefix for constants
 *
 * @var string
 */
$plugin_prefix = 'AG_Formed_Routes_ACF\\';


/**
 * Plugin folder name
 */
$plugin_folder_name = 'ag-formed-routes-acf';


/**
 * Main constants
 */
define( $plugin_prefix . 'TEXT_DOMAIN', 'agfr' );
define( $plugin_prefix . 'PLUGIN_FOLDER', WP_PLUGIN_DIR . '/' . $plugin_folder_name );
define( $plugin_prefix . 'PLUGIN_URI', plugins_url( $plugin_folder_name ) );


/**
 * Autoload classes
 */
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	include __DIR__ . '/vendor/autoload.php';

	$plugin_classname = $plugin_prefix . 'Plugin';

	new $plugin_classname();
}