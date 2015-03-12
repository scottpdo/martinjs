module.exports = function(grunt) {

    var buildFiles = [
        'init',
        'constants',
        'helpers',
        'utils',
        'layers',
        'drawing',
        'effects',
        'misc'
    ];

    buildFiles.forEach(function(fileName, i) {
        buildFiles[i] = 'js/src/' + fileName + '.js';
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                force: true
            },
            all: ['Gruntfile.js', 'js/src/**/*.js']
        },

        concat: {
            build: {
                files: {
                    'js/dist/martin.js': buildFiles,
                    'docs/download/martin.js': buildFiles
                }
            }
        },

        uglify: {
            build: {
                files: {
                    'js/dist/martin.min.js': buildFiles,
                    'docs/download/martin.min.js': buildFiles,
                    'js/dist/martin.watermark.min.js': ['js/src/martin.watermark.js']
                }
            }
        },

        watch: {
            scripts: {
                files: ['js/**/*.js'],
                tasks: ['uglify', 'jshint'],
                options: {
                    spawn: false,
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'watch']);

};
