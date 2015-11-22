module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        "babel": {
            options: {
                sourceMap: true,
                "plugins": ["typecheck"]
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
        shell: {
            antlr: {
                options: {
                    execOptions: {
                        cwd: 'src/cobol/grammar/'
                    }
                },
                command: 'java -Xmx500M -cp "/usr/local/lib/antlr-4.5-complete.jar:$CLASSPATH" org.antlr.v4.Tool -Dlanguage=JavaScript -o ../../../dist/cobol/parser/ Cobol85.g4 -visitor'
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
                    {expand: true, cwd: 'src/', src: ['cobol/grammar/*', 'bridge/CobolRuntime.cs'], dest: 'dist/'}
                ]
            }
        },
        clean: ["dist/"]
    });

    grunt.registerTask("build", ['clean', "babel", "copy:main", "shell:antlr"]);
    grunt.registerTask("fast-build", ["babel", "copy:main", "shell:antlr"]);
    grunt.registerTask("serve", ["build", "execute"]);
};