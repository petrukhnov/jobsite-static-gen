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
    vinylPaths = require('vinyl-paths'),
    del = require('del');

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
gulp.task('lint', function() {
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
gulp.task('scss-lint', function() {
    return gulp.src(['src/scss/*.scss', '!src/scss/greenhouse.scss'])
        .pipe(scsslint({'config': 'scsslint.yml'}));
});

// concatenate and minify javascript
// to prevent conflicts with default Docker filesystem permissions (no write
// access to project root directory) and Google Closure, the minified js gets
// written to the 'build' subdirectory and moved to the final directory via
// the gulp task `move-closure-artifacts`
gulp.task('closure-minification', ['lint'], function() {
    return gulp.src([
        'src/js/vendor/jquery.min.js',
        'src/js/vendor/bootstrap.min.js',
        'src/js/vendor/parallax.min.js',
        'src/js/vendor/URI.min.js',
        'src/js/tech.zalando.js',
        'src/js/analytics-tracking.js'
        ])
        .pipe(closureCompiler({
            compilerPath: 'lib/closure-compiler/compiler.jar',
            compilerFlags: {
                compilation_level: 'SIMPLE_OPTIMIZATIONS',
                warning_level: 'QUIET'
            },
            fileName: 'build/tech.zalando-all.js'
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('move-closure-artifacts', function() {
    return gulp.src(['dist/js/build/**'])
        .pipe(vinylPaths(del))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('minify-js', function(cb) {
    runSequence('closure-minification', 'move-closure-artifacts', cb);
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
gulp.task('minify-main-css', function() {
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
    .pipe(gulp.dest('dist/css'));
});

gulp.task('minify-greenhouse-css', function() {
    return gulp.src([
        'src/css/greenhouse.css'
    ])
    .pipe(concat('tech.zalando-greenhouse.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css'));
});

gulp.task('minify-css', ['scss-lint', 'sass'], function() {
    gulp.run('minify-main-css', 'minify-greenhouse-css');
});

// copy assets
gulp.task('copy-assets-robots', function () {
    return gulp.src([
        'src/robots.txt'
    ])
    .pipe(gulp.dest('dist'));
});

gulp.task('copy-assets-images', function() {
    return gulp.src([
        'src/images/*.jpg',
        'src/images/*.png',
        'src/images/*.gif',
        'src/images/*.ico'
    ])
    .pipe(gulp.dest('dist/images'));
});

gulp.task('copy-assets-blog-images', function() {
    return gulp.src([
        'src/blog/images/**/*'
    ])
    .pipe(gulp.dest('dist/blog/images'));
});

gulp.task('copy-assets-fonts', function() {
    return gulp.src([
        'src/fonts/**'
    ])
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy-assets-videos', function() {
    return gulp.src([
        'src/videos/**'
    ])
    .pipe(gulp.dest('dist/videos'));
});

gulp.task('copy-assets', function() {
    gulp.run('copy-assets-robots',
             'copy-assets-images',
             'copy-assets-blog-images',
             'copy-assets-fonts',
             'copy-assets-videos');
});

// clean up folders
gulp.task('clean', function() {
    return del.sync([
        'build/**/*',
        'dist/**/*'
    ]);
});
gulp.task('clean:all', ['clean']);

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
        .pipe(gulp.dest('dist'));
});

// rename generated javascript files with html extension to back js files
gulp.task('rename-js', ['metalsmith'], function() {
    return gulp.src("./dist/js/data/*.html")
      .pipe(rename(function (path) {
        path.dirname = "js/data";
        path.extname = ".js";
      }))
      .pipe(gulp.dest("./dist"));
});

// watch files for changes
gulp.task('watch', function() {
    gulp.watch('src/**/*.md', ['html-hint', 'metalsmith']);
    gulp.watch('src/js/*.js', ['minify-js']);
    gulp.watch('src/scss/*.scss', ['minify-css']);
    gulp.watch(['src/*.html', 'src/partials/*.html'], ['html-hint']);
    gulp.watch('src/images/*.*', ['copy-assets']);
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
                              'minify-css', 'copy-assets'], cb);
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
gulp.task('default', ['server']);
