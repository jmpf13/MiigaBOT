( function(){
	'use strict';

	Chatbot.$inject = [ '$scope', '$http', '$state', '$sce' ];

	function Chatbot( $scope, $http, $state, $sce ) {
		var chatbotVm = this;
		var messages = [];
		$scope.text_bot = [];
		$scope.conversation_id = "";

		$http.get( '/api/chatbot' )
			.success( function( data, status, header ){
				$scope.conversation_id = data.context;
				messages.push( $sce.trustAsHtml( data.output.text[0] ) );
				$scope.text_bot = messages;
			} );

		$( "#talk_bot" ).submit( function(){
			var data = {
				text: $( "#send_bot" ).val(),
				context: $scope.conversation_id
			};

			$( "#send_bot" ).val( '' );

			$http.put( "/api/chatbot", data )
				.success( function( data, status, header ){
					// $scope.conversation_id = data.context;
					messages.push( $sce.trustAsHtml( data.output.text[0] ) );
					$scope.text_bot = messages;
				} );
		} );

		return chatbotVm;

	}

	angular.module('app')
		.controller( 'Chatbot', Chatbot );
} )();