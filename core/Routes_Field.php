<?php

namespace AG_Formed_Routes_ACF;

class Routes_Field extends \acf_field {
	/*
	*  __construct
	*
	*  This function will setup the field type data
	*
	*  @type	function
	*  @date	29/12/2014
	*  @since	5.0.0
	*
	*  @param	n/a
	*  @return	n/a
	*/

	function __construct() {
		/*
		*  name (string) Single word, no spaces. Underscores allowed
		*/

		$this->name = 'formed_routes';

		/*
		*  label (string) Multiple words, can include spaces, visible when selecting a field type
		*/

		$this->label = __('Formed routes', TEXT_DOMAIN);

		/*
		*  category (string) basic | content | choice | relational | jquery | layout | CUSTOM GROUP NAME
		*/

		$this->category = 'jquery';

		/*
		*  defaults (array) Array of default settings which are merged into the field object. These are used later in settings
		*/

		$this->defaults = array(
			//'font_size'	=> 14,
		);

		/*
		*  l10n (array) Array of strings that are used in JavaScript. This allows JS strings to be translated in PHP and loaded via:
		*  var message = acf._e('table', 'error');
		*/

		$this->l10n = array(
			//'error'	=> __('Error! Please enter a higher value.', TEXT_DOMAIN),
		);

		// do not delete!
		parent::__construct();
	}

	/*
	*  render_field_settings()
	*
	*  Create extra settings for your field. These are visible when editing a field
	*
	*  @type	action
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$field (array) the $field being edited
	*  @return	n/a
	*/

	function render_field_settings( $field ) {

		/*
		*  acf_render_field_setting
		*
		*  This function will create a setting for your field. Simply pass the $field parameter and an array of field settings.
		*  The array of settings does not require a `value` or `prefix`; These settings are found from the $field array.
		*
		*  More than one setting can be added by copy/paste the above code.
		*  Please note that you must also have a matching $defaults value for the field name (font_size)
		*/

		acf_render_field_setting( $field, array(
			'label'         => __( 'From field', TEXT_DOMAIN ),
			'type'          => 'text',
			'name'          => 'from_field',
			'default_value' => '',
		));

		acf_render_field_setting( $field, array(
			'label'         => __( 'To field', TEXT_DOMAIN ),
			'type'          => 'text',
			'name'          => 'to_field',
			'default_value' => '',
		));
	}

	/*
	*  render_field()
	*
	*  Create the HTML interface for your field
	*
	*  @param	$field (array) the $field being rendered
	*
	*  @type	action
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$field (array) the $field being edited
	*  @return	n/a
	*/

	function render_field( $field ) {
		$from_object = get_field_object( $field['from_field'] );
		$to_object = get_field_object( $field['to_field'] );

		$terms = get_terms( array(
			'taxonomy'   => $from_object['taxonomy'],
			'hide_empty' => false,
		) );

		if (
			$field['from_field'] === '' ||
			$field['to_field'] === '' ||
			! is_array($terms) ||
			empty($terms)
		) {
			return;
		}

		$terms_localize = array();

		foreach ($terms as $term) {
			$terms_localize[ $term->term_id ] = $term->name;
		}

		acf_localize_data( array(
			'relation_fields' => array(
				'field' => $field['key'],
				'from'  => $from_object['key'],
				'to'    => $to_object['key'],
				'terms' => $terms_localize,
			),
		) );

		?>

		<input type="text" name="<?php echo esc_attr($field['name']) ?>" value="<?php echo esc_attr($field['value']) ?>" style="display:none">

		<p><button id="agfr-generate-btn" class="button button-primary button-large"><?php _e( 'Generate route list', TEXTDOMAIN ) ?></button></p>

		<table id="agfr-datatable" class="wp-list-table widefat striped" style="display:none">
			<colgroup>
				<col>
				<col style="width:130px">
				<col style="width:100px">
			</colgroup>
			<thead>
				<tr>
					<th><?php _e( 'Route', TEXTDOMAIN ) ?></th>
					<th><?php _e( 'Price', TEXTDOMAIN ) ?></th>
					<th><?php _e( 'Departure Time', TEXTDOMAIN ) ?></th>
				</tr>
			</thead>
			<tbody id="agfr-datatable-list"></tbody>
		</table>

		<?php
	}

	/*
	*  input_admin_enqueue_scripts()
	*
	*  This action is called in the admin_enqueue_scripts action on the edit screen where your field is created.
	*  Use this action to add CSS + JavaScript to assist your render_field() action.
	*
	*  @type	action (admin_enqueue_scripts)
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	n/a
	*  @return	n/a
	*/

	function input_admin_enqueue_scripts() {
		wp_enqueue_script(
			TEXTDOMAIN . '-field',
			PLUGIN_URI . '/assets/js/agfr-field.js',
			array( 'acf-input', ),
			'20191117'
		);
	}
}