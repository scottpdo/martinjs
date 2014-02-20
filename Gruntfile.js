module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                force: true
            },
            all: ['Gruntfile.js', 'js/src/**/*.js']
        },

        uglify: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'js/src',
                    ext: '.min.js',
                    src: '**/*.js',
                    dest: 'js/min'                   
                }]
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
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'uglify', 'watch']);

};