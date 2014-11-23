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
  		},

      // Configure a mochaTest task
      mochaTest: {
        test: {
          options: {
            reporter: 'spec',
            captureFile: 'test/results.txt', // Optionally capture the reporter output to a file
            quiet: false, // Optionally suppress output to standard out (defaults to false)
            clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
          },
          src: ['test/*.js']
        }
      }

  	});

  	grunt.registerTask('default', ['jshint:all', 'mochaTest']);

};