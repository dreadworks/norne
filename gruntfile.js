module.exports = function (grunt) {

    var config, sources, pgk, port, _;

    _ = require('underscore');

    port = 8080;
    pkg = grunt.file.readJSON('package.json');
    sources = [
        'intro',

        // exposed norne object
        'core',

        // utilities
        'util/register',
        'util/obj',
        'util/evt',
        'util/exc',
        'util/xhr',
        'util/clock',
        'util/bezier',
        'util/color',

        // core library
        'core/world',
        'core/story',
        'core/persist',
        'core/physics',

        // data objects (the model)
        'data/lane',
        'data/character',
        'data/body',

        // broker working on the proxy
        'broker/world',
        'broker/lanes',
        'broker/character',
        'broker/bodies',

        // rendering data in the proxy
        'render/world',
        'render/lane',
        'render/character',
        'render/body',

        'outro'
    ];

    config =  {

        pkg: pkg,

        target: {
            dev: '_dev/'+ pkg.name +'.js',
            test: 'text/'+ pkg.name +'.js',
            dist: 'dist/'+ pkg.name + '.js'
        },

        sources: _(sources).map(function (source) {
            return 'src/' + source + '.js';
        }),

        tests: _(sources).map(function (source) {
            return 'test/' + source + '.spec.js';
        })

    };

    grunt.initConfig({
        pkg: config.pkg,

        clean: {
            dev: [config.target.dev],
            test: [config.target.test],
            dist: [config.target.dist]
        },

        concat: {
            dev: {
                src: config.sources,
                dest: config.target.dev
            },
            test: {
                src: config.sources,
                dest: config.target.test
            },
            dist: {
                src: config.sources,
                dest: config.target.dist
            }
        },

        watch: {
            files: _(config.sources).union(config.tests),
            tasks: 'test'
        },

        jasmine: {
            dev: {
                src: config.target.dev,
                options: {
                    specs: config.tests,
                    template: 'test/grunt.tmpl',
                    vendor: 'lib/*.js',
                    '--web-security': false
                }
            }
        },

        jshint: {
            sources: _(config.sources).without('src/intro.js', 'src/outro.js'),
            dev: config.target.dev,
            dist: config.target.dist,
            jshintrc: true
        },

        connect: {
            test: {
                options: {
                    port: port,
                    base: 'test/assets',
                    keepalive: false
                }
            },

            demo: {
                options: {
                    port: port+1,
                    base: './',
                    keepalive: true
                }
            }
        },

        uglify: {
            options: {
                banner: '/*\n * norne || Lukas Hueck, Felix Hamann || MIT License (MIT)\n */\n'
            },
            dist: {
                files: {
                    'dist/norne.min.js': config.target.dist
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    grunt.registerTask('dev', [
        'clean:dev',
        'concat:dev',
        'jshint:dev'
    ]);


    grunt.registerTask('test', [
        'jshint:sources', 
        'dev',
        'connect:test',
        'jasmine:dev'
    ]);


    grunt.registerTask('dist', [
        'clean:dist',
        'jshint:sources',
        'concat:dist',
        'jshint:dist',
        'uglify:dist'
    ]);


};
