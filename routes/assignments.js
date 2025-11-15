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

// list of all the assignments
router.get("/", async (req, res) => {
  const connection = await createDataBaseConnection();
  // A simple SELECT query
  try {
    const [results] = await connection.query(
       'SELECT * FROM `assignments`'
    );
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  const assignmentsId = req.params.id;
  if(assignmentsId<=0){
    res.send("Invalid assignmet id.")
  }
  const connection = await createDataBaseConnection();
   try {
    const [results] = await connection.query(
       'SELECT * FROM `assignments` where `id` = ? ',
       [assignmentsId]
    );
    res.send(results[0]);
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async(req, res) => {
  const {title, assignment_no, due_date, submit_date, student_id,course_id } = req.body;
  if(!title || !assignment_no || !due_date || !submit_date || !student_id || !course_id ){
    return res.status(400).send("All fields (title, assignment_no, due_date, submit_date, student_id,course_id) are required.");
  }
   if (title.length <2 ) {
     res.send("title must be at least 4 characters long.");
  }
  const connection = await createDataBaseConnection();
  try {
    const [results] = await connection.query(
       'INSERT INTO assignments (title, assignment_no, due_date, submit_date, student_id, course_id ) VALUES (?,?,?,?,?,?)',
       [title, assignment_no, due_date, submit_date, student_id, course_id ]
    );
    res.send("new assignment added");
  }   catch (err) {
    console.log(err);
  }
});

router.patch("/:id", async (req, res) => {
  const assignmentsId = req.params.id;
  const connection = await createDataBaseConnection();
  const { title } = req.body;

  try {
    const [results] = await connection.query(
      "UPDATE assignments SET title = ? WHERE id = ?",
      [title, assignmentsId]
    );

    res.send("assignment title updated");
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", async(req, res) => {
  const assignmentsId = req.params.id;
  const connection = await createDataBaseConnection();
  const { title, assignment_no, due_date, submit_date } = req.body;

  try {
    const [results] = await connection.query(
      "UPDATE assignments SET title = ?, assignment_no = ?, due_date = ?, submit_date = ? WHERE id = ?",
      [title, assignment_no, due_date, submit_date, assignmentsId]
    );

    res.send("assignment fully updated");
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async(req, res) => {
    const assignmentsId = req.params.id;
    const connection = await createDataBaseConnection();
    try {
    const [results] = await connection.query(
      "DELETE FROM assignments WHERE id = ?",
      [assignmentsId]
    );

    res.send("assignment deleted successfully");
  } catch (err) {
    console.log(err);
    
  }
});
export default router;