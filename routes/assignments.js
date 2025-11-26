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
       'SELECT * FROM `assignments`'
    );
    if (results.length === 0) {
      res.status(404).send("No assignments available");
    }
    else{
     res.status(200).send(results);
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  const assignmentsId = req.params.id;
    if (assignmentsId <= 0) {
      res.status(400).send("assignment with this Id not exist.");
    }
  if (isNaN(assignmentsId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
  const connection = await createDataBaseConnection();
   try {
    const [results] = await connection.query(
       'SELECT * FROM `assignments` where `id` = ? ',
       [assignmentsId]
    );
     if (results.length === 0) {
      res.status(404).send("assignment not found");
    }
    res.status(200).send(results[0]);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async(req, res) => {
  const {title, assignment_no, due_date, submit_date, student_id,course_id } = req.body;
  if(!title || !assignment_no || !due_date || !submit_date || !student_id || !course_id ){
   res.status(400).send("All fields (title, assignment_no, due_date, submit_date, student_id,course_id) are required.");
  }
   if (title.length <2 ) {
     res.send("title must be at least 4 characters long.");
  }
   if (isNaN(assignment_no)) {
    return res.status(400).send("Assignment number must be numeric.");
  }
  if (isNaN(student_id)) {
    return res.status(400).send("Student ID must be numeric.");
  }
  if (isNaN(course_id)) {
    return res.status(400).send("Course ID must be numeric.");
  }
  const connection = await createDataBaseConnection();
  try {
    const [alreadyExist] = await connection.query(
      'SELECT *FROM assignments WHERE `title` = ? ',
      [title]
    )
    if(alreadyExist.length>0){
      res.status(422).send("assignment already exists");
    }
    else{
  const [results] = await connection.query(
       'INSERT INTO assignments (title, assignment_no, due_date, submit_date, student_id, course_id ) VALUES (?,?,?,?,?,?)',
       [title, assignment_no, due_date, submit_date, student_id, course_id ]
    );
     res.status(201).send("new assignment added");
    }
  }   catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.patch("/:id", async (req, res) => {
  const assignmentsId = req.params.id;
    if (assignmentsId <= 0) {
      res.status(400).send("assignment with this Id not exist.");
    }
  if (isNaN(assignmentsId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
  const connection = await createDataBaseConnection();
  const { title } = req.body;
   if (!title) {
    res.status(400).send("assignment title is required");
  }
  if (title.length < 2) {
    res.status(422).send("assignment title must be at least 2 characters long");
  }
  try {
    const [alreadyExist] = await connection.query(
      'SELECT *FROM assignments WHERE `title` = ? ',
      [title]
    )
    if(alreadyExist.length>0){
      res.status(422).send("assignment already exists");
    }
    else{
 const [results] = await connection.query(
      "UPDATE assignments SET title = ? WHERE id = ?",
      [title, assignmentsId]
    );
 res.status(200).send("assignment title updated");
    }   
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.put("/:id", async(req, res) => {
  const assignmentsId = req.params.id;
    if (assignmentsId <= 0) {
      res.status(400).send("assignment with this Id not exist.");
    }
  if (isNaN(assignmentsId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
  const connection = await createDataBaseConnection();
  const { title, assignment_no, due_date, submit_date, student_id, course_id } = req.body;
  if(!title || !assignment_no || !due_date || !submit_date || !student_id || !course_id ){
   res.status(400).send("All fields (title, assignment_no, due_date, submit_date, student_id, course_id) are required.");
  }
   if (title.length <2 ) {
     res.send("title must be at least 4 characters long.");
  }
   if (isNaN(assignment_no)) {
    return res.status(400).send("Assignment number must be numeric.");
  }
  if (isNaN(student_id)) {
    return res.status(400).send("Student ID must be numeric.");
  }
  if (isNaN(course_id)) {
    return res.status(400).send("Course ID must be numeric.");
  }
  try {
     const [alreadyExist] = await connection.query(
      'SELECT *FROM assignments WHERE `title` = ? ',
      [title]
    )
    if(alreadyExist.length>0){
      res.status(422).send("assignment already exists");
    }else{
      const [results] = await connection.query(
      "UPDATE assignments SET title = ?, assignment_no = ?, due_date = ?, submit_date = ?, student_id = ?, course_id = ?  WHERE id = ?",
      [title, assignment_no, due_date, submit_date,student_id,course_id, assignmentsId]
    );
res.status(200).send("assignment fully updated");
    }  
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", async(req, res) => {
    const assignmentsId = req.params.id;
      if (assignmentsId <= 0) {
      res.status(400).send("assignment with this Id not exist.");
    }
  if (isNaN(assignmentsId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
    const connection = await createDataBaseConnection();
    try {
    const [results] = await connection.query(
      "DELETE FROM assignments WHERE id = ?",
      [assignmentsId]
    );

    res.status(200).send("assignment deleted successfully");
  } catch (err) {
    res.status(500).send("Internal Server Error");
    
  }
});
export default router;