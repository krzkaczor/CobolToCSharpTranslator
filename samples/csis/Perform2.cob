      $ SET SOURCEFORMAT"FREE"
IDENTIFICATION DIVISION.
PROGRAM-ID.  PerformFormat2.
AUTHOR.  Michael Coughlan.
* Demonstrates the second format of the PERFORM.
* The PERFORM..TIMES format executes a block of code x
* number of times.

DATA DIVISION.
WORKING-STORAGE SECTION.
01 NumofTimes           PIC 9 VALUE 5.

PROCEDURE DIVISION.
Begin.
    DISPLAY "Starting to run program"
    PERFORM 3 TIMES
       DISPLAY ">>>>This is an in line Perform"
    END-PERFORM
    DISPLAY "Finished in line Perform"
    PERFORM OutOfLineEG NumOfTimes TIMES
    DISPLAY "Back in Begin. About to Stop".
    STOP RUN.

OutOfLineEG.
    DISPLAY ">>>> This is an out of line Perform".