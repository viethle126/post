var gulp = require('gulp');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');
var nodemon = require('gulp-nodemon');

gulp.task('lint', function() {
  return gulp.src(['**/*.js', '!node_modules/**', '!semantic/**', '!public/dist/**'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
})

gulp.task('mocha', function () {
  return gulp.src('app.spec.js')
  .pipe(mocha())
  .once('end', function() {
    process.exit();
  });
})

gulp.task('default', function() {
  nodemon({ script: 'app.js' })
  .on('start', ['mocha'])
})
