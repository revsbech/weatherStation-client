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
      csslibs: {
        src: [
          "app/bower_components/html5-boilerplate/dist/css/normalize.css",
          "app/bower_components/html5-boilerplate/dist/css/main.css",
          "app/bower_components/bootstrap/dist/css/bootstrap.css",
          'app/bower_components/bootstrap-material-design/dist/css/bootstrap-material-design.css',
          'app/bower_components/bootstrap-material-design/dist/css/ripples.css',
          "app/bower_components/moment/src/moment.js"
        ],
        dest: 'app/libs.css'
      },
      jslibs: {
        src: [
          'app/bower_components/angular/angular.js',
          'app/bower_components/angular-route/angular-route.js',
          "app/bower_components/angular-bootstrap/ui-bootstrap.js",
          "app/bower_components/angular-ui-router/release/angular-ui-router.js",
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
      css: {
        files: 'src/compass/**',
        tasks: ['sass'],
      },
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
