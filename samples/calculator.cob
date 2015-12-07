IDENTIFICATION DIVISION.
PROGRAM-ID.  MoveData.

DATA DIVISION.
    WORKING-STORAGE SECTION.
      01 selection PIC 9 VALUE 1.
        88 loadAccumulatorSelection VALUE 1.
        88 addSelection VALUE 2.
        88 subtractSelection VALUE 3.
        88 multiplySelection VALUE 4.
        88 divideSelection VALUE 5.
        88 exitSelection VALUE 0.

      01 accumulator PIC 999 VALUE 0.
      01 val PIC 999 VALUE 0.

PROCEDURE DIVISION.
    DISPLAY " Calculator ver 1.0"
    DISPLAY "=====================".

    PERFORM UNTIL 1=2
        PERFORM Menu
    END-PERFORM.

    Menu.
        DISPLAY "===============================".
        DISPLAY "Accumulator current value: " accumulator
        DISPLAY "===============================".
        PERFORM RysujMenu.
        DISPLAY "Your action:".
        ACCEPT selection.

        EVALUATE TRUE
            WHEN loadAccumulatorSelection PERFORM loadAccumulatorAction
            WHEN addSelection PERFORM addAction
            WHEN subtractSelection PERFORM subtractAction
            WHEN multiplySelection PERFORM multiplyAction
            WHEN divideSelection PERFORM divideAction
            WHEN exitSelection STOP RUN
        END-EVALUATE.


    RysujMenu.
        DISPLAY "1. Load new accumulator value"
        DISPLAY "2. Add"
        DISPLAY "3. Subtract"
        DISPLAY "4. Multiply"
        DISPLAY "5. Divide"
        DISPLAY "0. Exit".

    loadAccumulatorAction.
        DISPLAY "New value: ".
        ACCEPT accumulator.

    addAction.
        DISPLAY "Value: ".
        ACCEPT val.
        ADD val TO accumulator.

    subtractAction.
        DISPLAY "Value:".
        ACCEPT val.
        SUBTRACT val FROM accumulator.

    multiplyAction.
        DISPLAY "Value:".
        ACCEPT val.
        MULTIPLY val BY accumulator.

    divideAction.
        DISPLAY "Value:".
        ACCEPT val.
        DIVIDE val INTO accumulator.
