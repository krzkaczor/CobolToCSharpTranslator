#Cobol to C# translator
Project written in NodeJS using EcmaScript 6.

##Running 

```
npm install && grunt serve
```


##Test dependencies

To run tests you need to fulfill `node-cobol` and `node-csharp` dependencies. So basically you need to have `gnu-cobol` and `mono` installed in your system.

##Development

###ANTLR debug
There is useful script to visually debug ANTLR grammar.

to run with default input (`samples/nextFeature.cob`)

```
./debug-antlr.sh 
```

to run with custom file

```
./debug-antlr.sh samples/sectionsHelloWorld.cob
```