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
       'SELECT * FROM `roles`'
    );
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  const studentRolesId= req.params.id;
  const connection = await createDataBaseConnection();
   try {
    const [results] = await connection.query(
       'SELECT * FROM `roles` where `id` = ? ',
       [studentRolesId]
    );
    res.send(results[0]);
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async(req, res) => {
  const {role_name, description, student_id} = req.body;
  const connection = await createDataBaseConnection();
  try {
    const [results] = await connection.query(
       'INSERT INTO roles (role_name, description, student_id) VALUES (?,?,?)',
       [role_name, description, student_id]
    );
      res.send("new role added");
  } catch (err) {
    console.log(err);
  }
});

router.patch("/:id", async(req, res) => {
  const studentRolesId= req.params.id;
  const connection = await createDataBaseConnection();
  const{role_name} = req.body
    try {
    const [results] = await connection.query(
          "UPDATE roles SET role_name = ? WHERE id = ?",
       [role_name,studentRolesId]
    );
      res.send("student role updated");
  } catch (err) {
    console.log(err);
  }

});

router.put("/:id", async(req, res) => {
  const studentRolesId= req.params.id;
  const connection = await createDataBaseConnection();
  const {role_name, description, student_id} = req.body;
  try {
    const [results] = await connection.query(
      "UPDATE roles SET role_name = ?, description = ?, student_id = ? WHERE id = ?",
      [role_name, description, student_id, studentRolesId]
    );

    res.send("student role updated");
  } catch (err) {
    console.log(err);
  }
});


router.delete("/:id", async(req, res) => {
    const studentRolesId= req.params.id;
    const connection = await createDataBaseConnection();
    try {
    const [results] = await connection.query(
      "DELETE FROM roles WHERE id = ?",
      [studentRolesId]
    );

    res.send("role deleted successfully");
  } catch (err) {
    console.log(err);
    
  }
});
export default router;