/* ============================================================
 * File: main.controller.js
 * Main Controller to set global scope variables.
 * ============================================================ */
( function(){
	'use strict';

	AppCtrl.$inject = [ '$state' ];

	function AppCtrl( $state ) {
		var appCtrlVm = this;

		// Checks if the given state/child states are present
		appCtrlVm.includes = includes;

		// Checks if the given state is the current state
		appCtrlVm.is = is;

		return appCtrlVm;

		function includes( name ) {
			return $state.includes( name );
		}

		function is( name ) {
			return $state.is( name );
		}
	}

	angular.module('app')
		.controller( 'AppCtrl', AppCtrl );
} )();