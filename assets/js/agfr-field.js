(function($){
	var relationFields,
		fieldRouters,
		inputFieldSelectors = '[name="agfr-datatable-price[]"],[name="agfr-datatable-dtime[]"],[name="agfr-datatable-atime[]"]',

		$table,
		$tableList,
		$generateBtn,
		$clearBtn


	function initialize_field( $field ) {
		$table = $('#agfr-datatable'),
		$tableList = $('#agfr-datatable-list'),
		$generateBtn = $('#agfr-generate-btn'),
		$clearBtn = $('#agfr-clear-btn')

		relationFields = acf.get('relation_fields')
		fieldRouters = acf.getField( relationFields.field )

		var initData = fieldRouters.val() !== '' ? JSON.parse( fieldRouters.val() ) : false

		if ( initData ) {
			$clearBtn.show()

			renderTable(initData)
		}
		else {
			$generateBtn.show()
		}
	}

	if ( typeof acf.add_action !== 'undefined' ) {
		acf.add_action('ready_field/type=formed_routes', initialize_field);
		acf.add_action('append_field/type=formed_routes', initialize_field);
	}

	else {
		$(document).on('acf/setup_fields', function(e, postbox){
			// find all relevant fields
			$(postbox).find('.field[data-field_type="formed_routes"]').each(function(){
				// initialize
				initialize_field( $(this) );
			});
		
		});
	}

	acf.addAction('load', function(){
		$generateBtn.on('click', function(e){
			e.preventDefault()

			$table.show()

			$generateBtn.hide()
			$clearBtn.show()

			renderTable()
		})

		$clearBtn.on('click', function(e){
			e.preventDefault()

			fieldRouters.val('')

			$table.hide()

			$generateBtn.show()
			$clearBtn.hide()
		})

		$(document).on('change', inputFieldSelectors, function(){
			var field = $(this),
				dataRows = field.parents('tbody').eq(0).find('tr'),
				inputFieldData = []

			dataRows.each(function(){
				var row = $(this),
					route = row.find('td').eq(0).text(),
					inputs = row.find(inputFieldSelectors)

				inputFieldData.push({
					route: route,
					price: inputs.eq(0).val(),
					dtime: inputs.eq(1).val(),
					atime: inputs.eq(2).val()
				})
			})

			fieldRouters.val( JSON.stringify(inputFieldData) )
		})
	})


	function renderTable(initData = false){
		var fieldFrom = acf.getField( relationFields.from ),
			fieldTo = acf.getField( relationFields.to ),

			fieldFromVal = fieldFrom.val(),
			fieldToVal = fieldTo.val(),

			rows = [],
			rowsOutput = [],
			rowsHtml = '',

			price = '',
			dtime = '',
			atime = '',
			index = 0

		if ( ! fieldFromVal.length || ! fieldToVal ) {
			return
		}

		$.each(fieldFromVal, function(i, fieldFromValItem){
			$.each(fieldToVal, function(j, fieldToValItem){
				if ( initData ) {
					price = initData[index].price
					dtime = initData[index].dtime
					atime = initData[index].atime

					index++
				}

				rows.push({
					route: relationFields.terms[fieldFromValItem] + ' &mdash; ' + relationFields.terms[fieldToValItem],
					price: '<input name="agfr-datatable-price[]" size="10" value="'+ price +'">',
					dtime: '<input name="agfr-datatable-dtime[]" size="5" value="'+ dtime +'">',
					atime: '<input name="agfr-datatable-atime[]" size="5" value="'+ atime +'">'
				})
			})
		})

		$.each(rows, function(i, row){
			rowsOutput.push('<tr><td>'+ row.route +'</td><td>'+ row.price +'</td><td>'+ row.dtime +'</td><td>'+ row.atime +'</td></tr>')
		})

		rowsHtml = rowsOutput.join('')

		$tableList.empty().append(rowsOutput.join(''))

		$table.slideDown('fast')
	}
})(jQuery)