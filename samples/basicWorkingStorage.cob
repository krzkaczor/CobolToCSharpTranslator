IDENTIFICATION DIVISION.
PROGRAM-ID.  AcceptAndDisplay.

DATA DIVISION.
WORKING-STORAGE SECTION.
01 StudentDetails.
   02  StudentId       PIC 9(7).
   02  StudentName.
       03 Surname      PIC X(8).
       03 Initials     PIC XX.
   02  CourseCode      PIC X(4).
   02  Gender          PIC X.

PROCEDURE DIVISION.
Begin.
    MOVE 123456 TO StudentId.
    MOVE "Krzys" TO Surname.
    MOVE "KK" TO Initials.
    MOVE "ABCD" TO CourseCode.
    MOVE "M" TO Gender.
    DISPLAY StudentDetails.
    STOP RUN.
