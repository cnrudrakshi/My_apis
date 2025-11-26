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
  // A simple SELECT query
  try {
    const [results] = await connection.query(
      "SELECT * FROM `courses`"
    );
    if (results.length === 0) {
      res.status(404).send("No courses available");
    }
    else{
       res.status(200).send(results);
    }
    
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});


router.get("/:id", async (req, res) => {
  const courseId = req.params.id;
  if (isNaN(courseId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
  if (courseId <= 0) {
    res.status(400).send("Invalid course ID, course id must be greater than 0");
  }
  const connection = await createDataBaseConnection();
  try {
    const [results] = await connection.query(
      "SELECT * FROM `courses` where `id` = ? ",
      [courseId]
    );
    if (results.length === 0) {
      res.status(404).send("Course not found");
    }
    res.status(200).send(results[0]);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});


router.post("/", async (req, res) => {
  const { course_name, fees, duration, end_day } = req.body;
  if (!course_name || !fees || !duration || !end_day) {
    res.status(400).send("All fields (course_name, fees, duration, end_day) are required.");
  }
  if (course_name.length < 2) {
    res.status(422).send("Course name must be at least 2 characters long");
  }
  if (isNaN(fees)) {
    res.status(400).send("Fees must be a numeric value");
  }
  if (duration < 1) {
    res.status(422).send("Course duration must be at least 1 month.");
  }
  const connection = await createDataBaseConnection();
  try {
    const [alreadyExist] = await connection.query(
      'SELECT *FROM courses WHERE `course_name` = ? ',
      [course_name]
    )
    if(alreadyExist.length>0){
      res.status(422).send("course already exists");
    }
    else{
       const [results] = await connection.query(
      "INSERT INTO courses (course_name,fees, duration, end_day) VALUES (?,?,?,?)",
      [course_name, fees, duration, end_day]
    );
     res.status(201).send("course add sucessfully🤩");
    }
  } catch (err) {
    res.status(500).send("Internal Server Error" );
  }
});


router.patch("/:id", async (req, res) => {
  const courseId = req.params.id;
  const { course_name } = req.body;
  if (isNaN(courseId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
  if (courseId <= 0) {
    res.status(422).send("Invalid ID — must be greater than 0");
  }
  if (!course_name) {
    res.status(400).send("course_name is required");
  }
  if (course_name.length < 2) {
    res.status(422).send("Course name must be at least 2 characters long");
  }
  const connection = await createDataBaseConnection();
  try {
    const [alreadyExist] = await connection.query(
      'SELECT *FROM courses WHERE `course_name` = ? ',
      [course_name]
    )
    if(alreadyExist.length> 0){
       res.status(422).send("course already exists");
    }
    else{
       const [results] = await connection.query(
      "UPDATE courses SET course_name = ? WHERE id = ?",
      [course_name, courseId]
    );  
  res.status(200).send("course name updated");
  }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});


router.put("/:id", async (req, res) => {
  const courseId = req.params.id;
  const connection = await createDataBaseConnection();
  const { course_name, fees, duration, end_day } = req.body;
  if (isNaN(courseId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
  if (courseId <= 0) {
     res.status(422).send("Invalid ID — must be greater than 0");
  }
  if (!course_name || !fees || !duration || !end_day) {
    res.status(422).send("All fields (course_name, fees, duration, end_day) are required.");
  }
  if (course_name.length < 2) {
    res.status(400).send("Course name must be at least 2 characters long.");
  }
  if (duration < 1) {
    res.status(422).send("Course duration must be at least 1 month.");
  }
  if (course_name.length < 2) {
     res.status(422).send("Course name must be at least 2 characters long");
  }
  if (isNaN(fees)) {
     res.status(400).send("Fees must be a numeric value");
  }
  try {
    const [alreadyExist] = await connection.query(
      'SELECT *FROM courses WHERE `course_name` = ? ',
      [course_name]
    )
    if(alreadyExist.length> 0){
       res.status(422).send("course already exists");
    }else{
      const [results] = await connection.query(
      "UPDATE courses SET course_name = ?, fees = ?, duration = ?, end_day = ? WHERE id = ?",
      [course_name, fees, duration, end_day, courseId]
    );
    res.status(200).send("course fully updated");
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  const courseId = req.params.id;
 if (isNaN(courseId) || courseId <= 0) {
  return res.status(400).send("Invalid course ID — must be a positive number");
 }
  const connection = await createDataBaseConnection();
  try {
    const [results] = await connection.query(
      "DELETE FROM courses WHERE id = ?",
      [courseId]
    );

     res.status(200).send("Course deleted successfully");
  } catch (err) {
    res.status(500).send("Internal Server Error");
    
  }
});

export default router;
