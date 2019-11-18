(function($){
	var relationFields,
		fieldRouters,
		inputFieldSelectors = '[name="agfr-datatable-price[]"],[name="agfr-datatable-time[]"]'


	function initialize_field( $field ) {		
		relationFields = acf.get('relation_fields')
		fieldRouters = acf.getField( relationFields.field )

		var initData = fieldRouters.val() !== '' ? JSON.parse( fieldRouters.val() ) : false

		if ( initData ) {
			renderTable(initData)
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
		$('#agfr-generate-btn').on('click', function(){
			renderTable()
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
					time: inputs.eq(1).val()
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
			time = '',
			index = 0

		if ( ! fieldFromVal.length || ! fieldToVal ) {
			console.log('123')
			return
		}

		$.each(fieldFromVal, function(i, fieldFromValItem){
			$.each(fieldToVal, function(j, fieldToValItem){
				if ( initData ) {
					price = initData[index].price
					time = initData[index].time

					index++
				}

				rows.push({
					route: relationFields.terms[fieldFromValItem] + ' &mdash; ' + relationFields.terms[fieldToValItem],
					price: '<input name="agfr-datatable-price[]" size="10" value="'+ price +'">',
					time: '<input name="agfr-datatable-time[]" size="5" value="'+ time +'">'
				})
			})
		})

		$.each(rows, function(i, row){
			rowsOutput.push('<tr><td>'+ row.route +'</td><td>'+ row.price +'</td><td>'+ row.time +'</td></tr>')
		})

		rowsHtml = rowsOutput.join('')

		$('#agfr-datatable-list').empty().append(rowsOutput.join(''))

		$('#agfr-datatable').slideDown('fast')
	}
})(jQuery)