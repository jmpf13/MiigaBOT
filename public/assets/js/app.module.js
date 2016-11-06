/* ============================================================
 * File: app.module.js
 * Configure global module dependencies. Page specific modules
 * will be loaded on demand using ocLazyLoad
 * ============================================================ */
( function(){
	'use strict';

	angular.module( 'app', [
		'ui.router',
		'ui.utils',
		'ngCookies',
		'oc.lazyLoad',
		'angular-loading-bar',
		'ngAnimate'
	] );
} )();