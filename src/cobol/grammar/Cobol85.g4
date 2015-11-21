grammar Cobol85;

compilationUnit
	:	identificationDivision
		dataDivision?
		procedureDivision
		EOF
	;

identificationDivision
	:   ('ID' | 'IDENTIFICATION') 'DIVISION' DOT
		programId DOT
	;

programId
	:	'PROGRAM-ID.' ID
	;

dataDivision
	:	'DATA' 'DIVISION' DOT
		workingStorageSection
	;

workingStorageSection
	:	'WORKING-STORAGE' 'SECTION' DOT
	 	variableDeclaration*
	;

literalList
    : (literal ',')* literal
    ;

variableDeclaration
	:   '88' ID 'VALUE' literalList DOT   #conditionalNameDecl
	|   '88' ID 'VALUE' literal ('THRU'|'THROUGH') literal DOT   #conditionalNameThruDecl
	|   NUMBER ID picture initializer? DOT   #elementaryVariableDecl
	|   NUMBER ID DOT           #groupVariableDecl
	;

picture
	:   'PIC' (ID | NUMBER | '(' | ')')+
	;

initializer
    :   'VALUE' 'ZEROS' #zeroInit
    |   'VALUE' literal #literalInit
    ;

procedureDivision
	:	'PROCEDURE' 'DIVISION' DOT
		sentence*
		paragraph*
		section*
	;

section
	:	ID 'SECTION' DOT
		sentence*
		paragraph*
	;

paragraph
	:	ID DOT
		sentence*
	;

sentence
	: statement* DOT
	;

statement
	:	displayStat
	|   goToStat
	|   performStat
	|   performUntilStat
	|   stopRunStat
	|   moveStat
	|   acceptStat
	|   ifStat
	|   addStat
	|   subtractStat
	|   multiplyStat
	|   divideStat
	|   evaluateStat
	;

/*todo: ughhhh*/
statement2
    :   statement
    ;

ifStat
    :   'IF' booleanExpression 'THEN' sentence #ifThenStat
    |   'IF' booleanExpression 'THEN' statement* 'END-IF' #ifThenEndIfStat
    |   'IF' booleanExpression 'THEN' statement* 'ELSE' statement2* 'END-IF' #ifElseStat
    ;

stopRunStat
	:	'STOP' 'RUN'
	;

acceptStat
	:	'ACCEPT' ID
	;

moveStat
	:	'MOVE' literal 'TO' ID
	;

goToStat
	:	'GO' 'TO' ID
	;

varOrNumber
    :   numericLiteral
    |   variableRef
    ;

addStat
	:	'ADD' varOrNumber 'TO' ID #addToStat
	|	'ADD' varOrNumber+ 'GIVING' ID #addGivingStat
	;

subtractStat
	:	'SUBTRACT' varOrNumber+ 'FROM' ID #subtractToStat
	|	'SUBTRACT' varOrNumber+ 'FROM' varOrNumber 'GIVING' ID #subtractGivingStat
	;

multiplyStat
	:	'MULTIPLY' varOrNumber 'BY' ID #multiplyByStat
	|	'MULTIPLY' varOrNumber 'BY' varOrNumber 'GIVING' ID #multiplyByGivingStat
	;

divideStat
	:	'DIVIDE' varOrNumber 'INTO' ID #divideIntoStat
	|	'DIVIDE' varOrNumber 'BY' varOrNumber 'GIVING' ID ('REMAINDER' ID)? #divideByGivingStat
	;

evaluateStat
    :   'EVALUATE' ('TRUE' | 'FALSE')
            whenCase+
        'END-EVALUATE'
    ;

whenCase
    :   'WHEN' booleanExpression statement+
    ;

performStat
	:	'PERFORM' ID #performSingleStat
	|   'PERFORM' ID NUMBER 'TIMES' #performTimesStat
	;

performUntilStat
    :   'PERFORM' 'UNTIL' booleanExpression statement+ 'END-PERFORM'
    ;

displayStat
	:	'DISPLAY' expr+ #advancingDisplayStat
	|   'DISPLAY' expr+ 'WITH NO ADVANCING'? #noAdvancingDisplayStat
	;

expr
	:	literal #literalExpr
	| 	ID #symbolExpr
	;

booleanExpression
    :   literal      #literalBoolExpr
    |   ID           #symbolBoolExpr
    |   booleanExpression ('=' | '>' | '<' | '<=' | '>=') booleanExpression #operatorBoolExpr
    ;

literal
	:	stringLiteral
	|   numericLiteral
	;

stringLiteral
    :   STRING
    ;

numericLiteral
    :   NUMBER
    ;

variableRef
    :   ID
    ;

NUMBER : [0-9]+;

ID : [a-zA-Z0-9-]+;

STRING : QUOTE [a-zA-Z0-9=:.! ]+ QUOTE;

DOT : '.';

QUOTE : '"';

APOSTR : '\'';

WS
	:	(' ' | '\r' | '\n' ) -> channel(HIDDEN)
	;

