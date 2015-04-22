var gulp = require('gulp');
var react = require('gulp-react');

/* watch */
gulp.task('watch', function () {

  gulp.watch('./jsx/*.jsx', ['react']);
  
});

gulp.task('react', function () {

  return gulp.src('./jsx/*.jsx')
    .pipe(react({
      harmony: true
    }))
    .pipe(gulp.dest('./js/'));
});

/* default */
gulp.task('default', ['serve'], function () {});

/* serve */
gulp.task('serve', ['watch', 'react'], function () {});