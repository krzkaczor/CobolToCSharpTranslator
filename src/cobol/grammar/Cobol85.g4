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
	:
		elementaryItem
	|   groupItem
	;

elementaryItem
	:
		NUMBER ID picture DOT
	;

/*TO BE FIX - WE NEED TO IMPLEMENT CONDITIONAL LEXING*/
picture
	:	'PIC' (ID|NUMBER)                     #verbosePicture
	|   'PIC' (ID|NUMBER) '(' NUMBER ')'      #numberPicture
	;

groupItem
	:
		NUMBER ID DOT
		variableDeclaration+
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
	;

stopRunStat
	:	'STOP' 'RUN'
	;

goToStat
	:	'GO' 'TO' ID
	;

performStat
	:	'PERFORM' ID
	;

displayStat
	:	'DISPLAY' literal #advancing
	|   'DISPLAY' literal 'WITH NO ADVANCING'? #noadvancing
	;

literal
	:	stringLiteral
	|   numericLiteral
	;

stringLiteral
	:   STRING
	;


numericLiteral: NUMBER ;

NUMBER : [0-9]+;

ID : [a-zA-Z0-9]+;

STRING : QUOTE [a-zA-Z0-9 ]+ QUOTE;

DOT : '.';

QUOTE : '"';

APOSTR : '\'';

WS
	:	(' ' | '\r' | '\n' ) -> channel(HIDDEN)
	;

