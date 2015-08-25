module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        "babel": {
            options: {
                sourceMap: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.js'],
                    dest: 'dist/'
                }]
            }
        },
        execute: {
            target: {
                src: ['dist/app.js']
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'src/', src: ['cobol/grammar/*'], dest: 'dist/'}
                ]
            }
        },
        clean: ["dist/"]
    });

    grunt.registerTask("build", ['clean', "babel", "copy:main"]);
    grunt.registerTask("fast-build", ["babel", "copy:main"]);

    grunt.registerTask("serve", ["build", "execute"]);
};