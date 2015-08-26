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
        { $$ = $4}
    ;

program-id
    :   PROGRAM-ID DOT ID { $$ = {id: $3};}
    ;

procedure-division
    :   PROCEDURE DIVISION DOT
        paragraphs
        { $$ = new ProcedureDivision($4); }
    ;

paragraphs
    :   paragraphs paragraph                            { $$.push(new Paragraph($2)); }
    |   paragraph                                       { $$ = [new Paragraph($1)]; }
    ;

paragraph
    :   statements DOT
    ;

statements
    :   statement                                       { $$ = [$1]; }
    |	statements statement                            { $$ = $1.push($2); }
    ;

statement
    :   display-stat
    ;

display-stat
    :   DISPLAY literal                                 { $$ = new DisplayVerb($2); }
    ;

literal
	:	string_literal                                  { $$ = new StringLiteral($1); }
	;

string_literal
    : STRING
    ;