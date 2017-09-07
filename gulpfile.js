/*jshint expr:true, -W083, esversion: 6, unused: false */
const gulp         = require("gulp");
const rename       = require("gulp-rename");
const csso         = require("gulp-csso");
const uglify       = require("gulp-uglify");
const sass         = require("gulp-sass");
const toc          = require("gulp-doctoc");
const postcss      = require("gulp-postcss");
const include      = require("gulp-include");
const assets       = require("postcss-assets");
const cached       = require('gulp-cached');
const autoprefixer = require('gulp-autoprefixer');

gulp.task("styles", function () {
  return gulp.src([ "assets/scss/*.scss" ])
    .pipe(sass({
      precision    : 10,
      outputStyle  : 'expanded',
    }))
    .pipe(postcss([
      assets({ loadPaths: [
        'assets/images/'
      ] }),
    ]))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
    }))
    .pipe(gulp.dest("assets/css"))
    .pipe(csso())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("assets/css"));
});

gulp.task("scripts", function () {
  return gulp.src([ "assets/js/src/*.js" ])
    .pipe(include({
      extensions: "js",
      hardFail: true,
      includePaths: [
        __dirname + "/assets/js/src",
        __dirname,
      ]
    }))

    // Only pass-through files, that have changed
    .pipe(cached('scripts'))

    .pipe(gulp.dest("assets/js/dist"))
    .pipe(uglify({
      preserveComments: "license",
    }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("assets/js/dist"));
});

gulp.task( 'readme', function() {
  return gulp.src(['readme.md'])
    .pipe(toc({
      mode: "github.com",
      title: "**Table of Contents**",
    }))
    .pipe(gulp.dest('.'));
});

gulp.task("default", ['styles', 'scripts', 'readme']);

gulp.task("watch", ['default'], () => {
  gulp.watch('assets/scss/**/*.scss', [ 'styles' ]);
  gulp.watch('assets/js/src/**/*.js', [ 'scripts' ]);
});
