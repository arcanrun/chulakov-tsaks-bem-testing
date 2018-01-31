var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload;

gulp.task('sass', function(){
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass())
	.pipe(gulp.dest('app/css'))
	.pipe(reload({
		stream: true
	}))

});

gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: 'app'
		}
	})
});

gulp.task('watch', ['sass', 'browserSync'],function(){
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/*.html', reload);
	gulp.watch('app/js/*.js', reload);

});

gulp.task('default', ['watch']);