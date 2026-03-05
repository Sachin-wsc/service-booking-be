import db from "../config/db.js";

const create = async (data) => {
  try {
    const { user_id, Buisness_name, description, created_by } = data;
    const [result] = await db.execute(
      "INSERT INTO provider (user_id,Buisness_name,description,status,created_by) VALUES (?,?,?,?,?)",
      [user_id, Buisness_name || null, description || null, "pending", created_by || null]
    );
    return result.insertId;
  } catch (err) {
    throw new Error("Provider creation failed");
  }
};

const approve = async (id, approvedBy) => {
  await db.execute(
    "UPDATE provider SET status='approved',  updated_by = ? WHERE id=?",
    [approvedBy || null, id]
  );
};

const findAll = async () => {
  const [rows] = await db.execute(
    `SELECT p.*, u.name as user_name, u.email as user_email, u.phone as user_phone
     FROM provider p
     JOIN users u ON p.user_id = u.id`
  );
  return rows;
};

export default { create, approve, findAll };