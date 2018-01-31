'use strict'


const gulp = require('gulp');

var	browserSync = require('browser-sync').create(),
	reload = browserSync.reload,
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	cssmin = require('gulp-minify-css'),
	sourcemaps = require('gulp-sourcemaps'),
	postcss = require('gulp-postcss'),
	autopref = require('autoprefixer'),
	autopref2 = require('gulp-autoprefixer'),
	watch = require('gulp-watch'),
	imgmin = require('gulp-imagemin'),
	flatten = require('gulp-flatten'),
	watchDir = require('gulp-watch-dir'),
	debug = require('gulp-debug'),
	del = require('del'),
	chokidar = require('chokidar'),
	newer = require('gulp-newer'),
	remember = require('gulp-remember'),
	path = require('path');


var params = {
	out: 'app/public',
	htmlSrc: 'app/index.html',
	levels: [], // for BEM
	fonts: 'app/fonts',
	fontsOut: 'app/public/fonts',
	images: 'common.blocks',
	imagesOut: 'app/public/img',
	detectFirstRun: 0 
};

function sassTocss() {
		return gulp.src(['app/fonts-style/**/*.sass', 'app/common.blocks/**/*.sass'], {since: gulp.lastRun('sass2css')})
		.pipe(sourcemaps.init())
		.pipe(remember('sass2css'))
		.pipe(sass())
		.pipe(cssmin())
		.pipe(postcss([autopref()]))
		.pipe(concat('styles.css'))
		.pipe(debug({title: 'concat:'}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(params.out))
		.pipe(reload({ stream: true }));


// , {since: gulp.lastRun('sass2css')}
	}
function iamgesInStream(){
	

	return gulp.src('app/common.blocks/**/*.+(jpg|jpeg|gif|svg|png)')
	.pipe(newer(params.imagesOut))
	.pipe(imgmin())
	.pipe(flatten())
	.pipe(gulp.dest(params.imagesOut));

}
function detectFirstRunCall(run){
  	if(run == 1){
  		sassTocss();
  		iamgesInStream();
  	}
  }

gulp.task('server', function(){
	
	browserSync.init({
		server: {
			baseDir: params.out
		}
		
	}
	);
	gulp.watch('app/*.html', gulp.series('html'));

});



gulp.task('html', function(){
	console.log('=== html ===');
	 return gulp.src(params.htmlSrc)
	.pipe(rename('index.html'))
	.pipe(gulp.dest(params.out))
	.pipe(reload({ stream: true }));
});

gulp.task('sass2css', function(){
	console.log('=== sass2css ===');
	return sassTocss();
});


gulp.task('fonts', function(){
	console.log('=== fonts ===');
	return gulp.src(params.fonts + '/**/*')
	.pipe(gulp.dest(params.fontsOut));
});

gulp.task('images', function(){
	console.log('=== images ===');
	return iamgesInStream();
	
});
gulp.task('watch', function(){
	
		var watcher = chokidar.watch('app/common.blocks/', {
		  ignored: /(^|[\/\\])\../,
		  persistent: true

		});
	
	// Something to use when events are received.
	var log = console.log.bind(console);
	// Add event listeners.

	watcher
	  .on('add', function(path){
	  	console.log('File', path, 'has been added');
	  	detectFirstRunCall(params.detectFirstRun);
	  })
	  .on('change', function(path){
	  	console.log('File', path, 'has been changed');
	  	detectFirstRunCall(params.detectFirstRun);
	  })
	  .on('unlink', function(filepath){
	  	console.log('File', filepath, 'has been removed');
	  	remember.forget('sass2css', path.resolve(filepath));

	  	detectFirstRunCall(params.detectFirstRun);
	  	
	  })
	  .on('addDir', function(path){
	  	console.log('Directory', path, 'has been added');
	  	detectFirstRunCall(params.detectFirstRun);
	  })
	  .on('unlinkDir', function(path){
	  	console.log('Directory', path, 'has been removed');
	  	detectFirstRunCall(params.detectFirstRun);
	  })
	  .on('error', error => log(`Watcher error: ${error}`))
	  .on('ready', function(){
			params.detectFirstRun = 1;
			console.log('\n\tInitial scan complete. Ready for changes\n');
			console.log('\t==== First run is executed! State of varible = ' + params.detectFirstRun + ' ====\n');
		} 
	);
});
gulp.task('clean', function(){
	return del(params.out);
});

gulp.task('build', gulp.series(
				'html',
				'sass2css',
				'fonts',
				'images'
				
			));

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'server'))) ;

