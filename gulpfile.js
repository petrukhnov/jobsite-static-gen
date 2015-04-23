// include gulp
var gulp = require('gulp');

// include gulp plugins
var jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    closureCompiler = require('gulp-closure-compiler'),
    minifyCSS = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    htmlhint = require('gulp-htmlhint'),
    scsslint = require('gulp-scss-lint'),
    awspublish = require('gulp-awspublish'),
    connect = require('gulp-connect'),
    del = require('del');

var config = require('./config').site;

// lint task
gulp.task('lint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

// hint html
gulp.task('html-hint', function() {
    return gulp.src("./src/*.html")
        .pipe(htmlhint())
        .pipe(htmlhint.failReporter());
});

// lint scss
gulp.task('scss-lint', function() {
  gulp.src('./src/scss/*.scss')
    .pipe(scsslint({'config': 'scsslint.yml'}))
});

// concatenate and minify javascript
gulp.task('minify-js', ['lint', 'clean:js'], function() {
    gulp.src([
        "src/js/vendor/jquery.min.js",
        "src/js/vendor/bootstrap.min.js",
        "src/js/vendor/swipeview.js",
        "src/js/tech.zalando.js"
    ])
    .pipe(closureCompiler({
        compilerPath: 'lib/closure-compiler/compiler.jar',
        compilerFlags: {
            compilation_level: 'SIMPLE_OPTIMIZATIONS',
            warning_level: 'QUIET'
        },
        fileName: 'tech.zalando-all.js'
    }))
    .pipe(gulp.dest('build/js'));
});

// compile sass to css
gulp.task('sass', function() {
    return gulp.src([
            'src/scss/*.scss',
            '!src/scss/_constants.scss'
        ])
        .pipe(sass())
        .pipe(gulp.dest('src/css'));
});

// concatenate and minify css
gulp.task('minify-css', ['scss-lint', 'sass', 'clean:css'], function() {
    gulp.src([
        "src/css/vendor/bootstrap.min.css",
        "src/css/fonts.css",
        "src/css/general.css",
        "src/css/cards.css",
        "src/css/buttons.css"
    ])
    .pipe(concat('tech.zalando-all.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css'));
});

// minify html
gulp.task('minify-html', ['html-hint', 'clean:html'], function() {
    gulp.src("./src/*.html")
        .pipe(minifyHTML())
        .pipe(gulp.dest("build"));
});

// copy assets
gulp.task('copy-assets', ['clean:assets'], function() {
    gulp.src([
        "./src/robots.txt"
    ])
    .pipe(gulp.dest("build"));
    gulp.src([
        "./src/images/*.jpg",
        "./src/images/*.png",
        "./src/images/*.gif",
        "./src/images/*.ico"
    ])
    .pipe(gulp.dest("build/images"));
    gulp.src([
        "./src/fonts/**"
    ])
    .pipe(gulp.dest("build/fonts"));
});

// clean up folders
gulp.task('clean:css', function (cb) {
    del([
        './build/css/*.css'
    ], cb);
});
gulp.task('clean:js', function (cb) {
    del([
        './build/js/*.js'
    ], cb);
});
gulp.task('clean:html', function (cb) {
    del([
        './build/*.html'
    ], cb);
});
gulp.task('clean:assets', function (cb) {
    del([
        './build/robots.txt',
        './build/images/**',
        './build/fonts/**'
    ], cb);
});

// start a server
gulp.task('server', ['watch'], function () {
  connect.server({
    port: 4001,
    root: ['build'],
    livereload: true
  });
});

// deploy to AWS S3
gulp.task('deploy:dev', function() {
  var publisher = awspublish.create(config.aws);
  var headers = {
    // 'Cache-Control': 'max-age=315360000, no-transform, public'
  };
  return gulp.src('./build/**')
    .pipe(publisher.publish(headers))
    // .pipe(publisher.sync()) // do not delete content on S3
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});

// watch files for changes
gulp.task('watch', ['minify-js', 'minify-css', 'minify-html', 'copy-assets'], function() {
    gulp.watch('src/js/*.js', ['minify-js']);
    gulp.watch('src/scss/*.scss', ['minify-css']);
    gulp.watch('src/*.html', ['minify-html', 'html-hint']);
    gulp.watch('src/images/*.*', ['copy-assets']);
});

// default task
gulp.task('default', ['server']);
