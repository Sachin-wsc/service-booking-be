import db from "../config/db.js";

const create = async (data) => {
  try {
    const [result] = await db.execute(
      "INSERT INTO addresses (user_id, street, city, state, country, zip) VALUES (?,?,?,?,?,?)",
      [data.user_id, data.street, data.city, data.state, data.country, data.zip]
    );
    return result.insertId;
  } catch {
    throw new Error("Address creation failed");
  }
};

const findByUserId = async (user_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM addresses WHERE user_id=?",
    [user_id]
  );
  return rows;
};

export default { create, findByUserId };