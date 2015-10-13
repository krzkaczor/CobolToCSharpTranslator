#!/usr/bin/env bash
cd /usr/local/lib
sudo wget http://www.antlr.org/download/antlr-4.5.1-complete.jar
export CLASSPATH=".:/usr/local/lib/antlr-4.5.1-complete.jar:$CLASSPATH"