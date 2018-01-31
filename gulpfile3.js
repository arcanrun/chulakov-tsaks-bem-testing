'use strict'


var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
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
	del = require('del');


var params = {
	out: 'app/public',
	htmlSrc: 'app/index.html',
	levels: [], // for BEM
	fonts: 'app/fonts',
	fontsOut: 'app/public/fonts',
	images: 'common.blocks',
	imagesOut: 'app/public/img' 
};

gulp.task('default', ['server', 'build']);

gulp.task('server', function(){
	browserSync.init({
		server: {
			baseDir: params.out
		}
	});
	gulp.watch('app/*.html', ['html']);
	gulp.watch('app/common.blocks/**/*.sass', ['sass2css']);
});

gulp.task('build', 
			[
				'html',
				'sass2css',
				'fonts',
				'stream',
				'watchDir',
				'images'
			]);

gulp.task('html', function(){
	console.log('=== html ===');
	 gulp.src(params.htmlSrc)
	.pipe(rename('index.html'))
	.pipe(gulp.dest(params.out))
	.pipe(reload({ stream: true }));
});

gulp.task('sass2css', function(){
	console.log('=== sass2css ===');
	return gulp.src(['app/fonts-style/**/*.sass', 'app/common.blocks/**/*.sass'])
	.pipe(debug({title: 'src:'}))
	.pipe(sourcemaps.init())
	.pipe(debug({title: 'sourcemaps: '}))
	.pipe(sass())
	.pipe(concat('styles.css'))
	.pipe(debug({title: 'concat:'}))
	.pipe(cssmin())
	.pipe(postcss([autopref()]))
	.pipe(sourcemaps.write('.'))
	.pipe(debug({title: 'sourcemaps-end: '}))
	.pipe(gulp.dest(params.out))
	.pipe(reload({ stream: true }));

	
});


// gulp.task('stream', function () {
// 	// Endless stream mode
// 	    return watch('app/common.blocks/**/*.sass', function(){
// 	    	console.log('=== stream ===');
// 	    	gulp.src(['app/fonts-style/**/*.sass','app/common.blocks/**/*.sass'])
// 			.pipe(sass())
// 			.pipe(concat('styles.css'))
// 			.pipe(cssmin())
// 			.pipe(postcss([autopref()]))
// 			.pipe(gulp.dest(params.out))
// 			.pipe(reload({ stream: true }));

// 				browserSync.reload();
// 	    });

// });
gulp.task('stream', function () {
	console.log('=== stream ===');
	 return watch('app/common.blocks/**/*.sass', function(){
	 gulp.src('{app/fonts-style/,app/common.blocks/}**/*.sass')
	.pipe(sass())
	.pipe(concat('styles.css'))
	.pipe(cssmin())
	.pipe(postcss([autopref()]))
	.pipe(gulp.dest(params.out))
	.pipe(reload({ stream: true }));

	browserSync.reload();
	 });
});

gulp.task('watchDir', function(){
	gulp.src(['app/fonts-style/**/*.sass','app/common.blocks/**/*.sass'])
	.pipe(
	 watchDir(['app/fonts-style/**/*.sass','app/common.blocks/**/*.sass'], function(){
	  console.log('watch-dir');
	 }));
});



gulp.task('fonts', function(){
	console.log('=== fonts ===');
	gulp.src(params.fonts + '/**/*')
	.pipe(gulp.dest(params.fontsOut));
});

gulp.task('images', function(){
	console.log('=== images ===');
	gulp.src('app/common.blocks/**/*.+(jpg|jpeg|gif|svg|png)')
	.pipe(imgmin())
	.pipe(flatten())
	.pipe(gulp.dest(params.imagesOut));
});

gulp.task('clean', function(){
	return del('public');
});
