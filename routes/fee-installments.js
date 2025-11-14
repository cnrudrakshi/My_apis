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
       'SELECT * FROM `fees_installments`'
    );
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  const fee_InstrallmentsId = req.params.id;
  const connection = await createDataBaseConnection();
   try {
    const [results] = await connection.query(
       'SELECT * FROM `fees_installments` where `id` = ? ',
       [fee_InstrallmentsId]
    );
    res.send(results[0]);
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async(req, res) => {
  const {amount, installment_no, pay_date} = req.body;
  const connection = await createDataBaseConnection();
  try {
    const [results] = await connection.query(
       'INSERT INTO fees_installments (amount, installment_no, pay_date) VALUES (?,?,?)',
       [amount, installment_no, pay_date]
    );
      res.send("new installment added");
  } catch (err) {
    console.log(err);
  }
});

router.patch("/:id", async(req, res) => {
  const fee_InstrallmentsId = req.params.id;
  const connection = await createDataBaseConnection();
  const{amount} = req.body
    try {
    const [results] = await connection.query(
          "UPDATE fees_installments SET amount = ? WHERE id = ?",
       [amount,fee_InstrallmentsId]
    );
      res.send("amount updated");
  } catch (err) {
    console.log(err);
  }

});

router.put("/:id", async(req, res) => {
  const fee_InstrallmentsId = req.params.id;
  const connection = await createDataBaseConnection();
  const {amount, installment_no, pay_date} = req.body;
  try {
    const [results] = await connection.query(
      "UPDATE fees_installments SET amount = ?, installment_no = ?, pay_date = ? WHERE id = ?",
      [amount, installment_no, pay_date, fee_InstrallmentsId]
    );

    res.send("fees_Installments updated");
  } catch (err) {
    console.log(err);
  }

});

router.delete("/:id", async(req, res) => {
    const fee_InstrallmentsId = req.params.id;
    const connection = await createDataBaseConnection();
    try {
    const [results] = await connection.query(
      "DELETE FROM fees_installments WHERE id = ?",
      [fee_InstrallmentsId]
    );

    res.send("installment deleted successfully");
  } catch (err) {
    console.log(err);
    
  }
});


export default router;