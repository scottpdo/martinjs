module.exports = function(grunt) {

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
                    'js/dist/martin.js': [
                        'js/src/init.js',
                        'js/src/constants.js',
                        'js/src/helpers.js',
                        'js/src/utils.js',
                        'js/src/layers.js',
                        'js/src/drawing.js',
                        'js/src/effects.js',
                        'js/src/misc.js'
                    ],
                }
            }
        },

        uglify: {
            build: {
                files: {
                    'js/dist/martin.min.js': [
                        'js/src/init.js',
                        'js/src/constants.js',
                        'js/src/helpers.js',
                        'js/src/utils.js',
                        'js/src/layers.js',
                        'js/src/drawing.js',
                        'js/src/effects.js',
                        'js/src/misc.js'
                    ],
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
