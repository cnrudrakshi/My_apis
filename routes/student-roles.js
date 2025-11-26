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
       'SELECT * FROM `roles`'
    );
     if (results.length === 0) {
      res.status(404).send("No student Role available");
    }
    else{
      res.status(200).send(results);
    }

  } catch (err) {
     res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  const studentRolesId= req.params.id;
  if(studentRolesId <=0){
   res.status(400).send("Invalid role ID.");
  }
   if (isNaN(studentRolesId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
  const connection = await createDataBaseConnection();
   try {
    const [results] = await connection.query(
       'SELECT * FROM `roles` where `id` = ? ',
       [studentRolesId]
    );
     if (results.length === 0) {
      res.status(404).send("No student Role data available");
    }
    res.status(200).send(results[0]);
  } catch (err) {
     res.status(500).send("Internal Server Error");
  }
});

router.post("/", async(req, res) => {
  const {role_name, description, student_id} = req.body;
    if(!role_name|| !description|| !student_id){
    res.send("All fields (role_name, description, student_id) are required.")
  }
  if (role_name.length < 2 ) {
     res.status(422).send("role must be at least 2 characters long.");
  }
  if (description.length <2) {
     res.status(422).send("description must be at least 2 characters long.");
  }
  if (isNaN(student_id)) {
    res.status(400).send("student id must be a numeric value");
  }
  const connection = await createDataBaseConnection();
  try {
    const [alreadyExist] = await connection.query(
      'SELECT *FROM roles WHERE `role_name` = ? ',
      [role_name]
    )
    if(alreadyExist.length>0){
      res.status(422).send("role already exists you need to add unique course");
    }
    else{
 const [results] = await connection.query(
       'INSERT INTO roles (role_name, description, student_id) VALUES (?,?,?)',
       [role_name, description, student_id]
    );
   res.status(201).send("new role added");
    }
  } catch (err) {
     res.status(500).send("Internal Server Error");
  }
});

router.patch("/:id", async(req, res) => {
  const studentRolesId= req.params.id;
  const{role_name} = req.body;
   if(studentRolesId <=0){
   res.status(400).send("Invalid role ID.");
  }
   if (isNaN(studentRolesId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
   if(!role_name){
    res.status(400).send("role is required.");
  }
  if(role_name.length < 2){
    res.status(422).send("role must be at least 2 characters long.");
  }
  if (isNaN(student_id)) {
    res.status(400).send("student id must be a numeric value");
  }
  const connection = await createDataBaseConnection();
    try {
      const [alreadyExist] = await connection.query(
      'SELECT *FROM roles WHERE `role_name` = ? ',
      [role_name]
    )
    if(alreadyExist.length>0){
      res.status(422).send("role already exists you need to add unique course");
    }
    else{
  const [results] = await connection.query(
          "UPDATE roles SET role_name = ? WHERE id = ?",
       [role_name,studentRolesId]
    );
  res.status(200).send("student role updated");
    }
  } catch (err) {
     res.status(500).send("Internal Server Error");
  }

});

router.put("/:id", async(req, res) => {
  const studentRolesId= req.params.id;
   if(studentRolesId <=0){
   res.status(400).send("Invalid role ID.");
  }
   if (isNaN(studentRolesId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
    const {role_name, description, student_id} = req.body;
    if(!role_name|| !description|| !student_id){
    res.status(422).send("All fields (role_name, description, student_id) are required.")
  }
  if (role_name.length < 2 || description.length <2) {
     res.status(400).send(" Field Must be at least 2 characters long.");
  }
  if (isNaN(student_id)) {
    res.status(400).send("student id must be a numeric value");
  }
  const connection = await createDataBaseConnection();
  try {
    const [results] = await connection.query(
      "UPDATE roles SET role_name = ?, description = ?, student_id = ? WHERE id = ?",
      [role_name, description, student_id, studentRolesId]
    );

    res.status(200).send("student role updated");
  } catch (err) {
     res.status(500).send("Internal Server Error");
  }
});


router.delete("/:id", async(req, res) => {
    const studentRolesId= req.params.id;
    if (isNaN(studentRolesId) || studentRolesId <= 0) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
 const connection = await createDataBaseConnection();
    try {
    const [results] = await connection.query(
      "DELETE FROM roles WHERE id = ?",
      [studentRolesId]
    );

    res.status(200).send("role deleted successfully");
  } catch (err) {
     res.status(500).send("Internal Server Error");
    
  }
});
export default router;