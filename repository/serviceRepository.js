import db from "../config/db.js";

const create = async (data) => {
  const [result] = await db.execute(
    "INSERT INTO services (provider_id,category_id,title,description,price) VALUES (?,?,?,?,?)",
    [
      data.provider_id,
      data.category_id,
      data.title,
      data.description,
      data.price
    ]
  );
  return result.insertId;
};

const findAll = async () => {
  const [rows] = await db.execute(
    `SELECT s.*, c.name as category_name 
     FROM services s 
     JOIN categories c ON s.category_id=c.id`
  );
  return rows;
};

const findByProvider = async (provider_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM services WHERE provider_id=?",
    [provider_id]
  );
  return rows;
};

export default { create, findAll, findByProvider };