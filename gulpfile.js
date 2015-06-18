var VERSION = '0.2.3-beta';

var fs = require('fs'),
    gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    awspublish = require('gulp-awspublish'),
    browserSync = require('browser-sync').create(),
    shell = require('gulp-shell');

var reload = browserSync.reload;

// ----- Config
var bower = require('./bower.json'),
    aws = require('./aws.json');

function writeBowerVersion() {
    bower.version = VERSION;
    fs.writeFile('./bower.json', JSON.stringify(bower, null, '  '), function(err, data) {
        if (err) return console.log(err);
        console.log('Wrote version to bower.json');
    });
}

var jsPrefix = 'js/src/';

var paths = {
    jsCoreIn: [
        'init',
        'helpers',
        'utils',
        'layers',
        'elements',
        'effects',
        'events',
        'misc'
    ],
    jsCoreDist: 'js/dist',
    jsCoreDocs: 'docs/download',
    html: ['./**/*.html']
};

paths.jsCoreIn.forEach(function(path, i) {
    paths.jsCoreIn[i] = jsPrefix + paths.jsCoreIn[i] + '.js';
});

function writeVersion(callback) {

    writeBowerVersion();

    var init = './js/src/init.js';

    fs.readFile(init, 'utf8', function read(err, data) {

        var lines = data.split('\n'),
            versionString = 'Martin._version = ';
        lines.forEach(function(line, i) {
            if ( line.indexOf(versionString) > -1 ) {
                lines.splice(i, 1, versionString + "'" + VERSION + "'" + ';');
            }
        });

        fs.writeFile(init, lines.join('\n'), function(err, data) {
            if (err) return console.log(err);
            console.log('Wrote version to init.js');
            callback();
        });
    });
}

function writeTestSource() {
    var test = './test/index.html';
    fs.readFile(test, 'utf8', function read(err, data) {

        data = data.split('\n');

        var start = '<!-- start JS core files -->',
            end = '<!-- end JS core files -->',
            startLine,
            endLine,
            newLines = [];

        data.forEach(function(line, i) {
            if ( line.indexOf(start) > -1 ) { startLine = i; }
            if ( line.indexOf(end) > -1 ) { endLine = i; }
        });

        paths.jsCoreIn.forEach(function(path) {
            newLines.push('<script src="../' + path + '"></script>');
        });

        newLines = newLines.join('\n');

        data.splice(startLine + 1, endLine - startLine - 1, newLines);
        data = data.join('\n');

        fs.writeFile(test, data, function(err, data) {
            if (err) return console.log(err);
            console.log('Wrote core JS files to the test spec.');
        });
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
    }

    writeVersion(processFiles);
    writeTestSource();
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
    gulp.watch( './test/test.js' ).on('change', reload);
    gulp.watch( paths.html ).on('change', reload);

});

gulp.task('default', ['serve']);
