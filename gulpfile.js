// include gulp
var gulp = require('gulp');

// include gulp plugins
var jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    closureCompiler = require('gulp-closure-compiler'),
    minifyCSS = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html');

// lint task
gulp.task('lint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// compile sass task
gulp.task('sass', function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'));
});

// minify css task
gulp.task('minify-css', function() {
    gulp.src([
        "src/css/vendor/bootstrap.min.css",
        "src/css/tfox.css"
    ])
    .pipe(concat('tfox-all.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/css'));
});
