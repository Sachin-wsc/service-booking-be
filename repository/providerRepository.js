import db from "../config/db.js";

const create = async (data) => {
  try {
    const { user_id, Buisness_name, description, category_id, created_by } = data;
    const [result] = await db.execute(
      "INSERT INTO provider (user_id,Buisness_name,description,category_id,status,created_by) VALUES (?,?,?,?,?,?)",
      [user_id, Buisness_name || null, description || null, category_id, "pending", created_by || null]
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
    `SELECT p.*, u.name as user_name, u.email as user_email, u.phone as user_phone, c.name as category_name
     FROM provider p
     JOIN users u ON p.user_id = u.id
     JOIN categories c ON p.category_id = c.id`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT p.*, u.name as user_name, u.email as user_email, c.name as category_name
     FROM provider p
     JOIN users u ON p.user_id = u.id
     JOIN categories c ON p.category_id = c.id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0];
};

const findByUserId = async (user_id) => {
  const [rows] = await db.execute(
    `SELECT p.*, c.name as category_name
     FROM provider p
     JOIN categories c ON p.category_id = c.id
     WHERE p.user_id = ?`,
    [user_id]
  );
  return rows[0];
};

export default { create, approve, findAll, findById, findByUserId };