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
       'SELECT * FROM `attendance`'
    );
    if (results.length === 0) {
      res.status(404).send("No status available");
    }
    else{
     res.status(200).send(results);
    }  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  const attendanceId = req.params.id;
    if (attendanceId <= 0) {
      res.status(400).send("attendance with this Id not exist.");
    }
  if (isNaN(attendanceId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
  const connection = await createDataBaseConnection();
   try {
    const [results] = await connection.query(
       'SELECT * FROM `attendance` where `id` = ? ',
       [attendanceId]
    );
    if (results.length === 0) {
      res.status(404).send("Student not found");
    }
   res.status(200).send(results);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async(req, res) => {
  const {student_id, course_id, attendance_date, status} = req.body;
  if(!student_id || !course_id || !attendance_date || !status){
   res.send("All feilds student_id, course_id, attendance_date, status are required");
  }
  const connection = await createDataBaseConnection();
  try {
    const [results] = await connection.query(
       'INSERT INTO attendance (student_id, course_id, attendance_date, status) VALUES (?,?,?,?)',
       [student_id, course_id, attendance_date, status]
    );
      res.send("new attendance added");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});
router.patch("/:id", async(req, res) => {
  const attendanceId = req.params.id;
   if (attendanceId <= 0) {
      res.status(400).send("attendance with this Id not exist.");
    }
  if (isNaN(attendanceId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
  const connection = await createDataBaseConnection();
  const{status} = req.body
    try {
    const [results] = await connection.query(
          "UPDATE attendance SET status = ? WHERE id = ?",
       [status, attendanceId]
    );
      res.send("status updated");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }

});

router.put("/:id", async(req, res) => {
  const attendanceId = req.params.id;
   if (attendanceId <= 0) {
      res.status(400).send("attendance with this Id not exist.");
    }
  if (isNaN(attendanceId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
  const connection = await createDataBaseConnection();
  const {student_id, course_id, attendance_date, status} = req.body;
  try {
    const [results] = await connection.query(
      "UPDATE attendance SET student_id = ?, course_id = ?, attendance_date = ? , status=? WHERE id = ?",
      [student_id, course_id, attendance_date, status ,attendanceId]
    );

    res.send("attadance updated");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
  });
router.delete("/:id", async(req, res) => {
    const attendanceId = req.params.id;
     if (attendanceId <= 0) {
      res.status(400).send("attendance with this Id not exist.");
    }
  if (isNaN(attendanceId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
    const connection = await createDataBaseConnection();
    try {
    const [results] = await connection.query(
      "DELETE FROM attendance WHERE id = ?",
      [attendanceId]
    );

    res.status(200).send("attendance deleted successfully");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

export default router;