'use strict';

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    pkg = require('./package'),
    scripts = {
      all: [
        'gulpfile.js',
        'src/*.js',
        'demo/js/*.js',
        'docs/js/*.js'
      ],
      src: 'src/*.js',
      docs: 'docs/js',
      dest: 'dist'
    },
    styles = {
      all: [
        'src/*.css',
        'demo/css/*.css',
        'docs/css/*.css'
      ],
      src: 'src/*.css',
      docs: 'docs/css',
      dest: 'dist'
    },
    replacement = {
      regexp: /@\w+/g,
      filter: function (placeholder) {
        switch (placeholder) {
          case '@VERSION':
            placeholder = pkg.version;
            break;

          case '@YEAR':
            placeholder = (new Date()).getFullYear();
            break;

          case '@DATE':
            placeholder = (new Date()).toISOString();
            break;
        }

        return placeholder;
      }
    };

gulp.task('jshint', function () {
  return gulp.src(scripts.all)
  .pipe(plugins.jshint('src/.jshintrc'))
  .pipe(plugins.jshint.reporter('default'));
});

gulp.task('jscs', function () {
  return gulp.src(scripts.all)
  .pipe(plugins.jscs('src/.jscsrc'));
});

gulp.task('js', ['jshint', 'jscs'], function () {
  return gulp.src(scripts.src)
  .pipe(plugins.replace(replacement.regexp, replacement.filter))
  .pipe(gulp.dest(scripts.docs))
  .pipe(gulp.dest(scripts.dest))
  .pipe(plugins.rename('tooltip.min.js'))
  .pipe(plugins.uglify())
  .pipe(gulp.dest(scripts.dest));
});

gulp.task('jscopy', function () {
  return gulp.src(scripts.src)
  .pipe(gulp.dest(scripts.dest));
});

gulp.task('csslint', function () {
  return gulp.src(styles.all)
  .pipe(plugins.csslint('src/.csslintrc'))
  .pipe(plugins.csslint.reporter());
});

gulp.task('css', ['csslint'], function () {
  return gulp.src(styles.src)
  .pipe(plugins.replace(replacement.regexp, replacement.filter))
  .pipe(plugins.autoprefixer())
  .pipe(plugins.csscomb())
  .pipe(gulp.dest(styles.docs))
  .pipe(gulp.dest(styles.dest))
  .pipe(plugins.rename('tooltip.min.css'))
  .pipe(plugins.minifyCss())
  .pipe(gulp.dest(styles.dest));
});

gulp.task('csscopy', function () {
  return gulp.src(styles.src)
  .pipe(gulp.dest(styles.dest));
});

gulp.task('docs', function () {
  return gulp.src('docs/**')
  .pipe(gulp.dest('_gh_pages'));
});

gulp.task('release', ['js', 'css'], function () {
  return gulp.src('dist/*')
  .pipe(gulp.dest('_releases/' + pkg.version));
});

gulp.task('watch', function () {
  gulp.watch(scripts.src, ['jscopy']);
  gulp.watch(styles.src, ['csscopy']);
});

gulp.task('default', ['watch']);