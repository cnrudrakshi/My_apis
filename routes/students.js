import express from "express";
import mysql from "mysql2/promise";
const router = express.Router();

// creating connections to database
async function createDataBaseConnection() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "myapis",
  });
  return connection;
}
// list of all the students
router.get("/", async (req, res) => {
  const connection = await createDataBaseConnection();
  // A simple SELECT query
  try {
    const [results] = await connection.query(
       'SELECT * FROM `students`'
    );
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});

// particular id leke uski details dekhna
router.get("/:id", async (req, res) => {
  const courseId = req.params.id;
  const connection = await createDataBaseConnection();
   try {
    const [results] = await connection.query(
       'SELECT * FROM `students` where `id` = ? ',
       [courseId]
    );
    res.send(results[0]);
  } catch (err) {
    console.log(err);
  }
});

// ek new student add karna hai
router.post("/", async(req, res) => {
  const {first_name, last_name, email_address, date_of_birth, enrollment_date} = req.body;
  const connection = await createDataBaseConnection();
  try {
    const [results] = await connection.query(
       'INSERT INTO students (first_name, last_name, email_address, date_of_birth, enrollment_date) VALUES (?,?,?,?,?)',
       [first_name, last_name, email_address, date_of_birth, enrollment_date]
    );
      res.send("student added");
  } catch (err) {
    console.log(err);
  }
});

router.patch("/:id", async(req, res) => {
  const studentId = req.params.id;
  const connection = await createDataBaseConnection();
  const{first_name} = req.body
    try {
    const [results] = await connection.query(
          "UPDATE students SET first_name = ? WHERE id = ?",
       [first_name,studentId]
    );
      res.send("student name updated");
  } catch (err) {
    console.log(err);
  }

});


router.put("/:id", async(req, res) => {
  const  studentId = req.params.id;
  const connection = await createDataBaseConnection();
  const { first_name, last_name, email_address, date_of_birth, enrollment_date} = req.body;
  try {
    const [results] = await connection.query(
      "UPDATE students SET first_name = ?, last_name = ?, email_address = ?,date_of_birth  = ?,enrollment_date = ?  WHERE id = ?",
      [first_name, last_name, email_address, date_of_birth, enrollment_date, studentId]
    );

    res.send("student fully updated");
  } catch (err) {
    console.log(err);
  }

});
// direct id deke send
router.delete("/:id", async(req, res) => {
    const  studentId = req.params.id;
    const connection = await createDataBaseConnection();
    try {
    const [results] = await connection.query(
      "DELETE FROM students WHERE id = ?",
      [ studentId]
    );

    res.send("student deleted successfully");
  } catch (err) {
    console.log(err);
    
  }
});


export default router;