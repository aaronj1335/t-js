module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            files: ['t.js', 'test/**/*.js'],
            options: {jshintrc: '.jshintrc'}
        },
        mochaTest: {
            '.unit-test-results.tmp': ['test/**/*.js']
        },
        shell: {
            docs: {
                command: 'bin/make-docs'
            },
            reposetup: {
                command:
                    'chmod +x bin/pre-commit && cp bin/pre-commit .git/hooks/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('docs', ['shell:docs']);
    grunt.registerTask('test', ['jshint', 'mochaTest']);
    grunt.registerTask('default', ['test']);
};
