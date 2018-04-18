const gulp = require('gulp');
const webpack = require('webpack-stream');
const extname = require('gulp-extname');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const assemble = require('assemble');
const postcss = require('gulp-postcss');
const gulpif = require('gulp-if');
const autoprefixer = require('autoprefixer');

const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');

const app = assemble();
const reload = browserSync.reload;

const webpackConfig = require('./webpack.config');

// console.log(process.env.NODE_ENV);
const env = process.env.NODE_ENV;
let isPro = env === 'production' ? true: false;


gulp.task('scripts', function name(params) {
  return gulp.src([
      // Note: Since we are not using useref in the scripts build pipeline,
      //       you need to explicitly list your scripts here in the right order
      //       to be correctly concatenated
      './src/js/*.js'
      // Other scripts
    ])
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist'))
});

gulp.task('loadHtml', function (cb) {
  app.partials('./src/html/partials/*.hbs');
  app.layouts('./src/html/layouts/*.hbs');
  app.pages('./src/html/*.hbs');
  cb();
});

gulp.task('assemble', ['loadHtml'], function () {
  return app.toStream('pages')
    .pipe(app.renderFile())
    .pipe(extname())
    .pipe(app.dest('dist'));
});

gulp.task('sass', function () {
  var plugins = [
    autoprefixer(),
  ];
  return gulp.src("src/css/*.scss")
    // .pipe(sourcemaps.init())
    .pipe(gulpif(isPro,sass.sync({outputStyle: 'compressed'}).on('error', sass.logError)))
    .pipe(gulpif(!isPro,sass.sync().on('error', sass.logError)))
    .pipe(postcss(plugins))
    .pipe(gulp.dest("dist/css"))
    .pipe(reload({
      stream: true
    }));
});


gulp.task('img', () =>
  gulp.src('src/img/**/*.*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/img'))
);

gulp.task('copy', () => gulp.src('src/js/lib/**/*.js')
.pipe(gulp.dest('dist/js/lib')))

gulp.task('serve', ['sass', 'scripts', 'img', 'assemble', 'copy'], function () {

  browserSync.init({
    server: "./dist",
    port: 2018
  });

  gulp.watch("src/css/**/*.scss", ['sass']);
  gulp.watch("dist/css/**/*.css").on('change', reload);
  gulp.watch("src/js/**/*.js", ['scripts']);
  gulp.watch("src/js/lib/*.js", ['copy']);
  gulp.watch("src/img/**/*.*", ['img']);
  gulp.watch("dist/js/**/*.js").on('change', reload);
  gulp.watch("src/html/**/*.hbs", ['assemble']).on('change', reload);
  gulp.watch("dist/*.html").on('change', reload);
});

gulp.task('default', ['serve']);
gulp.task('build', ['sass', 'scripts', 'img', 'assemble', 'copy'])