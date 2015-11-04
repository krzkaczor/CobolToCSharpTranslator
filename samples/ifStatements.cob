IDENTIFICATION DIVISION.
PROGRAM-ID.  PerformFormat3.
DATA DIVISION.
WORKING-STORAGE SECTION.
01 i PIC 9 VALUE ZEROS.

PROCEDURE DIVISION.
    MOVE 2 TO i.
    IF i = 9 THEN
        DISPLAY "i equals 9".

    IF i > 0 THEN
       DISPLAY "dupa"
       IF i = 1 THEN
           DISPLAY "EXACTLY 1"
           DISPLAY "BINGO"
       ELSE
           IF i < 2 THEN
               DISPLAY "Greater or eq 2"
       END-IF
    END-IF.

    STOP RUN.
