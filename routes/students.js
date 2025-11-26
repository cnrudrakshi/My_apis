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

router.get("/", async (req, res) => {
  const connection = await createDataBaseConnection();
  try {
    const [results] = await connection.query(
       'SELECT * FROM `students`'
    );
     if (results.length === 0) {
      res.status(404).send("No student available");
    }
    else{
     res.status(200).send(results);
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  const studentId = req.params.id;
  if (studentId <= 0) {
      res.status(400).send("Student with this Id not exist.");
    }
  if (isNaN(studentId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
  const connection = await createDataBaseConnection();
   try {
    const [results] = await connection.query(
       'SELECT * FROM `students` where `id` = ? ',
       [studentId]
    );
     if (results.length === 0) {
      res.status(404).send("Student not found");
    }
    res.status(200).send(results[0]);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async(req, res) => {
  const {first_name, last_name, email_address, date_of_birth, enrollment_date} = req.body;
    if(!first_name|| !last_name|| !email_address || !date_of_birth || !enrollment_date){
    res.status(400).send("All fields (first_name, last_name, email_address, date_of_birth, enrollment_date) are required.")
  }
  if (first_name.length < 2 || last_name.length<2) {
    res.status(422).send("student name must be at least 2 characters long.");
  }
  if (!email_address.includes("@gmail.com")) {
  res.status(400).send("Email is not formated.");
}
const connection = await createDataBaseConnection();
  try {
    
    const [results] = await connection.query(
       'INSERT INTO students (first_name, last_name, email_address, date_of_birth, enrollment_date) VALUES (?,?,?,?,?)',
       [first_name, last_name, email_address, date_of_birth, enrollment_date]
    );
       res.status(201).send("student added");
  } catch (err) {
    res.status(500).send("Internal Server Error" );
  }
});

router.patch("/:id", async(req, res) => {
  const studentId = req.params.id;
 const{first_name} = req.body;
 if (isNaN(studentId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
  if (studentId <= 0) {
    res.status(422).send("Invalid ID — must be greater than 0");
  }
  if(!first_name){
    res.status(400).send("first name is required.");
  }
  if(first_name.length < 2){
    res.status(422).send("student name must be at least 2 characters long.");
  }
  const connection = await createDataBaseConnection();
    try {
    const [results] = await connection.query(
          "UPDATE students SET first_name = ? WHERE id = ?",
       [first_name,studentId]
    );
      res.status(200).send("student name updated");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }

});


router.put("/:id", async(req, res) => {
  const  studentId = req.params.id;
  const connection = await createDataBaseConnection();
  if (isNaN(studentId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
  if (studentId <= 0) {
    res.status(422).send("Invalid ID — must be greater than 0");
  }
  const { first_name, last_name, email_address, date_of_birth, enrollment_date} = req.body;
   if(!first_name|| !last_name|| !email_address || !date_of_birth || !enrollment_date){
    res.status(422).send("All fields (first_name, last_name, email_address, date_of_birth, enrollment_date) are required.")
  }
  if (first_name.length < 2 || last_name.length<2) {
    res.status(400).send("student name must be at least 2 characters long.");
  }
   if (!email_address.includes("@gmail.com")) {
  res.status(400).send("Email is not formated.");
}
  try {
    const [results] = await connection.query(
      "UPDATE students SET first_name = ?, last_name = ?, email_address = ?,date_of_birth  = ?,enrollment_date = ?  WHERE id = ?",
      [first_name, last_name, email_address, date_of_birth, enrollment_date, studentId]
    );

    res.status(200).send("student fully updated");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }

});

router.delete("/:id", async(req, res) => {
    const  studentId = req.params.id;
    if (isNaN(studentId) || studentId <= 0) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
    const connection = await createDataBaseConnection();
    try {
    const [results] = await connection.query(
      "DELETE FROM students WHERE id = ?",
      [ studentId]
    );

    res.status(200).send("student deleted successfully");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

export default router;