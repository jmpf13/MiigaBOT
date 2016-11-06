( function(){
	'use strict';

	/**
	* FenixHack.
	 * @constructor
	 * @property {string}  pagescrollElement  - Scroll Element in Page.
	 * @property {object}  $body - Cache Body.
	 */
	var FenixHack = function() {
		this.FenixHackcrollElement = 'html, body';

		this.setUserOS();
		this.setUserAgent();
	}

	/** @function setUserOS
	* @description SET User Operating System eg: mac,windows,etc
	* @returns {string} - Appends OSName to FenixHack.$body
	*/
	FenixHack.prototype.setUserOS = function() {
		var OSName = "";
		if ( navigator.appVersion.indexOf( "Win" ) != -1 )   OSName = "windows";
		if ( navigator.appVersion.indexOf( "Mac" ) != -1 )   OSName = "mac";
		if ( navigator.appVersion.indexOf( "X11" ) != -1 )   OSName = "unix";
		if ( navigator.appVersion.indexOf( "Linux" ) != -1 ) OSName = "linux";

		$('body').addClass( OSName );
	}

	/** @function setUserAgent
	* @description SET User Device Name to mobile | desktop
	* @returns {string} - Appends Device to FenixHack.$body
	*/
	FenixHack.prototype.setUserAgent = function() {
		if ( navigator.userAgent.match( /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i ) ) {
			$('body').addClass( 'mobile' );
		} else {
			$('body').addClass( 'desktop' );
			if ( navigator.userAgent.match( /MSIE 9.0/ ) ) {
				$('body').addClass( 'ie9' );
			}
		}
	}

	$.FenixHack = new FenixHack();
	$.FenixHack.Constructor = FenixHack;
} )( window.jQuery );

( function( $ ) {
	'use strict';
	// Initialize layouts and plugins
	( typeof angular === 'undefined' ) && $.FenixHack.init();
} )( window.jQuery );