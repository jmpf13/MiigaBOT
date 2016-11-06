( function(){
	'use strict';

	angular.module( 'app' )
		.run( function ( $rootScope, $state, $stateParams ) {
			$rootScope.$stateParams = $stateParams;
			$rootScope.$state = $state;
		} );
} )();