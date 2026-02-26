import db from "../config/db.js";

const create = async (data) => {
  const [result] = await db.execute(
    "INSERT INTO bookings (user_id,service_id,date,time,status) VALUES (?,?,?,?,?)",
    [
      data.user_id,
      data.service_id,
      data.date,
      data.time,
      "pending"
    ]
  );
  return result.insertId;
};

const updateStatus = async (id, status) => {
  await db.execute(
    "UPDATE bookings SET status=? WHERE id=?",
    [status, id]
  );
};

const findByUser = async (user_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM bookings WHERE user_id=?",
    [user_id]
  );
  return rows;
};

export default { create, updateStatus, findByUser };