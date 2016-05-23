/**
 * Grunt sass/scss compile and compression
 */
module.exports = function (grunt) {
  grunt.initConfig({
    // Compolile sass/scss
    sass: {                              // Task
      app: {                            // Target
        options: {                       // Target options
          style: 'compressed',
          sourcemap: 'none'
        },
        files: {
          'app/app.css': 'src/compass/app.scss',       // 'destination': 'source'
        }
      }
    },
    concat: {
      libs: {
        src: [
          'app/bower_components/angular/angular.js',
          'app/bower_components/angular-route/angular-route.js',
          'app/'
        ],
        dest: 'app/libs.js'
      },
      app: {
        src: [
          'src/js/**/*.js'
        ],
        'dest': "app/app.js"
      }
    },
    // To watch changes run 'grunt watch'
    watch: {
      js: {
        files: 'src/js/**',
        tasks: ['concat'],
        options: {
          livereload: false,
          nospawn: true
        },
      },
    },
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['sass','concat']);
};
