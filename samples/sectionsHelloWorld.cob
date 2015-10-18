       IDENTIFICATION DIVISION.
       PROGRAM-ID. HELLOWORLD.
       PROCEDURE DIVISION.
       DISPLAY "HELLO WORLD".

       Section1 SECTION.
              DISPLAY "Section sen1 stat1"
              DISPLAY "section sen1 stat2".
              Par1.
                  DISPLAY "PAR 1".

       Section2 SECTION.
              PERFORM Par1.
              DISPLAY "ABC".
              GO TO Par2.
              Par1.
                  DISPLAY "PAR 2".
              Par2.
              DISPLAY "PAR 3".
              STOP RUN.
