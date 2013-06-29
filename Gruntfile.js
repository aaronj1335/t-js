module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            files: ['t.js', 'test/**/*.js'],
            options: {jshintrc: '.jshintrc'}
        },
        mochaTest: {
            '.unit-test-results.tmp': ['test/**/*.js']
        },
        copy: {
            hooks: {
                files: [
                    {expand: true, src: 'bin/*commit', dest: '.git/hooks/'}
                ]
            }
        },
        shell: {
            docs: {
                command: 'bin/make-docs'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('docs', ['shell:docs']);
    grunt.registerTask('test', ['jshint', 'mochaTest']);
    grunt.registerTask('default', ['test']);
};
