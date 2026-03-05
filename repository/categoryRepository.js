import db from "../config/db.js";

const create = async (data) => {
  try {
    const { name, description, created_by } = data;
    const [result] = await db.execute(
      "INSERT INTO categories (name, description, created_by) VALUES (?,?,?)",
      [name, description || null, created_by || null]
    );
    return result.insertId;
  } catch (err) {
    throw new Error("Category creation failed");
  }
};

const findAll = async () => {
  const [rows] = await db.execute("SELECT * FROM categories");
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM categories WHERE id = ?", [id]);
  return rows[0];
};

const update = async (id, data) => {
  try {
    const { name, description, updated_by } = data;
    await db.execute(
      "UPDATE categories SET name=?, description=?, updated_by=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
      [name, description || null, updated_by || null, id]
    );
  } catch (err) {
    throw new Error("Category update failed");
  }
};

const remove = async (id) => {
  await db.execute("DELETE FROM categories WHERE id=?", [id]);
};

export default { create, findAll, findById, update, remove };