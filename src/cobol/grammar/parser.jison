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
        sections
        { $$ = new ProcedureDivision($4); }

    |   PROCEDURE DIVISION DOT
        paragraphs
        { $$ = new ProcedureDivision([new Section($4)]); }
    ;

sections
    :   section                                         { $$ = [$1]; }
    |   sections section                                { $$.push($1); }
    ;

section:
    ID SECTION DOT
    paragraphs
    { $$ = new Section($4, $1); }
    ;

paragraphs
    :   paragraph                                       { $$ = [new Paragraph($1)]; }
    |   paragraphs paragraph                            { $$.push(new Paragraph($2)); }
    ;

paragraph
    :   statements DOT
    ;

statements
    :   statement                                       { $$ = [$1]; }
    |	statements statement                            { $$.push($2); }
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