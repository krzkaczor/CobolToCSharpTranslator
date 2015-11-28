grammar Cobol85;

compilationUnit
	:	identificationDivision
		dataDivision?
		procedureDivision
		EOF
	;

identificationDivision
	:   (KWID | IDENTIFICATION) DIVISION DOT
		programId DOT
	;

programId
	:	PROGRAMID DOT ID
	;

dataDivision
	:	DATA DIVISION DOT
		workingStorageSection
	;

workingStorageSection
	:	WORKINGSTORAGE SECTION DOT
	 	variableDeclaration*
	;

literalList
    : (literal ',')* literal
    ;

variableDeclaration
	:   '88' ID VALUE literalList DOT                            #conditionalNameDecl
	|   '88' ID VALUE literal (THRU|THROUGH) literal DOT         #conditionalNameThruDecl
	|   NUMBER ID picture initializer? DOT                       #elementaryVariableDecl
	|   NUMBER ID DOT                                            #groupVariableDecl
	;

picture
	:   PIC (ID | NUMBER | '(' | ')')+
	;

initializer
    :   VALUE ZEROS #zeroInit
    |   VALUE literal #literalInit
    ;

procedureDivision
	:	PROCEDURE DIVISION DOT
		sentence*
		paragraph*
		section*
	;

section
	:	ID SECTION DOT
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

statements
    :   statement*
    ;

ifStat
    :   IF booleanExpression THEN sentence                         #ifThenStat
    |   IF booleanExpression THEN statements ENDIF                 #ifThenEndIfStat
    |   IF booleanExpression THEN statements ELSE statements ENDIF #ifElseStat
    ;

stopRunStat
	:	STOP RUN
	;

acceptStat
	:	ACCEPT ID
	;

moveStat
	:	MOVE literal TO ID
	;

goToStat
	:	GO TO ID
	;

varOrNumber
    :   numericLiteral
    |   variableRef
    ;

addStat
	:	ADD varOrNumber TO ID       #addToStat
	|	ADD varOrNumber+ GIVING ID  #addGivingStat
	;

subtractStat
	:	SUBTRACT varOrNumber+ FROM ID #subtractToStat
	|	SUBTRACT varOrNumber+ FROM varOrNumber GIVING ID #subtractGivingStat
	;

multiplyStat
	:	MULTIPLY varOrNumber BY ID #multiplyByStat
	|	MULTIPLY varOrNumber BY varOrNumber GIVING ID #multiplyByGivingStat
	;

divideStat
	:	DIVIDE varOrNumber INTO ID #divideIntoStat
	|	DIVIDE varOrNumber BY varOrNumber GIVING ID (REMAINDER ID)? #divideByGivingStat
	;

evaluateStat
    :   EVALUATE (TRUE | FALSE)
            whenCase+
        ENDEVALUATE
    ;

whenCase
    :   WHEN booleanExpression statement+
    ;

performStat
	:	PERFORM ID #performSingleStat
	|   PERFORM ID NUMBER TIMES #performTimesStat
	;

performUntilStat
    :   PERFORM UNTIL booleanExpression statement+ ENDPERFORM
    ;

displayStat
	:   DISPLAY expr+                      #advancingDisplayStat
	|   DISPLAY expr+ WITH NO ADVANCING    #noAdvancingDisplayStat
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

//lexer rules

//keywords
DIVISION : D I V I S I O N;
IDENTIFICATION : I D E N T I F I C A T I O N;
KWID : I D;
PROGRAMID : P R O G R A M '-' I D;
DATA : D A T A;
WORKINGSTORAGE : W O R K I N G '-' S T O R A G E;
SECTION : S E C T I O N;
VALUE : V A L U E;
THRU : T H R U;
THROUGH : T H R O U G H;
PIC : P I C;
ZEROS : Z E R O S;
PROCEDURE : P R O C E D U R E;
IF : I F;
ENDIF : E N D '-' I F;
ELSE : E L S E;
THEN : T H E N;
STOP : S T O P;
RUN : R U N;
ACCEPT : A C C E P T;
MOVE : M O V E;
TO : T O;
GO : G O;
ADD : A D D;
GIVING : G I V I N G;
DISPLAY : D I S P L A Y;
WITH : W I T H;
NO: N O ;
ADVANCING: A D V A N C I N G;
PERFORM: P E R F O R M;
UNTIL: U N T I L;
ENDPERFORM  : E N D '-' P E R F O R M;
TIMES : T I M E S;
WHEN : W H E N;
ENDEVALUATE : E N D '-' E V A L U A T E;
EVALUATE : E V A L U A T E;
TRUE : T R U E;
FALSE : F A L S E;
DIVIDE : D I V I D E;
REMAINDER : R E M A I N D E R;
INTO : I N T O;
MULTIPLY : M U L T I P L Y ;
BY : B Y ;
SUBTRACT : S U B T R A C T;
FROM : F R O M;

NUMBER : [-+]?[0-9]+;

ID : [a-zA-Z0-9-_]+;

STRING : QUOTE [a-zA-Z0-9=:.! ]+ QUOTE;

DOT : '.';

QUOTE : '"';

APOSTR : '\'';

WS
	:	(' ' | '\r' | '\n' ) -> channel(HIDDEN)
	;

//used for case insensitive keyword definition
fragment A:('a'|'A');
fragment B:('b'|'B');
fragment C:('c'|'C');
fragment D:('d'|'D');
fragment E:('e'|'E');
fragment F:('f'|'F');
fragment G:('g'|'G');
fragment H:('h'|'H');
fragment I:('i'|'I');
fragment J:('j'|'J');
fragment K:('k'|'K');
fragment L:('l'|'L');
fragment M:('m'|'M');
fragment N:('n'|'N');
fragment O:('o'|'O');
fragment P:('p'|'P');
fragment Q:('q'|'Q');
fragment R:('r'|'R');
fragment S:('s'|'S');
fragment T:('t'|'T');
fragment U:('u'|'U');
fragment V:('v'|'V');
fragment W:('w'|'W');
fragment X:('x'|'X');
fragment Y:('y'|'Y');
fragment Z:('z'|'Z');
