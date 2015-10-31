IDENTIFICATION DIVISION.
PROGRAM-ID.  AcceptAndDisplay.

DATA DIVISION.
WORKING-STORAGE SECTION.
01 StudentDetails.
   02  StudentId       PIC 9(7).
   02  StudentName.
       03 Surname      PIC X(9).
       03 Initials     PIC XX.
   02  CourseCode      PIC X(4).
   02  Gender          PIC X.

PROCEDURE DIVISION.
Begin.
    ACCEPT StudentId.
    ACCEPT StudentName.
    ACCEPT CourseCode.
    ACCEPT Gender.
    DISPLAY StudentDetails.
    DISPLAY Surname.
    DISPLAY StudentId.
    STOP RUN.
