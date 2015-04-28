// include gulp
var gulp = require('gulp');

// include gulp plugins
var fs = require('fs'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    closureCompiler = require('gulp-closure-compiler'),
    gulpsmith = require('gulpsmith'),
    gulp_front_matter = require('gulp-front-matter'),
    assign = require('lodash.assign'),
    prismic = require('metalsmith-prismic'),
    markdown = require('metalsmith-markdown'),
    permalinks = require('metalsmith-permalinks'),
    templates = require('metalsmith-templates'),
    partial = require('metalsmith-partial'),
    minifyCSS = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    htmlhint = require('gulp-htmlhint'),
    scsslint = require('gulp-scss-lint'),
    autoprefixer = require('gulp-autoprefixer'),
    awspublish = require('gulp-awspublish'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    del = require('del');


var config;
fs.stat('config.js', function(err, stat) {
    if (err === null) {
        // use local config file
        config = require('./config').site;
    } else {
        // import environment variables
        config = {
            "aws": {
                "key": process.env.S3KEY,
                "secret": process.env.S3SECRET,
                "bucket": process.env.S3BUCKET,
                "region": process.env.S3REGION
            }
        };
    }
});

// lint task
gulp.task('lint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

// hint html
gulp.task('html-hint', function() {
    return gulp.src(['./src/*.html', './_layouts/*.html'])
        .pipe(htmlhint());
});

// lint scss
gulp.task('scss-lint', function() {
    gulp.src('./src/scss/*.scss')
        .pipe(scsslint({'config': 'scsslint.yml'}));
});

// concatenate and minify javascript
gulp.task('minify-js', ['lint', 'clean:js'], function() {
    gulp.src([
        'src/js/vendor/jquery.min.js',
        'src/js/vendor/bootstrap.min.js',
        "src/js/vendor/parallax.min.js",
        'src/js/tech.zalando.js'
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
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('src/css'));
});

// concatenate and minify css
gulp.task('minify-css', ['scss-lint', 'sass', 'clean:css'], function() {
    gulp.src([
        'src/css/vendor/bootstrap.min.css',
        'src/css/fonts.css',
        'src/css/general.css',
        'src/css/header_footer.css',
        'src/css/cards.css',
        'src/css/buttons.css',
        'src/css/blog_post.css'
    ])
    .pipe(concat('tech.zalando-all.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css'));
});

// minify html
gulp.task('minify-html', ['html-hint', 'clean:html'], function() {
    gulp.src('./src/**/*.html')
        .pipe(gulpsmith()
              .use(partial({
                directory: 'src/partials',
                engine: 'swig'
              }))
              .use(templates({
                engine: 'swig',
                inPlace: true
              })))
        .pipe(minifyHTML())
        .pipe(gulp.dest('build/'));
});

// copy assets
gulp.task('copy-assets', ['clean:assets'], function() {
    gulp.src([
        './src/robots.txt'
    ])
    .pipe(gulp.dest('build'));
    gulp.src([
        './src/images/*.jpg',
        './src/images/*.png',
        './src/images/*.gif',
        './src/images/*.ico'
    ])
    .pipe(gulp.dest('build/images'));
    gulp.src([
        './src/fonts/**'
    ])
    .pipe(gulp.dest('build/fonts'));
});

// clean up folders
gulp.task('clean:all', function () {
    del([
        './build'
    ]);
});
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

// pull contents from prismic and generate static html
gulp.task('metalsmith', function() {
    gulp.src(['src/**/*.md'])
        .pipe(gulp_front_matter()).on('data', function(file) {
            assign(file, file.frontMatter);
            delete file.frontMatter;
        })
        .pipe(gulpsmith()
              .metadata({
                  'title': 'Zalando TFox',
                  'description': 'We dress code!'
              })
              .use(prismic({
                  'url': 'https://zalando-jobsite.prismic.io/api',
                  'linkResolver': function (ctx, doc) {
                      if (doc.isBroken) return;
                      if (doc.type === 'doc') {
                          return doc.slug;
                      }
                      // create file based off of type, id and the filename (extracted from the full path)
                      return '/' + doc.type + '/' + doc.id + '/' +  ctx.path.replace(/^.*(\\|\/|\:)/, '');
                  }
              }))
              .use(markdown())
              .use(permalinks())
              .use(partial({
                directory: 'src/partials',
                engine: 'swig'
              }))
              .use(templates({
                  'engine': 'swig',
                  'directory': '_layouts'
              })))
        .pipe(minifyHTML())
        .pipe(gulp.dest('build/'));
});

// watch files for changes
gulp.task('watch', function() {
    gulp.watch('src/**/*.md', ['html-hint', 'metalsmith']);
    gulp.watch('src/js/*.js', ['minify-js']);
    gulp.watch('src/scss/*.scss', ['minify-css']);
    gulp.watch(['src/*.html', 'src/partials/*.html'], ['minify-html', 'html-hint']);
    gulp.watch('src/images/*.*', ['copy-assets']);
});

// start a server and watch for changes
gulp.task('server', ['build', 'watch'], function () {
    connect.server({
        port: 4001,
        root: ['build'],
        livereload: true
    });
});

// build static website from sources
gulp.task('build', ['clean:all', 'metalsmith', 'minify-js', 'minify-css', 'minify-html', 'copy-assets']);

// deploy to AWS S3
gulp.task('deploy:dev', function() {
  var publisher = awspublish.create(config.aws);
  var headers = {
    // 'Cache-Control': 'max-age=315360000, no-transform, public'
  };
  return gulp.src('./build/**')
    .pipe(rename(function (path) {
       path.dirname = '/build/latest/' + path.dirname;
    }))
    .pipe(publisher.publish(headers))
    .pipe(publisher.sync('/build/latest'))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});

// default task
gulp.task('default', ['server']);
