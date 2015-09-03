grammar Cobol85;

compilationUnit
	:	identificationDivision
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
	;

goToStat
	:	'GO' 'TO' ID
	;

displayStat
	:	'DISPLAY' literal
	;

literal
	:	stringLiteral
	|   numericLiteral
	;

stringLiteral
	:   STRING
	;


numericLiteral: NUMBER ;

ID : [a-zA-Z0-9]+;

STRING : QUOTE [a-zA-Z0-9 ]+ QUOTE;

NUMBER : [0-9]+;

DOT : '.';

QUOTE : '"';

APOSTR : '\'';

WS
	:	(' ' | '\r' | '\n' ) -> channel(HIDDEN)
	;
