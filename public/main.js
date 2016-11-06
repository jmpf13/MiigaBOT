$( document ).ready( function() {
	function recarrega() {
		$( '.hidden' ).fadeOut();
		$( 'displayOutput' ).empty();
		$.get( '/users', function( data ) {
			console.log( "showing", data );

			var rendered = "<ul>";
			data.forEach( function( item ) {
				rendered = rendered + "<li title="+item._id+">The User <b>" + item.name + "</b> has the email <b>" + item.email + "</b>, the phone <b>"+ item.phone.ddd + item.phone.number +"</b> and login <b>"+ item._id +"</b></li>";
			} );
			rendered = rendered + "</ul>";

			$( '#displayOutput' ).html( rendered );
		} );
		$( '.hidden' ).fadeIn();
	}

	$( '#add-users' ).submit( function( e ) {
		e.preventDefault();

		var data = {
			_id: e.login,
			name: e.name,
			surname: e.surname,
			email: e.email,
			password: e.password,
			phone: {
				ddd: e.ddd,
				number: e.number
			}
		}

		console.log( data );

		$.ajax( {
			url: '/users',
			type: 'PUT',
			data: data.serialize(),
			success: function( data ) {
				recarrega();
			}
		} );
	} );

	// load data on start
	recarrega();

} );