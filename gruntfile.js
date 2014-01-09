module.exports = function (grunt) {

	var config, pgk;

	pkg = grunt.file.readJSON('package.json');

	config =  {

		pkg: pkg,

		target: {
			dev: '_dev/'+ pkg.name +'.js',
			test: 'text/'+ pkg.name +'.js'
		},

		sources: [
			'src/core.js',

			// utilities
			'src/util/obj.js',
			'src/util/evt.js',

			// core lib
			'src/core/world.js',
			'src/core/lane.js'
		]

	};


	grunt.initConfig({
		pkg: config.pkg,

		clean: {
			dev: [config.target.dev],
			test: [config.target.test]
		},

		concat: {
			dev: {
				src: config.sources,
				dest: config.target.dev
			},
			test: {
				src: config.sources,
				dest: config.target.test
			}
		},

		watch: {
			files: 'src/**/*.js',
			tasks: 'dev'
		},

		jasmine: {
			dev: {
				src: config.target.dev,
				options: {
					specs: 'test/*.spec.js',
					template: 'test/grunt.tmpl',
					vendor: 'lib/*.js'
				}
			}
		},

		jshint: {
			options: {
				jshintrc: 'jshint.json'
			},
			source: ['src/*.js', 'src/*/*.js']
		}

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jasmine');


	grunt.registerTask('dev', ['clean:dev', 'concat:dev']);
	grunt.registerTask('test', ['dev', 'jshint', 'jasmine:dev']);

};
