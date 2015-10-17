var fs = require('fs'),
    gulp = require('gulp'),
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    jslint = require('gulp-jslint'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    awspublish = require('gulp-awspublish'),
    browserSync = require('browser-sync').create(),
    shell = require('gulp-shell')
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer');

var reload = browserSync.reload;

// ----- Config
var bower = require('./bower.json'),
    npm = require('./package.json'),
    aws = require('./aws.json');

var jsPrefix = 'js/src/',
    pluginsPrefix = 'js/src/plugins/';

var paths = {
    js: ['js/src/**/*.js'],
    jsEntry: 'js/src/index.js',
    plugins: [
        'watermark',
        'gradientmap',
        'tile'
    ],
    jsCoreDist: 'js/dist',
    jsCoreDocs: 'docs/download',
    html: ['./**/*.html']
};

// looks for filename martin.PLUGIN.js
paths.plugins.forEach(function(path, i) {
    paths.plugins[i] = pluginsPrefix + path + '.js'
});

function writeVersion(version, which, path) {
    which.version = version;
    fs.writeFile(path, JSON.stringify(which, null, '  '), function(err, data) {
        if (err) return console.log(err);
        console.log('Wrote version to ' + path);
    });
}

function writeVersions(callback) {

    var versionFile = './js/src/core/version.js';

    fs.readFile(versionFile, 'utf8', function read(err, data) {

        var lines = data.split('\n'),
            versionString = 'module.exports = ',
            version;

        lines.forEach(function(line, i) {
            if ( line.indexOf(versionString) > -1 ) {
                version = line.replace(versionString, '');
            }
        });

        version = version.replace(/["';]/g, '')

        writeVersion(version, bower, './bower.json');
        writeVersion(version, npm, './package.json');

        callback();
    });
}

function fullAndMin(dest) {

    function processFiles() {
        browserify( paths.jsEntry ).bundle()
            .pipe(source('martin.js'))
            .pipe(gulp.dest( dest ));

        browserify( paths.jsEntry ).bundle()
            .pipe(source('martin.min.js'))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest( dest ));

        /* if ( dest !== 'docs/download' ) {

            gulp.src( paths.plugins )
                .pipe(rename(function(path) {
                    path.basename = 'martin.' + path.basename
                }))
                .pipe(gulp.dest( dest ));

            gulp.src( paths.plugins )
                .pipe(uglify())
                .pipe(rename(function(path) {
                    path.basename = 'martin.' + path.basename + '.min'
                }))
                .pipe(gulp.dest( dest ));
        } */
    }

    writeVersions(processFiles);
}

gulp.task('js', function() {

    fullAndMin( paths.jsCoreDist );
    fullAndMin( paths.jsCoreDocs );
});

gulp.task('docs', shell.task([
    'mkdocs serve'
]));

gulp.task('publish', function() {

    var publisher = awspublish.create({
        params: {
            Bucket: aws.bucket
        },
        accessKeyId: aws.key,
        secretAccessKey: aws.secret
    });

    // build docs
    shell.task([ 'mkdocs build --clean' ]);

    gulp.src('./site/**/*')
        .pipe(publisher.publish())
        .pipe(publisher.sync())
        .pipe(awspublish.reporter());

});

gulp.task('serve', ['js'], function() {

    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    gulp.watch( paths.js, ['js'] ).on('change', reload);
    // gulp.watch( paths.plugins, ['js'] ).on('change', reload);
    gulp.watch( './test/test.js' ).on('change', reload);
    gulp.watch( paths.html ).on('change', reload);

});

gulp.task('default', ['serve']);
