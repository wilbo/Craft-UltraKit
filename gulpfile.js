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
var rsync                 = require('gulp-rsync');


// config
var config = {
  // your vhost domain name
  proxy: 'craft-ultrakit.dev',
  source: {
    src: './source/',
    dest: './public/assets/',
    html: './craft/templates/'
  },
  deploy: {
    host: '...',
    user: '...',
    dest: '/var/www/...',
  }
};

// clean
gulp.task('clean', function() {
  return del(config.source.dest);
});

// css
gulp.task('css', function() {
  return gulp.src(config.source.src + 'sass/main.+(scss|sass)')
    .pipe(development(sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(development(sourcemaps.write()))
    .pipe(production(cssnano()))
    .pipe(gulp.dest(config.source.dest + 'css'));
});

// js
gulp.task('js', function() {
  return gulp.src(config.source.src + 'js/main.js')
    .pipe(webpack(webpackSettings))
    .on('error', function handleError() { this.emit('end'); })
    .pipe(gulp.dest(config.source.dest + 'js'));
});

// vendor js
gulp.task('vendor', function() {
  return gulp.src(config.source.src + 'js/vendor/*.js')
    .pipe(gulp.dest(config.source.dest + 'js'));
});

// images
gulp.task('images', function() {
  return gulp.src(config.source.src + 'images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(config.source.dest + 'images'));
});

// fonts
gulp.task('fonts', function() {
  return gulp.src(config.source.src + 'fonts/**/*')
    .pipe(gulp.dest(config.source.dest + 'fonts'));
});

// browsersync
gulp.task('browser-sync', function() {
  browserSync.init({
    proxy: config.proxy,
    notify: false,
    files: [
      config.source.dest + 'css/**/*.css',
      config.source.dest + 'js/**/*.js',
      config.source.dest + 'images/**/*',
      config.source.dest + 'fonts/**/*'
    ],
  });
});

// deploy
gulp.task('deploy-craft', function() {
  return gulp.src('craft/**/*')
    .pipe(rsync({
      root: 'craft',
      hostname: config.deploy.host,
      username: config.deploy.user,
      destination: config.deploy.dest + 'craft',
      compress: true,
      silent: true
    }));
});

gulp.task('deploy-public', function() {
  return gulp.src('public/**/*')
    .pipe(rsync({
      root: 'public',
      hostname: config.deploy.host,
      username: config.deploy.user,
      destination: config.deploy.dest + 'public',
      compress: true,
      silent: true
    }));
});

// watch tasks

gulp.task('watch:css', function() {
  return gulp.watch(config.source.src + 'sass/**/*.+(scss|sass)', gulp.series('css'));
});

gulp.task('watch:js', function() {
  return gulp.watch(config.source.src + 'js/**/*.js', gulp.series('js'));
});

gulp.task('watch:images', function() {
  return gulp.watch(config.source.src + 'images/**/*', gulp.series('images'));
});

gulp.task('watch:fonts', function() {
  return gulp.watch(config.source.src + 'fonts/**/*', gulp.series('fonts'));
});

gulp.task('watch:build', function() {
  return gulp.watch(['./craft/templates/**/*']);
});

gulp.task('watch', gulp.parallel('watch:css', 'watch:js', 'watch:images', 'watch:fonts', 'watch:build'));

// main tasks
gulp.task('build',  gulp.series('clean', gulp.parallel('css', 'js', 'vendor', 'images', 'fonts')));
gulp.task('default', gulp.series('build', gulp.parallel('watch', 'browser-sync')));
gulp.task('deploy', gulp.series('build', 'deploy-craft', 'deploy-public'));
