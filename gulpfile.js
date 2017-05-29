const gulp           = require('gulp');
const watch          = require('gulp-watch');
const sourcemaps     = require('gulp-sourcemaps');
const browserSync    = require('browser-sync');
const sass           = require('gulp-sass');
const prefix         = require('gulp-autoprefixer');
const spawn          = require('child_process').spawn;
const webpack        = require('webpack-stream');
const webpack_config = require('./webpack.config');


var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

gulp.task('jekyll', ['js', 'sass'], (done) => {
  browserSync.notify(messages.jekyllBuild);
  return spawn(
    'bundle', 
    ['exec', jekyll, 'build'], 
    {stdio: 'inherit'}
  )
  .on('close', done);
});

gulp.task('browserSync', ['js', 'sass', 'jekyll'], () => {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

gulp.task('browserSync:rebuild', ['js', 'sass', 'jekyll'], () => {
  browserSync.reload();
});

gulp.task('watch', () => {
  gulp.watch('_scss/**/*.scss', ['sass', 'browserSync:rebuild']);
  gulp.watch(['src/js/**/*.js', '!src/js/*.min.js'], ['js', 'jekyll', 'browserSync:rebuild']);
  gulp.watch(['src/**/*.html'], ['browserSync:rebuild']);
});

gulp.task('sass', () => {
  return gulp.src('_scss/pages/**/*.scss')
  .pipe(sass.sync().on('error', sass.logError))
  // .pipe(prefix(['last 2 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(gulp.dest('src/css/pages'));
});

gulp.task('js', () => {
  return gulp.src(['src/js/**/app.js'])
  .pipe(webpack(webpack_config))
  .on('error', function handleError() {
    this.emit('end'); // Recover from errors
  })
  .pipe(gulp.dest('src/js'));
});



// gulp.task('sass', function () {
//   return gulp.src('_scss/main.scss')
//     .pipe(sass({ includePaths: ['scss']}).on('error', sass.logError))
//     .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
//     .pipe(gulp.dest('_site/css'))
//     .pipe(browserSync.reload({stream:true}))
//     .pipe(gulp.dest('src/css'));
// });

gulp.task('default', ['sass', 'js', 'watch', 'jekyll', 'browserSync']);
