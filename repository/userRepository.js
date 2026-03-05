import db from "../config/db.js";

const create = async (data) => {
  try {
    // allow caller to specify initial status (e.g., pending for providers)
    const status = data.status || "active";
    const [result] = await db.execute(
      "INSERT INTO users (name,email,password,phone,role_id,status,created_by) VALUES (?,?,?,?,?,?,?)",
      [data.name, data.email, data.password, data.phone || null, data.role_id, status, data.created_by || null]
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

// activate or change status of user by provider row
const updateStatusByProviderId = async (providerId, status, updatedBy) => {
  await db.execute(
    `UPDATE users u
       JOIN provider p ON p.user_id = u.id
       SET u.status = ?, u.updated_by = ?
       WHERE p.id = ?`,
    [status, updatedBy || null, providerId]
  );
};


export default { create, findByEmail, findAll, findById, blockUser, updateStatusByProviderId };