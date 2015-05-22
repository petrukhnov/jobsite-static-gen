// include gulp
var gulp = require('gulp');

// customize swig
var swig = require('swig'),
    viewmodel = require('./swig-viewmodel');
    viewmodel.useFilter(swig, 'to_blogpost_viewmodel');
    viewmodel.useFilter(swig, 'to_blogposts_viewmodel');
    viewmodel.useFilter(swig, 'to_author_viewmodel');
    viewmodel.useFilter(swig, 'to_doc_viewmodel');
    viewmodel.useFilter(swig, 'to_jobs_viewmodel');
    viewmodel.useFilter(swig, 'to_job_viewmodel');
    viewmodel.useFilter(swig, 'pluralize');

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
    del = require('del'),
    react = require('gulp-react');

program
    .option('-e, --environment <env>',
            'Environment (dev|qa|prod)',
            /^(dev|qa|prod)$/i,
            false)
    .parse(process.argv);

// -e CLI option overrides a potentially provided environment variable
var env = program.environment || process.env.TFOX_ENV;

if (typeof env === 'undefined') {
    console.log('Error: No valid environment was specified.\n' +
                'Specify -e option or TFOX_ENV environment variable.\n' +
                'See `gulp --help` for help and valid settings.');
    process.exit(1);
} else {
    console.log("Running in environment:", env);
}

var config = {};
var envCaps = env.toUpperCase();
try {
    config = require('./config-' + env).site;
} catch (e) {
    // else: import environment variables
    config = {
        'googleAnalytics': {
            'trackingID': process.env['GATRACKINGID_' + envCaps]
        },
        'aws': {
            'key': process.env['S3KEY_' + envCaps],
            'secret': process.env['S3SECRET_' + envCaps],
            'bucket': process.env['S3BUCKET_' + envCaps],
            'bucketPath': process.env['S3BUCKETPATH_' + envCaps],
            'region': process.env['S3REGION_' + envCaps]
        }
    };
}

if (config.aws.bucketPath == null) {
    throw new Error('Config variable aws.bucketPath (or env var S3BUCKETPATH_' + envCaps + ') must be set');
}

