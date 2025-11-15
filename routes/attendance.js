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
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  const attendanceId = req.params.id;
  const connection = await createDataBaseConnection();
   try {
    const [results] = await connection.query(
       'SELECT * FROM `attendance` where `id` = ? ',
       [attendanceId]
    );
    res.send(results[0]);
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async(req, res) => {
  const {student_id, course_id, attendance_date, status} = req.body;
  if(!student_id || !course_id || !attendance_date || !status){
    return res.send("All feilds student_id, course_id, attendance_date, status are required");
  }
  const connection = await createDataBaseConnection();
  try {
    const [results] = await connection.query(
       'INSERT INTO attendance (student_id, course_id, attendance_date, status) VALUES (?,?,?,?)',
       [student_id, course_id, attendance_date, status]
    );
      res.send("new attendance added");
  } catch (err) {
    console.log(err);
  }
});
router.patch("/:id", async(req, res) => {
  const attendanceId = req.params.id;
  const connection = await createDataBaseConnection();
  const{status} = req.body
    try {
    const [results] = await connection.query(
          "UPDATE attendance SET status = ? WHERE id = ?",
       [status, attendanceId]
    );
      res.send("status updated");
  } catch (err) {
    console.log(err);
  }

});

router.put("/:id", async(req, res) => {
  const attendanceId = req.params.id;
  const connection = await createDataBaseConnection();
  const {student_id, course_id, attendance_date, status} = req.body;
  try {
    const [results] = await connection.query(
      "UPDATE attendance SET student_id = ?, course_id = ?, attendance_date = ? , status=? WHERE id = ?",
      [student_id, course_id, attendance_date, status ,attendanceId]
    );

    res.send("attadance updated");
  } catch (err) {
    console.log(err);
  }
  });
router.delete("/:id", async(req, res) => {
    const attendanceId = req.params.id;
    const connection = await createDataBaseConnection();
    try {
    const [results] = await connection.query(
      "DELETE FROM attendance WHERE id = ?",
      [attendanceId]
    );

    res.send("attendance deleted successfully");
  } catch (err) {
    console.log(err);
    
  }
});

export default router;