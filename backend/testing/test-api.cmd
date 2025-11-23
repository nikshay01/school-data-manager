@echo off
echo ================================
echo     SCHOOL DATA MANAGER API TEST
echo ================================
echo.

REM ---------- AUTH TESTS ----------
echo ==== 1. SIGNUP ====
curl -X POST http://localhost:5000/api/auth/signup ^
 -H "Content-Type: application/json" ^
 -d "{\"email\":\"testuser1@gmail.com\",\"password\":\"123456\"}"
echo.

echo ==== 2. LOGIN ====
curl -X POST http://localhost:5000/api/auth/login ^
 -H "Content-Type: application/json" ^
 -d "{\"email\":\"testuser1@gmail.com\",\"password\":\"123456\"}"
echo.


REM ---------- STUDENT TESTS ----------
echo ==== 3. ADD NEW STUDENT ====
curl -X POST http://localhost:5000/api/students ^
 -H "Content-Type: application/json" ^
 -d "{\"studentName\":\"Test Student\",\"fatherName\":\"Test Father\",\"class\":\"5\",\"section\":\"A\",\"srNo\":\"55\",\"contact\":9876543210}"
echo.


echo ==== 4. GET ALL STUDENTS (class = 0) ====
curl http://localhost:5000/api/students/0
echo.


echo ==== 5. GET STUDENTS OF CLASS 5 ====
curl http://localhost:5000/api/students/5
echo.


echo ==== 6. SEARCH BY SRNO ====
curl "http://localhost:5000/api/students/update?query=2003"
echo.


REM NOTE: Replace the ID below after creating a student
SET STUDENT_ID=68e742b92be10122f280601a

echo ==== 7. GET SINGLE STUDENT BY ID ====
curl http://localhost:5000/api/students/singlestudent/68e742b92be10122f280601a
echo.


echo ==== 8. UPDATE STUDENT ====
curl -X PUT http://localhost:5000/api/students/singlestudent/68e742b92be10122f280601a ^
 -H "Content-Type: application/json" ^
 -d "{\"fatherName\":\"Updated Father\",\"leftSchool\":false}"
echo.


@REM echo ==== 9. DELETE STUDENT ====
@REM curl -X DELETE http://localhost:5000/api/students/singlestudent/68e742b92be10122f280601a
@REM echo.


REM ---------- DELETE PASSWORD VERIFY ----------
echo ==== 10. DELETE PASSWORD CHECK (123321 is correct) ====
curl http://localhost:5000/api/dlpass/123321
echo.

echo ==== 11. DELETE PASSWORD CHECK (wrong) ====
curl http://localhost:5000/api/dlpass/999
echo.

echo ================================
echo        TESTING COMPLETE
echo ================================
pause
