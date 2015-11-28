IDENTIFICATION DIVISION.
PROGRAM-ID.  SneakyFlow.

PROCEDURE DIVISION.
    DISPLAY "hello world".
    GO TO AlmostEnd.

    DISPLAY "Should not be written".

    AlmostEnd.
        DISPLAY "AlmostEnd".
