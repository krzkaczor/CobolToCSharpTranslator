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

PROCEDURE DIVISION.
Begin.
    MOVE 123456 TO StudentId.
    MOVE "Krzys" TO Surname.
    MOVE "KK" TO Initials.
    MOVE "ABCD" TO CourseCode.
    MOVE "M" TO Gender.

    DISPLAY StudentDetails.
    MOVE "ver" TO VER.
    DISPLAY VER.
    DISPLAY StudentId.
    STOP RUN.
