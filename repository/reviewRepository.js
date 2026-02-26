import db from "../config/db.js";

const create = async (data) => {
  const [result] = await db.execute(
    "INSERT INTO reviews (booking_id,user_id,rating,comment) VALUES (?,?,?,?)",
    [
      data.booking_id,
      data.user_id,
      data.rating,
      data.comment
    ]
  );
  return result.insertId;
};

const findByService = async (service_id) => {
  const [rows] = await db.execute(
    `SELECT r.* 
     FROM reviews r
     JOIN bookings b ON r.booking_id=b.id
     WHERE b.service_id=?`,
    [service_id]
  );
  return rows;
};

export default { create, findByService };