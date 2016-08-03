//+++++++++++++++++++++++++++++++++
//Title: Gulp Build for Production+
//Author: Jesus Tellez            +
//Support: jesus@orangegleam.com  +
//+++++++++++++++++++++++++++++++++



//require necessary plugins for our build
var gulp = require('gulp');                //call Gulp
var sass = require('gulp-sass');  		   //used to convert sass into css
var useref = require('gulp-useref'); 	   //used to concatentate JS and CSS files
var uglify = require('gulp-uglify');       //used to minify JS
var gulpIf = require('gulp-if');           //used to minify files, only if JS or CSS
var cssnano = require('gulp-cssnano');     //used to minify CSS  
var imagemin = require('gulp-imagemin');   //used to optimize images
var cache = require('gulp-cache');         //used to help cache the images
var del = require('del');                  //used to help cleanup files
var runSequence = require('run-sequence'); //run task in a particular order
var jshint = require('gulp-jshint');       //command line utility to help troubleshoot javascript syntax errors
var browserSync = require('browser-sync').create();  //Our test browser for development

//gulp tasks 

//Sets up our server
gulp.task('browserSync',function(){
	browserSync.init({
		server: {
			baseDir: 'src'
		},
	})
});

//Converts Sass into CSS
gulp.task('sass', function(){
	return gulp.src('src/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

//Concatenates and Minifies JS and CSS files
gulp.task('useref', function(){
	return gulp.src('src/*.html')
	.pipe(useref())
	// Minifies only if it's a JavaScript or CSS file
	.pipe(gulpIf('*.js', uglify()))
	.pipe(gulpIf('*.css', cssnano()))
	.pipe(gulp.dest('dist'))
});

//Optimize images
gulp.task('images', function(){
	return gulp.src('src/images/**/*.+(ping|jpg|gif|svg)')
	.pipe(cache(imagemin({
      interlaced: true
     })))
	.pipe(gulp.dest('dist/images'))
});

//Optimize Fonts
gulp.task('fonts', function(){
	return gulp.src('src/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))
});

//configure our linting task
gulp.task('jshint', function(){
	return gulp.src('src/js/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

//clean up our distribution folder
gulp.task('clean:dist', function(){
	return del.sync('dist');
});

//watch tasks
gulp.task('watch', ['browserSync', 'sass'],  function(){
	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch('src/js/**/*.js', ['jshint']);
	gulp.watch('src/*.html', browserSync.reload);
	gulp.watch('src/js/**/*.js', browserSync.reload);
});

//build out set#2
gulp.task('build', function(callback){
	runSequence('clean:dist', ['sass','useref','images','fonts'], callback)
});

//build out set#1
gulp.task('default', function(callback){
	runSequence(['sass','browserSync','watch'], callback)
})



//Run "gulp" to work locally
//Run "gulp build" to deploy to production
