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
	:   NUMBER ID picture DOT   #elementaryVariableDecl
	|   NUMBER ID DOT           #groupVariableDecl
	;

/*TO BE FIX - WE NEED TO IMPLEMENT CONDITIONAL LEXING*/
picture
	:	'PIC' (ID|NUMBER)                     #verbosePicture
	|   'PIC' (ID|NUMBER) '(' NUMBER ')'      #numberPicture
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
	|   stopRunStat
	|   moveStat
	|   acceptStat
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

performStat
	:	'PERFORM' ID #performSingleStat
	|   'PERFORM' ID NUMBER 'TIMES' #performTimesStat
	;

displayStat
	:	'DISPLAY' expr #advancingDisplayStat
	|   'DISPLAY' expr 'WITH NO ADVANCING'? #noAdvancingDisplayStat
	;

expr
	:	literal #literalExpr
	| 	ID #symbolExpr
	;

literal
	:	STRING #stringLiteral
	|   NUMBER #numericLiteral
	;

NUMBER : [0-9]+;

ID : [a-zA-Z0-9]+;

STRING : QUOTE [a-zA-Z0-9 ]+ QUOTE;

DOT : '.';

QUOTE : '"';

APOSTR : '\'';

WS
	:	(' ' | '\r' | '\n' ) -> channel(HIDDEN)
	;

