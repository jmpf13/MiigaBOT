var gulp         = require( 'gulp' );
var sass         = require( 'gulp-sass' );
var autoprefixer = require( 'gulp-autoprefixer' );
var cleanCSS     = require( 'gulp-clean-css' );
var browserSync  = require( 'browser-sync' ).create();

// CONFIG PATHS
var config = {
	static    : './public/'
}

gulp.task( 'scss', function(){
	return gulp.src( './public/assets/scss/main.scss' )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( autoprefixer() )
		.pipe( gulp.dest( './public/assets/css/' ) )
		.pipe( browserSync.reload( {
			stream: true
		} ) );
} );

gulp.task( 'browserSync', function(){
	browserSync.init( {
		server : {
			baseDir : './public'
		}
	} )
} );

gulp.task( 'default', [ 'browserSync' ], function(){
	gulp.watch( './public/assets/scss/**/*.scss', [ 'scss' ] );
} );