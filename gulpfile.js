var fs = require('fs'),
    gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    jslint = require('gulp-jslint'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    awspublish = require('gulp-awspublish'),
    browserSync = require('browser-sync').create(),
    shell = require('gulp-shell');

var reload = browserSync.reload;

// ----- Config
var bower = require('./bower.json'),
    aws = require('./aws.json');

var jsPrefix = 'js/src/',
    pluginsPrefix = 'js/src/plugins/';

var paths = {
    jsCoreIn: [
        'start',
        'core/init',
        'core/version',
        'core/helpers',
        'core/utils',
        'object/object',
        'layer/layers',
        'element/init',
            'element/image',
            'element/rect',
            'element/line',
            'element/circle',
            'element/ellipse',
            'element/polygon',
            'element/text',
        'effect/init',
            'effect/desaturate',
            'effect/lighten',
            'effect/opacity',
            'effect/blur',
            'effect/invert',
        'event/events',
        'core/dimensions',
        'end'
    ],
    plugins: [
        'watermark',
        'gradientmap',
        'tile'
    ],
    jsCoreDist: 'js/dist',
    jsCoreDocs: 'docs/download',
    html: ['./**/*.html']
};

paths.jsCoreIn.forEach(function(path, i) {
    paths.jsCoreIn[i] = jsPrefix + path + '.js';
});

// looks for filename martin.PLUGIN.js
paths.plugins.forEach(function(path, i) {
    paths.plugins[i] = pluginsPrefix + path + '.js'
});

function writeBowerVersion(version) {
    bower.version = version;
    fs.writeFile('./bower.json', JSON.stringify(bower, null, '  '), function(err, data) {
        if (err) return console.log(err);
        console.log('Wrote version to bower.json');
    });
}

function writeVersion(callback) {

    var versionFile = './js/src/core/version.js';

    fs.readFile(versionFile, 'utf8', function read(err, data) {

        var lines = data.split('\n'),
            versionString = 'Martin._version = ',
            version;

        lines.forEach(function(line, i) {
            if ( line.indexOf(versionString) > -1 ) {
                version = line.replace(versionString, '');
            }
        });

        writeBowerVersion(version.replace(/["';]/g, ''));

        callback();
    });
}

function fullAndMin(dest) {

    function processFiles() {
        gulp.src( paths.jsCoreIn )
            .pipe(concat('martin.js'))
            .pipe(gulp.dest( dest ));

        gulp.src( paths.jsCoreIn )
            .pipe(concat('martin.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest( dest ));

        if ( dest !== 'docs/download' ) {
            
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
        }
    }

    writeVersion(processFiles);
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

    gulp.watch( paths.jsCoreIn, ['js'] ).on('change', reload);
    gulp.watch( paths.plugins, ['js'] ).on('change', reload);
    gulp.watch( './test/test.js' ).on('change', reload);
    gulp.watch( paths.html ).on('change', reload);

});

gulp.task('default', ['serve']);
