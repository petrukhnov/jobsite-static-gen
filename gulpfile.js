// include gulp
var gulp = require('gulp');

// customize swig
var swig = require('swig'),
    viewmodel = require('../swig-viewmodel');
viewmodel.useFilter(swig, 'to_blogpost_viewmodel');
viewmodel.useFilter(swig, 'to_blogposts_viewmodel');
viewmodel.useFilter(swig, 'to_author_viewmodel');
viewmodel.useFilter(swig, 'to_doc_viewmodel');
viewmodel.useFilter(swig, 'to_jobs_viewmodel');
viewmodel.useFilter(swig, 'to_job_viewmodel');

// include gulp plugins
var fs = require('fs'),
    program = require('commander'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    closureCompiler = require('gulp-closure-compiler'),
    gulpsmith = require('gulpsmith'),
    runSequence = require('run-sequence'),
    gulp_front_matter = require('gulp-front-matter'),
    assign = require('lodash.assign'),
    prismic = require('metalsmith-prismic'),
    greenhouse = require('../metalsmith-greenhouse'),
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

program
    .option('-e, --environment <env>',
            'Environment (dev|qa|prod)',
            /^(dev|qa|prod)$/i,
            false)
    .parse(process.argv);

// -e CLI option overrides a potentially provided environment variable
var env = program.environment || process.env['TFOX_ENV'];

if (typeof env === 'undefined') {
    console.log('Error: No valid environment was specified.\n' +
                'Specify -e option or TFOX_ENV environment variable.\n' +
                'See `gulp --help` for help and valid settings.');
    process.exit(1);
} else {
    console.log("Running in environment:", env);
}

var config = {};
try {
    config = require('./config-' + env).site;
} catch (e) {
    // else: import environment variables
    var envCaps = env.toUpperCase();
    config = {
        'googleAnalytics': {
            'trackingID': process.env['GATRACKINGID_' + envCaps]
        },
        'aws': {
            'key': process.env['S3KEY_' + envCaps],
            'secret': process.env['S3SECRET_' + envCaps],
            'bucket': process.env['S3BUCKET_' + envCaps],
            'region': process.env['S3REGION_' + envCaps]
        }
    };
}

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
    gulp.src(['./src/scss/*.scss', '!./src/scss/greenhouse.scss'])
        .pipe(scsslint({'config': 'scsslint.yml'}));
});

// concatenate and minify javascript
gulp.task('minify-js', ['lint', 'clean:js'], function() {
    gulp.src([
        'src/js/vendor/jquery.min.js',
        'src/js/vendor/bootstrap.min.js',
        'src/js/vendor/parallax.min.js',
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
        'src/css/general.css',
        'src/css/header_footer.css',
        'src/css/cards.css',
        'src/css/buttons.css',
        'src/css/blog_post.css',
        'src/css/job_ad.css'
    ])
    .pipe(concat('tech.zalando-all.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css'));

    gulp.src([
        'src/css/greenhouse.css'
    ])
    .pipe(concat('tech.zalando-greenhouse.css'))
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
    gulp.src([
        './src/videos/**'
    ])
    .pipe(gulp.dest('build/videos'));
});

// clean up folders
gulp.task('clean:all', function (cb) {
    del([
        './build'
    ], cb);
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
    return gulp.src(['src/**/*.md'])
        .pipe(gulp_front_matter()).on('data', function(file) {
            assign(file, file.frontMatter);
            delete file.frontMatter;
        })
        .pipe(gulpsmith()
              .metadata({
                  'gaTrackingID': config.googleAnalytics.trackingID,
                  // Default title and description meta tags.
                  // Can be overridden in page layouts via the head.html partial
                  'title': 'Zalando Tech',
                  'description': 'This is the home of Zalando Tech. We dress code! Check out our job page for available positions.'
              })
              .use(prismic({
                  'url': 'https://zalando-jobsite.prismic.io/api',
                  'linkResolver': function (ctx, doc) {
                      if (doc.isBroken) return;
                      if (doc.type === 'doc') {
                          return doc.slug;
                      }
                      return '/' + doc.type + '/' + doc.id + '/' +  doc.slug;
                  }
              }))
              .use(greenhouse({
                  'apiHost': 'boards.api.greenhouse.io',
                  'apiEndpointPath': '/v1/boards',
                  'boardName': 'zalandotech'
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
gulp.task('build',function(cb) {
    runSequence('clean:all', ['minify-html','metalsmith', 'minify-js',
                              'minify-css', 'copy-assets'], cb);
});

// publish to AWS S3
gulp.task('publish', function() {
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
            .pipe(awspublish.reporter());
    }
);

// build + publish tasks, esp. for automated deployments
gulp.task('deploy',function(cb) {
    runSequence('build', 'publish', cb);
});

// default task
gulp.task('default', ['server']);
