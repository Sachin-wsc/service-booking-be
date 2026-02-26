import db from "../config/db.js";

const create = async (booking_id, amount) => {
  const [result] = await db.execute(
    "INSERT INTO invoice (booking_id,amount,status) VALUES (?,?,?)",
    [booking_id, amount, "unpaid"]
  );
  return result.insertId;
};

const markPaid = async (booking_id) => {
  await db.execute(
    "UPDATE invoice SET status='paid' WHERE booking_id=?",
    [booking_id]
  );
};

const findByBooking = async (booking_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM invoice WHERE booking_id=?",
    [booking_id]
  );
  return rows[0];
};

export default { create, markPaid, findByBooking };