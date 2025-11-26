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
       'SELECT * FROM `fees_installments`'
    );
     if (results.length === 0) {
      res.status(404).send("Feee installments data not available");
    }
    else{
     res.status(200).send(results);
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  const fee_InstrallmentsId = req.params.id;
    if (fee_InstrallmentsId <= 0) {
       res.status(400).send("Invalid fee_InstrallmentsId ID.");
    }
    if (isNaN(fee_InstrallmentsId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
  const connection = await createDataBaseConnection();
   try {
    const [results] = await connection.query(
       'SELECT * FROM `fees_installments` where `id` = ? ',
       [fee_InstrallmentsId]
    );
     if (results.length === 0) {
      res.status(404).send("Student not found");
    }
    res.send(results[0]);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async(req, res) => {
  const {amount, installment_no, pay_date} = req.body;
  if(!amount|| !installment_no|| !pay_date){
    res.status(400).send("All fields (amount, installment_no, pay_date) are required.")
  }
     if (isNaN(amount)) {
    return res.status(400).send("amount number must be numeric.");
  }
    if (amount<=0) {
    return res.status(400).send("amount number must be greater than zero");
  }
  if (isNaN(installment_no)) {
    return res.status(400).send("Student ID must be numeric.");
  }
  const connection = await createDataBaseConnection();
  try {
    const [results] = await connection.query(
       'INSERT INTO fees_installments (amount, installment_no, pay_date) VALUES (?,?,?)',
       [amount, installment_no, pay_date]
    );
      res.status(200).send("new installment added");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.patch("/:id", async(req, res) => {
  const fee_InstrallmentsId = req.params.id;
  if (fee_InstrallmentsId <= 0) {
       res.status(400).send("Invalid fee_InstrallmentsId ID.");
    }
    if (isNaN(fee_InstrallmentsId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
  const connection = await createDataBaseConnection();
  const{amount} = req.body;
  if(!amount){
    res.status(400).send("amount is required.")
  }
  if(isNaN(amount)){
     res.status(400).send("amount  must be a number");
  }
  if(amount<=0){
    res.status(422).send("amount must be greater than 0");
  }
   try {
    const [results] = await connection.query(
          "UPDATE fees_installments SET amount = ? WHERE id = ?",
       [amount,fee_InstrallmentsId]
    );
      res.status(200).send("amount updated");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }

});

router.put("/:id", async(req, res) => {
  const fee_InstrallmentsId = req.params.id;
  if (fee_InstrallmentsId <= 0) {
       res.status(400).send("Invalid fee_InstrallmentsId ID.");
    }
    if (isNaN(fee_InstrallmentsId)) {
    res.status(400).send("Invalid ID format — ID must be a number");
  }
  const connection = await createDataBaseConnection();
  const {amount, installment_no, pay_date} = req.body;

  if(!amount|| !installment_no|| !pay_date){
    res.status(422).send("All fields (amount, installment_no, pay_date) are required.")
  }
  if(isNaN(amount)){
     res.status(400).send("amount must be a number");
  }
   if(isNaN(installment_no)){
     res.status(400).send("inatallment must be a number");
  }
  if(amount<=0){
    res.status(422).send("amount — must be greater than 0");
  }
  try {
    const [results] = await connection.query(
      "UPDATE fees_installments SET amount = ?, installment_no = ?, pay_date = ? WHERE id = ?",
      [amount, installment_no, pay_date, fee_InstrallmentsId]
    );

    res.status(200).send("fees_Installments updated");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }

});

router.delete("/:id", async(req, res) => {
    const fee_InstrallmentsId = req.params.id;
     if (isNaN(fee_InstrallmentsId) || fee_InstrallmentsId <= 0) {
    res.status(400).send("Invalid ID format");
  }
    const connection = await createDataBaseConnection();
    try {
    const [results] = await connection.query(
      "DELETE FROM fees_installments WHERE id = ?",
      [fee_InstrallmentsId]
    );

    res.status(200).send("installment deleted successfully");
  } catch (err) {
    res.status(500).send("Internal Server Error");
    
  }
});


export default router;