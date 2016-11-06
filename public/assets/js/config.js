/* ============================================================
 * File: config.js
 * Configure routing
 * ============================================================ */
( function(){
	'use strict';

	angular.module( 'app' )
		.config( [ '$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', function( $stateProvider, $urlRouterProvider, $ocLazyLoadProvider ) {

			$urlRouterProvider
				.otherwise( '/chatbot' );

			$stateProvider
				.state( 'chatbot', {
					url: '/chatbot',
					templateUrl: 'views/chatbot.html',
					authenticate: false,
					controller: "Chatbot",
					resolve: {
						deps: [ '$ocLazyLoad', function( $ocLazyLoad ){
							return $ocLazyLoad.load( [],{
								insertBefore: '#lazyload_placeholder'
							} )
							.then( function(){
								return $ocLazyLoad.load( [
									'assets/js/plugins/chatbot/chatbot.controller.js'
								] );
							} );
						} ]
					}
				} )

		} ] );
} )();