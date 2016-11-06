/*
 * Use this directive together with ng-include to include a
 * template file by replacing the placeholder element
 */
 ( function(){
	'use strict';

	angular.module( 'app' )
		.directive( 'includeReplace', function() {
			return {
				require: 'ngInclude',
				restrict: 'A',
				link: function( scope, el, attrs ) {
					el.replaceWith( el.children() );
				}
			};
		} );
} )();