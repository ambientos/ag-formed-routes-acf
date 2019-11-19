(function($){
	var initData = [],

		fieldRouters,
		fieldRoutersDataArray = [],

		fieldFrom,
		fieldTo,

		$table,
		$tableList,
		$generateBtn,
		$clearBtn,

		selectorsPriceTimeFields = '[name="agfr-datatable-price[]"],[name="agfr-datatable-dtime[]"],[name="agfr-datatable-atime[]"]'

	/**
	 * Initialize field and other values
	 */
	function initialize_field( $field ) {
		/**
		 * Get init data from plugin
		 * 
		 * @type array
		 */
		initData = acf.get('formed_routes_init_data')


		/**
		 * Get ACF field for save Routers data and his value
		 */
		fieldRouters = acf.getField( initData.field_key )
		fieldRoutersDataArray = fieldRouters.val() !== '' ? JSON.parse( fieldRouters.val() ) : []


		/**
		 * Get ACF field From
		 */
		fieldFrom = acf.getField( initData.field_from_key )

		fieldFrom.$el.on('change', function(){
			renderFieldRoutersDataTable()
		})


		/**
		 * Get ACF field To
		 */
		fieldTo = acf.getField( initData.field_to_key )

		fieldTo.$el.on('change', function(){
			renderFieldRoutersDataTable()
		})


		/**
		 * Init jQuery objects
		 */
		$table = $('#agfr-datatable')
		$tableList = $('#agfr-datatable-list')
		$generateBtn = $('#agfr-generate-btn')
		$clearBtn = $('#agfr-clear-btn')


		/**
		 * Render Table with taken values or not
		 */
		if ( fieldRoutersDataArray.length ) {
			$clearBtn.show()

			renderFieldRoutersDataTable()
		}
		else {
			$generateBtn.show()
		}
	}

	if ( typeof acf.add_action !== 'undefined' ) {
		acf.add_action('ready_field/type=formed_routes', initialize_field)
		acf.add_action('append_field/type=formed_routes', initialize_field)
	}

	else {
		$(document).on('acf/setup_fields', function(e, postbox){
			// find all relevant fields
			$(postbox).find('.field[data-field_type="formed_routes"]').each(function(){
				// initialize
				initialize_field( $(this) )
			})
		})
	}


	/**
	 * Window Load wrapper function
	 */
	acf.addAction('load', function(){
		/**
		 * Generate new/existing table
		 */
		$generateBtn.on('click', function(e){
			e.preventDefault()

			$table.show()

			$generateBtn.hide()
			$clearBtn.show()

			renderFieldRoutersDataTable()
		})


		/**
		 * Clear table and remove field value
		 */
		$clearBtn.on('click', function(e){
			e.preventDefault()

			fieldRoutersDataArray = []
			fieldRouters.val('')

			$table.hide()

			$generateBtn.show()
			$clearBtn.hide()
		})


		/**
		 * Update table and field by changing table fields
		 */
		$(document).on('change', selectorsPriceTimeFields, function(){
			var dataRows = $(this).parents('tbody').eq(0).find('tr'),
				fieldRoutersDataTmpArray = []

			dataRows.each(function(){
				var row = $(this),
					inputs = row.find(selectorsPriceTimeFields)

				fieldRoutersDataTmpArray.push({
					id:    row.data('id'),
					route: row.find('td').eq(0).text(),
					price: inputs.eq(0).val(),
					dtime: inputs.eq(1).val(),
					atime: inputs.eq(2).val()
				})
			})

			/**
			 * Save data to Routers field
			 */
			fieldUpdate(fieldRoutersDataTmpArray)
		})
	})


	/**
	 * General function to render table
	 */
	function renderFieldRoutersDataTable(){
		var fieldRoutersDataTmpArray = [],
			fieldFromVal = fieldFrom.val(),
			fieldToVal = fieldTo.val()


		/**
		 * Check if fields From/To not empty
		 * If empty, reset general field and exit
		 */
		if (
			! fieldFromVal ||
			! fieldToVal
		) {
			fieldRouters.val('')

			return
		}


		/**
		 * Intersection From and To field values
		 * generate new array for DataTable
		 */
		$.each(fieldFromVal, function(i, fieldFromValItem){
			$.each(fieldToVal, function(j, fieldToValItem){
				// Generate 'id' for current row
				var rowId = fieldFromValItem + ':' + fieldToValItem,
					rowIdExistsPos = -1


				// Check if data row exists
				rowIdExistsPos = fieldRoutersDataArray.map(function(row) { return row.id }).indexOf( rowId )

				// If equivalent row founded in tableRows array, use it
				// or just add new row by data
				if ( rowIdExistsPos > -1 ) {
					fieldRoutersDataTmpArray.push( fieldRoutersDataArray[rowIdExistsPos] )
				}
				else {
					fieldRoutersDataTmpArray.push({
						id: rowId,
						route: initData.terms[fieldFromValItem] + ' &mdash; ' + initData.terms[fieldToValItem],
						price: '',
						dtime: '',
						atime: ''
					})
				}
			})
		})


		/**
		 * Generate Table Rows Data and apped to Table
		 */

		var tableRowsArray = fieldRoutersDataTmpArray.map(function(row){
			return '<tr data-id="'+ row.id +'"><td>'+ row.route +'</td><td><input name="agfr-datatable-price[]" size="10" value="'+ row.price +'"></td><td><input name="agfr-datatable-dtime[]" size="5" value="'+ row.dtime +'"></td><td><input name="agfr-datatable-atime[]" size="5" value="'+ row.atime +'"></td></tr>'
		})

		$tableList.empty().append(tableRowsArray.join(''))

		$table.slideDown('fast')


		/**
		 * Save data to Routers field
		 */
		fieldUpdate(fieldRoutersDataTmpArray)
	}


	/**
	 * Update array data and field
	 */
	function fieldUpdate(dataTmpArray) {
		fieldRoutersDataArray = dataTmpArray
		fieldRouters.val( JSON.stringify(dataTmpArray) )
	}
})(jQuery)