import db from "../config/db.js";

const create = async (data) => {
  try {
    const [result] = await db.execute(
      "INSERT INTO users (name,email,password,phone,role_id,status,created_by) VALUES (?,?,?,?,?,?,?)",
      [data.name, data.email, data.password, data.phone || null, data.role_id, "active", data.created_by || null]
    );
    return result.insertId;
  } catch (err) {
    throw new Error("User creation failed");
  }
};

const findByEmail = async (email) => {
  const [rows] = await db.execute(
    `SELECT u.*, r.name as role FROM users u 
     JOIN roles r ON u.role_id = r.id 
     WHERE u.email = ?`,
    [email]
  );
  return rows[0];
};

const findAll = async () => {
  const [rows] = await db.execute(
    `SELECT u.*, r.name as role FROM users u 
     JOIN roles r ON u.role_id = r.id`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT u.*, r.name as role FROM users u 
     JOIN roles r ON u.role_id = r.id 
     WHERE u.id = ?`,
    [id]
  );
  return rows[0];
};

const blockUser = async (id, blockedBy) => {
  try {
    // block the user
    await db.execute(
      "UPDATE users SET status='blocked', updated_by=? WHERE id=?",
      [blockedBy || null, id]
    );
    
    // if user is a provider, also block their provider profile
    await db.execute(
      "UPDATE provider SET status='blocked', updated_by=? WHERE user_id=?",
      [blockedBy || null, id]
    );
  } catch (err) {
    throw new Error("Block user failed");
  }
};

export default { create, findByEmail, findAll, findById, blockUser };