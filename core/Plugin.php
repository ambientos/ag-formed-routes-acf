<?php

namespace AG_Formed_Routes_ACF;

class Plugin {
	/**
	 * Init
	 *
	 * @return
	 */
	public function __construct() {
		/**
		 * Loaded Plugins hook
		 */
		add_action( 'plugins_loaded', array( __CLASS__, 'plugins_loaded' ) );

		/**
		 * Include field type for ACF5
		 */
		add_action( 'acf/include_field_types', array( __CLASS__, 'include_field_types' ) );
	}

	/**
	 * Plugins loaded
	 */
	public static function plugins_loaded() {
		/**
		 * Load translations for this plugin
		 */
		load_textdomain( TEXT_DOMAIN, PLUGIN_FOLDER . '/languages/' . TEXT_DOMAIN . '-' . get_locale() . '.mo' );
	}

	/**
	 * Include field type
	 */
	public static function include_field_types() {
		new Routes_Field();
	}
}