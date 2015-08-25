/lex

%%

compilation-unit
    :	identification-division
        procedure-division
        EOF
        { $$ = new CompilationUnit($1, $2); return $$; }
    ;

identification-division
    :   IDENTIFICATION DIVISION DOT
        program-id DOT
        { $$ = 'abc'; }
    ;

program-id
    :   PROGRAM-ID DOT ID
    ;

procedure-division
    :   PROCEDURE DIVISION DOT
        paragraphs
    ;

paragraphs
    :   paragraphs paragraph
    |   paragraph
    ;

paragraph
    :	sentence* DOT
    ;

sentence
    :   statement
    ;

statement
    :   display-stat
    ;

display-stat
    :   DISPLAY literal
    ;

literal
	:	string_literal
	;

string_literal
    : STRING
    ;