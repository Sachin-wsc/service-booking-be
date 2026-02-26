import db from "../config/db.js";

const create = async (data) => {
  const [result] = await db.execute(
    "INSERT INTO attachments (booking_id,image_path) VALUES (?,?)",
    [data.booking_id, data.image_path]
  );
  return result.insertId;
};

const findByBooking = async (booking_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM attachments WHERE booking_id=?",
    [booking_id]
  );
  return rows;
};

export default { create, findByBooking };