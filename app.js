import express from "express";
import coursesRouter from './routes/courses.js';
import studentsRouter from './routes/students.js';
import assignmentsRouter from './routes/assignments.js';
import feesInstallmentsRouter from './routes/fee-installments.js';
import studentsRoleRouter from './routes/student-roles.js';
import attendanceRouter from'./routes/attendance.js';

const app = express();
app.use(express.json()); //body me data lene ke lie hota hai

app.use('/courses',coursesRouter);
app.use('/students',studentsRouter);
app.use('/assignments',assignmentsRouter);
app.use('/fee-installments', feesInstallmentsRouter);
app.use('/student_roles', studentsRoleRouter);
app.use('/attendance', attendanceRouter);


const PORT = 5354;
app.listen(PORT, () => {
  console.log('Server started at ${PORT}');
});


/*
1. courses 
2.students
3. assignments
4. roles
5. fees
6. attendance
Main express app hoon, body json samajhta hoon, 
mere paas courses aur students ke alag-alag routes hain. 
Jab koi bhi user /courses ya /students hit kare,
 to unka kaam unke router files se handle ho jaayega. 
 Aur main 5354 port par chal raha hoon. 
 */