// lint task
gulp.task('lint-js', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

// hint html
gulp.task('html-hint', function() {
    return gulp.src(['src/*.html', '_layouts/*.html'])
        .pipe(htmlhint());
});

// lint scss
gulp.task('lint-scss', function() {
    return gulp.src(['src/scss/*.scss', '!src/scss/greenhouse.scss'])
        .pipe(scsslint({'config': 'scsslint.yml'}));
});

// precompile JSX
gulp.task('compile-jsx', function () {
    return gulp.src('src/js/**/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('build/js'));
});

// concatenate and minify javascript
gulp.task('minify-js', ['compile-jsx', 'lint-js'], function() {
    return gulp.src([
        'src/js/vendor/jquery.min.js',
        'src/js/vendor/bootstrap.min.js',
        'src/js/vendor/parallax.min.js',
        'src/js/vendor/URI.min.js',
        'src/js/tech.zalando.js',
        'src/js/analytics-tracking.js',
        'build/js/blogpostCard.js',
        'build/js/app.js'
        ])
        .pipe(closureCompiler({
            compilerPath: 'lib/closure-compiler/compiler.jar',
            compilerFlags: {
                compilation_level: 'SIMPLE_OPTIMIZATIONS',
                warning_level: 'QUIET'
            },
            fileName: 'build/tech.zalando-all.js'
        }))
        .pipe(gulp.dest('./'));
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
        .pipe(gulp.dest('build/css'));
});

// concatenate and minify css
gulp.task('minify-css:main', function() {
    return gulp.src([
        'src/css/vendor/bootstrap.min.css',
        'build/css/general.css',
        'build/css/header_footer.css',
        'build/css/cards.css',
        'build/css/buttons.css',
        'build/css/blog_post.css',
        'build/css/job_ad.css'
    ])
    .pipe(concat('tech.zalando-all.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css'));
});

gulp.task('minify-css:greenhouse', function() {
    return gulp.src([
        'src/css/greenhouse.css'
    ])
    .pipe(concat('tech.zalando-greenhouse.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css'));
});

gulp.task('minify-css', function(cb) {
    runSequence('lint-scss', 'sass', ['minify-css:main',
                                      'minify-css:greenhouse'], cb);
});

// copy assets to build
gulp.task('copy-assets', function () {
    return gulp.src([
        'src/robots.txt',
        'src/images/*.{jpg,png,gif,ico}',
        'src/blog/images/**/*',
        'src/fonts/**',
        'src/videos/**'
    ], {base: 'src'})
    .pipe(gulp.dest('build'));
});

// copy production files from build to dist
gulp.task('build-to-dist:closure-js', function() {
    return gulp.src([
        'build/tech.zalando-all.js'
    ])
    .pipe(gulp.dest('dist/js'));
});

gulp.task('build-to-dist:bulk', function() {
    return gulp.src([
        'build/css/tech.zalando-all.css',
        'build/index.html',
        'build/robots.txt',
        'build/js/**/*.js',
        'build/fonts/**',
        'build/images/**',
        'build/videos/**',
        'build/blog/**',
        'build/jobs/**',
        'build/locations/**',
        'build/legal-notice/**',
        'build/privacy-policy/**',
        'build/terms-of-use/**'
    ], {base: 'build'})
    .pipe(gulp.dest('dist'));
});

gulp.task('build-to-dist', function(cb) {
    runSequence('clean:dist', ['build-to-dist:bulk', 'build-to-dist:closure-js'], cb);
});

// clean up folders
gulp.task('clean:build', function() {
    return del.sync([
        'build/**/*',
    ]);
});

gulp.task('clean:dist', function() {
    return del.sync([
        'dist/**/*'
    ]);
});

gulp.task('clean', function(cb) {
    runSequence(['clean:build', 'clean:dist'], cb);
});

gulp.task('clean:all', ['clean'], function() {
    console.log('clean:all is deprecated, please use `clean` instead.');
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
                  'linkResolver': function(ctx, doc) {
                      if (doc.isBroken) return;
                      if (doc.type === 'doc') {
                          return doc.slug;
                      }
                      if (doc.type === 'blog-rst') {
                          return '/blog/' + doc.slug;
                      }
                      return '/' + doc.type + '/' +  doc.slug;
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
        .pipe(gulp.dest('build'));
});

// rename generated javascript files with html extension to back js files
gulp.task('rename-js', ['metalsmith'], function() {
    return gulp.src("build/js/data/*.html")
      .pipe(rename(function (path) {
        path.dirname = "js/data";
        path.extname = ".js";
      }))
      .pipe(gulp.dest("build"));
});

// watch files for changes
gulp.task('watch', function() {
    function appendBuildUpdate(tasks) {
        return function(event) {
            console.log('File ' + event.path + ' was ' + event.type +
                        ', updating build and dist...');
            runSequence(tasks, 'build-to-dist');
        };
    }

    gulp.watch('src/**/*.md', appendBuildUpdate(['html-hint', 'metalsmith']));
    gulp.watch('src/js/*.js', appendBuildUpdate(['minify-js']));
    gulp.watch('src/scss/*.scss', appendBuildUpdate(['minify-css']));
    gulp.watch(['src/*.html', 'src/partials/*.html'],
               appendBuildUpdate (['html-hint']));
    gulp.watch('src/images/*.*', appendBuildUpdate(['copy-assets']));
});

// start a server and watch for changes
gulp.task('server', ['build', 'watch'], function() {
    connect.server({
        port: 4001,
        root: ['dist'],
        livereload: true
    });
});

// build static website from sources
gulp.task('build',function(cb) {
    runSequence('clean', ['metalsmith', 'rename-js', 'minify-js',
                          'minify-css', 'copy-assets'], 'build-to-dist', cb);
});

// publish to AWS S3
gulp.task('publish', function() {
    var publisher = awspublish.create(config.aws);
    var bucketPath = config.aws.bucketPath + '/';
    var headers = {
        // 'Cache-Control': 'max-age=315360000, no-transform, public'
    };
    return gulp.src('dist/**')
        .pipe(rename(function(path) {
            path.dirname = bucketPath + path.dirname;
        }))
        .pipe(publisher.publish(headers))
        .pipe(publisher.sync(bucketPath))
        .pipe(awspublish.reporter());
});

// build + publish tasks, esp. for automated deployments
gulp.task('deploy', function(cb) {
    runSequence('build', 'publish', cb);
});

// default task
gulp.task('default', function(cb) {
    runSequence('server', cb);
});
