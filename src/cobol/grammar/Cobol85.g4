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

variableDeclaration
	:   NUMBER ID picture initializer? DOT   #elementaryVariableDecl
	|   NUMBER ID DOT           #groupVariableDecl
	;

/*TO BE FIX - WE NEED TO IMPLEMENT CONDITIONAL LEXING*/
picture
	:	'PIC' (ID|NUMBER)                     #verbosePicture
	|   'PIC' (ID|NUMBER) '(' NUMBER ')'      #numberPicture
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

addStat
	:	'ADD' NUMBER 'TO' ID #addToStat
	|	'ADD' ID+ 'GIVING' ID #addGivingStat
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
	:	STRING #stringLiteral
	|   NUMBER #numericLiteral
	;

NUMBER : [0-9]+;

ID : [a-zA-Z0-9]+;

STRING : QUOTE [a-zA-Z0-9=:. ]+ QUOTE;

DOT : '.';

QUOTE : '"';

APOSTR : '\'';

WS
	:	(' ' | '\r' | '\n' ) -> channel(HIDDEN)
	;

