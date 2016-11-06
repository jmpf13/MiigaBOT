/* ============================================================
 * File: config.lazyload.js
 * Configure modules for ocLazyLoader. These are grouped by
 * vendor libraries.
 * ============================================================ */
( function(){
	'use strict';

	angular.module('app')
		.config( [ '$ocLazyLoadProvider', function( $ocLazyLoadProvider ) {
			$ocLazyLoadProvider.config({
				debug: true,
				events: true,
				modules: []
			});
		} ] );
} )();