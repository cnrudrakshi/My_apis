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
// list of all the courses
router.get("/", async (req, res) => {
  const connection = await createDataBaseConnection();
  // A simple SELECT query
  try {
    const [results] = await connection.query(
       'SELECT * FROM `courses`'
    );
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});

// particular id leke uski details dekhna
router.get("/:id", async (req, res) => {
  const courseId = req.params.id;
  if (courseId <= 0 || courseId >10) {
      return res.status(400).send("Invalid course ID format.");
    }

  const connection = await createDataBaseConnection();
   try {
    const [results] = await connection.query(
       'SELECT * FROM `courses` where `id` = ? ',
       [courseId]
    );
   
    res.send(results[0]);
  } catch (err) {
    console.log(err);
  }

});

//1. courses can't have duplicate names
//5. we need to add incremental id

    // ek new course add karna hai
router.post("/", async(req, res) => {
  const {course_name, fees, duration, end_day} = req.body;
   if (!course_name || !fees || !duration || !end_day) {
    return res.status(400).send("All fields (course_name, fees, duration, end_day) are required.");
  }
  if (course_name.length < 2) {
    return res.status(400).send("Course name must be at least 2 characters long.");
  }
  if (duration < 1) {
    return res.status(400).send("Course duration must be at least 1 month.");
  }
  const connection = await createDataBaseConnection();
  try {
    // ✅ Check duplicate from database
    const [existingCourse] = await connection.query(
      "SELECT * FROM courses WHERE course_name = ?",
      [course_name]
    );

    if (existingCourse.length > 0) {
      return res.status(409).send("Course already exists.");
    }

    const [results] = await connection.query(
       'INSERT INTO courses (course_name,fees, duration, end_day) VALUES (?,?,?,?)',
       [course_name, fees, duration, end_day]
    );
      res.send("course add sucessfully🤩");
  } catch (err) {
    console.log(err);
  }
});

// patch means partial update (only course name updatation)
router.patch("/:id", async(req, res) => {
  const courseId = req.params.id;
  const connection = await createDataBaseConnection();
  const{course_name} = req.body
    try {

    const [results] = await connection.query(
          "UPDATE courses SET course_name = ? WHERE id = ?",
       [course_name,courseId]
    );
      res.send("course name updated");
  } catch (err) {
    console.log(err);
  }

});

// put means ek id ko leke uski sari values update ho jae
router.put("/:id", async(req, res) => {
  const courseId = req.params.id;
  const connection = await createDataBaseConnection();
  const { course_name, fees, duration, end_day } = req.body;
  try {
    const [results] = await connection.query(
      "UPDATE courses SET course_name = ?, fees = ?, duration = ?, end_day = ? WHERE id = ?",
      [course_name, fees, duration, end_day, courseId]
    );

    res.send("course fully updated");
  } catch (err) {
    console.log(err);
  }

});
// direct id deke send
router.delete("/:id", async(req, res) => {
    const courseId = req.params.id;
    const connection = await createDataBaseConnection();
    try {
    const [results] = await connection.query(
      "DELETE FROM courses WHERE id = ?",
      [courseId]
    );

    res.send("course deleted successfully");
  } catch (err) {
    console.log(err);
    
  }
});

export default router;