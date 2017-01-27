var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat');

gulp.task('default', function() {
});

var config = {AppJSrc: ['javascript/*.js']};	

gulp.task('build-js', function() {
    gulp.src(config.AppJSrc)  
    // .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
      // .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js/'));
});

// gulp.task('watch', function() {
//   gulp.watch('javascript/*.js', ['build-js']);
// });