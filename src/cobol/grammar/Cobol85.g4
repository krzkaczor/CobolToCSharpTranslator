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
		sections
	;

sections
	:	section*
	;

section
	:	sentence*
		ID 'SECTION' DOT
		paragraphs
	;

paragraphs
	:	paragraph*
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
	;

displayStat
	:	'DISPLAY' LITERAL
	;

LITERAL
	:	STRING_LITERAL
	|   NUMERIC_LITERAL
	;

STRING_LITERAL
	:   QUOTE [a-zA-Z0-9 ]* QUOTE
	|   APOSTR [a-zA-Z0-9 ]* APOSTR
	;

NUMERIC_LITERAL: [0-9]+ ;

ID : [a-zA-Z0-9]+;

DOT : '.';

QUOTE : '"';

APOSTR : '\'';

WS
	:	(' ' | '\r' | '\n' ) -> channel(HIDDEN)
	;
