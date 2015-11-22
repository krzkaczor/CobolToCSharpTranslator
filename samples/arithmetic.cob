IDENTIFICATION DIVISION.
PROGRAM-ID.  Arith.

DATA DIVISION.
WORKING-STORAGE SECTION.
01 A PIC 9.
01 B PIC 9.
01 C PIC 99.
01 D PIC 999.

PROCEDURE DIVISION.
Begin.
    MOVE 2 TO A.
    ADD 2 TO A.
    DISPLAY A.
    MOVE 3 TO B.
    ADD 10 TO B.
    DISPLAY B.
    ADD A B GIVING A.
    DISPLAY A.

    MOVE 2 TO A.
    MOVE 1 TO B.
    MULTIPLY 2 BY A.
    DISPLAY A.
    MULTIPLY 5 BY B.
    DISPLAY B.
    MULTIPLY A BY B GIVING C.
    MULTIPLY A BY B GIVING D.
    DISPLAY C.
    DISPLAY D.

    MOVE 2 TO A.
    MOVE 1 TO B.
    MOVE 30 TO C.
    MOVE 30 TO D.
    SUBTRACT 35 FROM C.
    SUBTRACT 5 A FROM D.

    DISPLAY C.
    DISPLAY D.
    SUBTRACT 5 A FROM C GIVING C.
    DISPLAY D.

    MOVE 15 TO C.
    MOVE 31 TO D.
    DIVIDE D BY C GIVING A REMAINDER B.
    DIVIDE C INTO D.
    DISPLAY A.
    DISPLAY B.
    DISPLAY C.
    DISPLAY D.
