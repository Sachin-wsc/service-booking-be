import db from "../config/db.js";

const getRoleIdByName = async (roleName) => {
  try {
    const [rows] = await db.execute(
      "SELECT id FROM roles WHERE name = ?",
      [roleName]
    );
    return rows[0]?.id;
  } catch (err) {
    throw new Error("Role lookup failed");
  }
};

const getRoleNameById = async (roleId) => {
  try {
    const [rows] = await db.execute(
      "SELECT name FROM roles WHERE id = ?",
      [roleId]
    );
    return rows[0]?.name;
  } catch (err) {
    throw new Error("Role lookup failed");
  }
};

export default { getRoleIdByName, getRoleNameById };
