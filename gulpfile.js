const gulp = require("gulp");
const del = require("del");
const less = require("gulp-less");
const minify = require("gulp-minify-css");
const server = require("browser-sync").create();

const path = {
  styles: 'src/styles/style.less',
  html: 'src/**/*.html',
  scripts: 'src/scripts/**/*.*',
  assets: 'src/assets/**/*.*'
};

gulp.task('stylize', function() {
  return gulp
    .src(path['styles'])
    .pipe(less())
    .pipe(minify())
    .pipe(gulp.dest('build/css/'))
    .pipe(server.stream());
});

gulp.task('markup', function() {
  return 	gulp.src(path['html'], {base : 'src/'})
          .pipe(gulp.dest('build/'));
});

gulp.task('scripts', function() {
  return 	gulp.src(path['scripts'])
          .pipe(gulp.dest('build/js/'));
});

gulp.task('copy', function() {
  return  gulp.src(path['assets'])
          .pipe(gulp.dest('build/'));
});

gulp.task('clean', function() {
  return  del(['build/']);
});

gulp.task('serve', function(done) {
  server.init({
    server: 'build/'
  });
  done();
});

gulp.task('reload', function(done){
  server.reload();
  done();
});

gulp.task('watch', function(done) {
  gulp.watch('src/styles/**/*.less', gulp.parallel('stylize'));
  gulp.watch(path['html'], gulp.series('markup', 'reload'));
  gulp.watch(path['scripts'], gulp.series('scripts'));
  gulp.watch(path['assets'], gulp.parallel('copy'));
  done();
});

gulp.task('build', gulp.series('clean', 'stylize', 'markup', 'scripts', 'copy', 'serve', 'watch'));