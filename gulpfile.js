var gulp                  = require('gulp');

var sass                  = require('gulp-sass');
var cssnano               = require('gulp-cssnano');
var autoprefixer          = require('gulp-autoprefixer');
var sourcemaps            = require('gulp-sourcemaps');

var webpack               = require('webpack-stream');
var webpackSettings       = require('./webpack.config.js');

var imagemin              = require('gulp-imagemin');
var cache                 = require('gulp-cache');

var browserSync           = require('browser-sync').create();
var environments          = require('gulp-environments');
var development           = environments.development;
var production            = environments.production;

var del                   = require('del');


// config
var config = {
  // your vhost domain name
  proxy: 'craft-ultrakit.dev',
  paths: {
    src: './source/',
    dest: './public/assets/',
    html: './craft/templates/',
  }
};

// clean
gulp.task('clean', function() {
  return del(config.paths.dest);
});

// css
gulp.task('css', function() {
  return gulp.src(config.paths.src + 'sass/main.+(scss|sass)')
    .pipe(development(sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(development(sourcemaps.write()))
    .pipe(production(cssnano()))
    .pipe(gulp.dest(config.paths.dest + 'css'));
});

// js
gulp.task('js', function() {
  return gulp.src(config.paths.src + 'js/main.js')
    .pipe(webpack(webpackSettings))
    .pipe(gulp.dest(config.paths.dest + 'js'));
});

gulp.task('vendor', function() {
  return gulp.src(config.paths.src + 'js/vendor/*.js')
    .pipe(gulp.dest(config.paths.dest + 'js'));
});

// images
gulp.task('images', function() {
  return gulp.src(config.paths.src + 'images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(config.paths.dest + 'images'));
});

// fonts
gulp.task('fonts', function() {
  return gulp.src(config.paths.src + 'fonts/**/*')
    .pipe(gulp.dest(config.paths.dest + 'fonts'));
});

// browsersync
gulp.task('browser-sync', function() {
  browserSync.init({
    proxy: config.proxy,
    notify: false,
    files: [
      config.paths.dest + 'css/**/*.css',
      config.paths.dest + 'js/**/*.js',
      config.paths.dest + 'images/**/*',
      config.paths.dest + 'fonts/**/*'
    ],
  });
});

// watch tasks

gulp.task('watch:css', function() {
  return gulp.watch(config.paths.src + 'sass/**/*.+(scss|sass)', gulp.task('css'));
});

gulp.task('watch:js', function() {
  return gulp.watch(config.paths.src + 'js/**/*.js', gulp.task('js'));
});

gulp.task('watch:images', function() {
  return gulp.watch(config.paths.src + 'images/**/*', gulp.task('images'));
});

gulp.task('watch:fonts', function() {
  return gulp.watch(config.paths.src + 'fonts/**/*', gulp.task('fonts'));
});

gulp.task('watch:build', function() {
  return gulp.watch(config.paths.html + '**/*.html', (done) => { browserSync.reload(); done(); }); // simply calling browserSync.reload doesnt work
});

gulp.task('watch', gulp.parallel('watch:css', 'watch:js', 'watch:images', 'watch:fonts', 'watch:build'));

// main tasks
gulp.task('build',  gulp.series('clean', gulp.parallel('css', 'js', 'vendor', 'images', 'fonts')));
gulp.task('default', gulp.series('build', gulp.parallel('watch', 'browser-sync')));
