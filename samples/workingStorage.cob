IDENTIFICATION DIVISION.
PROGRAM-ID.  AcceptAndDisplay.

DATA DIVISION.
WORKING-STORAGE SECTION.
01 StudentDetails.
   02  StudentId       PIC 9(7).
   02  StudentName.
       03 Surname      PIC X(8).
       03 Initials     PIC AA.
   02  CourseCode      PIC X(4).
   02  Gender          PIC X.
01 VER                 PIC X(10).
01 some_number         PIC S9(3).

PROCEDURE DIVISION.
Begin.
    MOVE 123456 TO StudentId.
    MOVE "Krzys" TO Surname.
    MOVE "KK" TO Initials.
    MOVE "ABCD" TO CourseCode.
    MOVE "M" TO Gender.
    DISPLAY StudentDetails.
    DISPLAY StudentId.

    MOVE "ver" TO VER.
    DISPLAY VER.

    MOVE 5 TO some_number.
    DISPLAY some_number.
    MOVE -5 TO some_number.
    DISPLAY some_number.

    STOP RUN.
