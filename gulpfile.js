/* eslint-env node */
const gulp         = require('gulp');
const toc          = require('gulp-doctoc');

gulp.task('readme', function() {
  return gulp.src(['readme.md'])
    .pipe(toc({
      mode: 'github.com',
      title: '**Table of Contents**',
    }))
    .pipe(gulp.dest('.'));
});