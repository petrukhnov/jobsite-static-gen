// include gulp
var gulp = require('gulp');

// include gulp plugins
var jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    closureCompiler = require('gulp-closure-compiler'),
    minifyCSS = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html');

// lint task
gulp.task('lint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// concatenate and minigy javascript
gulp.task('minify-js', function() {
    gulp.src([
        "src/js/vendor/jquery.min.js",
        "src/js/vendor/bootstrap.min.js",
        "src/js/tfox.js"
    ])
    .pipe(closureCompiler({
        compilerPath: 'build/closure-compiler/compiler.jar',
        compilerFlags: {
            compilation_level: 'SIMPLE_OPTIMIZATIONS',
            warning_level: 'QUIET'
        },
        fileName: 'tfox-all.js'
    }))
    .pipe(gulp.dest('dist/js'));
});

// compile sass to css
gulp.task('sass', function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'));
});

// concatenate and minify css
gulp.task('minify-css', ['sass'], function() {
    gulp.src([
        "src/css/vendor/bootstrap.min.css",
        "src/css/tfox.css"
    ])
    .pipe(concat('tfox-all.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/css'));
});

// copy assets

// TODO

// minify html
gulp.task('minify-html', function() {
    gulp.src("./src/*.html")
        .pipe(minifyHTML())
        .pipe(gulp.dest("dist"));
});

// watch files for changes
gulp.task('watch', ['lint', 'minify-js', 'minify-css'], function() {
    gulp.watch('src/js/*.js', ['lint', 'minify-js']);
    gulp.watch('src/scss/*.scss', ['minify-css']);
    gulp.watch('src/*.html', ['minify-html']);
});

// default task
gulp.task('default', ['lint', 'minify-js', 'minify-css', 'watch']);
