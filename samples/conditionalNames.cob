IDENTIFICATION DIVISION.
PROGRAM-ID.  ConditionalNames.
DATA DIVISION.
WORKING-STORAGE SECTION.

01 n PIC 99 VALUE ZEROS.
01 i PIC 99 VALUE 1.
    88 ONE VALUE 1.
    88 TWO VALUE 2.
    88 BELOWORFOUR VALUE 3, 4.
    88 FIVEANDMORE VALUE 5 THRU 9.
    88 OVER9 VALUE 10 THROUGH 99.


PROCEDURE DIVISION.
    MOVE 3 TO i.

    EVALUATE TRUE
        WHEN ONE DISPLAY "ONE!" DISPLAY "ONE!"
        WHEN TWO DISPLAY "TWO!"
        WHEN BELOWORFOUR DISPLAY "BELOW OR EQ FOUR"
        WHEN FIVEANDMORE DISPLAY "FIVE AND MORE"
        WHEN OVER9 DISPLAY "OVER 9"
    END-EVALUATE.

    EVALUATE FALSE
        WHEN i > 5 DISPLAY "i is below five"
        WHEN i > 2 DISPLAY "i is below two"
    END-EVALUATE.

    STOP RUN.
