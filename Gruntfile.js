module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        "babel": {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    "dist/app.js": "src/app.js"
                }
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
                    // includes files within path
                    {expand: true, cwd: 'src/', src: ['cobol/grammar/*'], dest: 'dist/'}
                ]
            }
        },
    });

    grunt.registerTask("default", ["babel"]);

    grunt.registerTask("build", ["babel", "copy:main"]);

    grunt.registerTask("serve", ["build", "execute"]);
};