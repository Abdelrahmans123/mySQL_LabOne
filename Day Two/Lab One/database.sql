CREATE DATABASE IF NOT EXISTS School;
USE School;
CREATE TABLE IF NOT EXISTS Students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Name VARCHAR(100) NOT NULL,
    Address VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS Student_Phone (
    StudentID INT,
    PhoneNumber VARCHAR(15),
    PRIMARY KEY (StudentID, PhoneNumber),
    FOREIGN KEY (StudentID) REFERENCES Students(id)
);
CREATE TABLE IF NOT EXISTS Subjects(
    id INT AUTO_INCREMENT PRIMARY KEY,
    SubjectName VARCHAR(100) NOT NULL UNIQUE,
    Description TEXT,
    MaxScore INT NOT NULL
);
CREATE TABLE IF NOT EXISTS Student_Subjects(
    StudentID INT,
    SubjectID INT,
    Score INT,
    PRIMARY KEY (StudentID, SubjectID),
    FOREIGN KEY (StudentID) REFERENCES Students(id),
    FOREIGN KEY (SubjectID) REFERENCES Subjects(id)
);
CREATE TABLE IF NOT EXISTS Exams(
    id INT AUTO_INCREMENT PRIMARY KEY,
    SubjectID INT,
    ExamDate DATE,
    Location VARCHAR(255),
    FOREIGN KEY (SubjectID) REFERENCES Subjects(id)
);
CREATE TABLE IF NOT EXISTS Student_Exams(
    StudentID INT,
    ExamID INT,
    Score INT,
    PRIMARY KEY (StudentID, ExamID),
    FOREIGN KEY (StudentID) REFERENCES Students(id),
    FOREIGN KEY (ExamID) REFERENCES Exams(id)
);
-- Insert Five Sample Students
-- INSERT INTO Students (Email, Name, Address) VALUES
-- ('student1@example.com', 'Student One', '123 Main St'),
-- ('student2@example.com', 'Student Two', '456 Elm St'),
-- ('student3@example.com', 'Student Three', '789 Oak St'),
-- ('student4@example.com', 'Student Four', '321 Pine St'),
-- ('student5@example.com', 'Student Five', '654 Maple St');
-- -- Insert Sample Phone Numbers for Students
-- INSERT INTO Student_Phone (StudentID, PhoneNumber) VALUES
-- (1, '555-1234'),
-- (1, '555-5678'),
-- (2, '555-8765'),
-- (3, '555-4321'),
-- (4, '555-6789'),
-- (5, '555-9876');
-- -- Insert Sample Subjects
-- INSERT INTO Subjects (SubjectName, Description, MaxScore) VALUES
-- ('Mathematics', 'Study of numbers and shapes', 100),
-- ('Science', 'Study of the natural world', 100),
-- ('History', 'Study of past events', 100),
-- ('Literature', 'Study of written works', 100),
-- ('Art', 'Study of visual arts', 100);
-- -- Enroll Students in Subjects with Initial Scores
-- INSERT INTO Student_Subjects (StudentID, SubjectID, Score) VALUES
-- (1, 1, 85),
-- (1, 2, 90),
-- (2, 1, 78),
-- (2, 3, 88), 
-- (3, 4, 92),
-- (4, 5, 80),
-- (5, 2, 75);
-- -- Insert Sample Exams
-- INSERT INTO Exams (SubjectID, ExamDate, Location) VALUES
-- (1, '2024-09-15', 'Room 101'),
-- (2, '2024-09-20', 'Room 102'),
-- (3, '2024-09-25', 'Room 103'),
-- (4, '2024-09-30', 'Room 104'),
-- (5, '2024-10-05', 'Room 105');
-- -- Record Student Exam Scores
-- INSERT INTO Student_Exams (StudentID, ExamID, Score) VALUES
-- (1, 1, 88),
-- (1, 2, 92),
-- (2, 1, 80),
-- (2, 3, 85),
-- (3, 4, 95),
-- (4, 5, 78),
-- (5, 2, 70); 
-- Query to retrieve all students with their subjects and scores
SELECT *
FROM Students;