var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    awspublish = require('gulp-awspublish'),
    browserSync = require('browser-sync').create(),
    shell = require('gulp-shell');

var reload = browserSync.reload;

// ----- Config
var aws = require('./aws.json');

var jsPrefix = 'js/src/';

var paths = {
    jsCoreIn: [
        'init',
        'constants',
        'helpers',
        'utils',
        'layers',
        'elements',
        'effects',
        'misc'
    ],
    jsCoreDist: 'js/dist',
    jsCoreDocs: 'docs/download',
    html: ['./**/*.html']
};

paths.jsCoreIn.forEach(function(path, i) {
    paths.jsCoreIn[i] = jsPrefix + paths.jsCoreIn[i] + '.js';
});

function fullAndMin(dest) {
    gulp.src( paths.jsCoreIn )
        .pipe(concat('martin.js'))
        .pipe(gulp.dest( dest ));

    gulp.src( paths.jsCoreIn )
        .pipe(concat('martin.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest( dest ));
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
    gulp.watch( paths.html ).on('change', reload);

});

gulp.task('default', ['serve']);
