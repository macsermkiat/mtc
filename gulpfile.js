var gulp  = require('gulp'),
 gutil = require('gulp-util'),
 concat = require('gulp-concat');
 jshint = require('gulp-jshint');
 uglify = require('gulp-uglify');
 rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('javascript/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('default', function() {
});

var config = {AppJSrc: ['javascript/*.js']};	

gulp.task('build-js', function() {
   return gulp.src(config.AppJSrc)  
    // .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
      //only uglify if gulp is ran with '--type production'
      // .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    // .pipe(sourcemaps.write())
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
});

// Default Task
gulp.task('default', ['lint', 'build-js', 'watch']);