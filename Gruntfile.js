'use strict';

module.exports = function(grunt){

	// Load grunt tasks automatically
  	require('load-grunt-tasks')(grunt);

  	grunt.initConfig({

  		pkg: grunt.file.readJSON('package.json'),

  		jshint: {
        options: {
          jshintrc: '.jshintrc',
          reporter: require('jshint-stylish')
        },
        all: {
    			src: ['./Gruntfile.js', './index.js', './test/*.js'],
        }
  		}

  	});

  	grunt.registerTask('default', ['jshint:all']);

};