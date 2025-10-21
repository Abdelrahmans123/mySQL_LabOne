-- * 1.Add gender column for the student table. It holds two value (male or female).
ALTER TABLE Students
ADD gender ENUM('male', 'female') NOT NULL;
-- * 2.Add birth date column for the student table
ALTER TABLE Students
ADD birth_date DATE;
-- * 3.Delete the name column and replace it with two columns first name and last name
ALTER TABLE Students
DROP COLUMN name,
ADD firstName VARCHAR(50) NOT NULL,
ADD lastName VARCHAR(50) NOT NULL;
-- * 4.Delete the address and email column and replace it with contact info (Address, email) as object Data type.
ALTER TABLE Students
DROP COLUMN address,
DROP COLUMN email,
ADD contactInfo JSON NOT NULL;
-- * 5.Add foreign key constrains in Your Tables with options on delete cascaded .
ALTER TABLE Students
ADD CONSTRAINT fk_student_contactInfo FOREIGN KEY (id) REFERENCES Student_Phone(StudentID) ON DELETE CASCADE;
ALTER TABLE Student_Subjects
ADD CONSTRAINT fk_student_subjects FOREIGN KEY (StudentID) REFERENCES Students(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_subjects_student FOREIGN KEY (SubjectID) REFERENCES Subjects(id) ON DELETE CASCADE;
ALTER TABLE Student_Exams
ADD CONSTRAINT fk_student_exams FOREIGN KEY (StudentID) REFERENCES Students(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_exams_student FOREIGN KEY (ExamID) REFERENCES Exams(id) ON DELETE CASCADE;
-- * 6.Update your information by changing data for (gender, birthdate, first name, lastname, contact info).
UPDATE Students
SET gender = 'male',
    birth_date = '2000-01-01',
    firstName = 'John',
    lastName = 'Doe',
    contactInfo = JSON_OBJECT('email', 'john.doe@example.com', 'address', '123 Main St')
WHERE id = 1;
-- * 7.Display all students’ information.
SELECT * FROM Students;
-- * 8.Display male students only.
SELECT * FROM Students
WHERE gender = 'male';
-- * 9.Display the number of female students.
SELECT COUNT(*) AS FemaleStudentCount
FROM Students
WHERE gender = 'female';
-- * 10.Display the students who are born before 1992-10-01.
SELECT * FROM Students
WHERE birth_date < '1992-10-01';
-- * 11.Display male students who are born before 1991-10-01.
SELECT * FROM Students
WHERE gender = 'male' AND birth_date < '1991-10-01';
-- * 12.Display subjects and their max score sorted by max score.
SELECT SubjectName, MaxScore FROM Subjects
ORDER BY MaxScore;
-- * 13.Display the subject with highest max score
SELECT SubjectName, MaxScore FROM Subjects
ORDER BY MaxScore DESC
LIMIT 1;
-- * 14.Display students’ names that begin with A.
SELECT firstName, lastName FROM Students
WHERE firstName LIKE 'A%' OR lastName LIKE 'A%';
-- * 15.Display the number of students’ their name is “Mohammed”
SELECT COUNT(*) AS MohammedCount FROM Students
WHERE firstName = 'Mohammed' OR lastName = 'Mohammed';
-- * 16.Display the number of males and females.
SELECT gender, COUNT(*) AS Count FROM Students
GROUP BY gender;
-- * 17.Display the repeated first names and their counts if higher than 2.
SELECT firstName, COUNT(*) AS Count FROM Students
GROUP BY firstName
HAVING Count > 2;
-- * 18. Display students’ names, their score and subject name.
SELECT s.firstName, s.lastName, ss.Score, sub.SubjectName
FROM Students s
JOIN Student_Subjects ss ON s.id = ss.StudentID
JOIN Subjects sub ON ss.SubjectID = sub.id;
-- * 19.Delete students their score is lower than 50 in a particular subject exam
DELETE s
FROM Students s
JOIN Student_Subjects ss ON s.id = ss.StudentID
WHERE ss.Score < 50 AND ss.SubjectID = 1;