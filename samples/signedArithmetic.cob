IDENTIFICATION DIVISION.
PROGRAM-ID.  SignedArith.

DATA DIVISION.
WORKING-STORAGE SECTION.
01 A PIC S9.
01 B PIC 99 VALUE 31.

PROCEDURE DIVISION.
Begin.
    DISPLAY A.
    MOVE -26 TO A.
    DISPLAY A.
    ADD B TO A.
    MOVE 1000 TO B.
    DISPLAY B.
    DISPLAY A.