#!/bin/sh

#clean
rm -r /tmp/antlr-debug
cd src/cobol/grammar/
java -Xmx500M -cp "/usr/local/lib/antlr-4.5-complete.jar:$CLASSPATH" org.antlr.v4.Tool -o /tmp/antlr-debug/ Cobol85.g4
cd /tmp/antlr-debug
javac Cobol85*.java
java org.antlr.v4.runtime.misc.TestRig Cobol85 compilationUnit --gui <&0
