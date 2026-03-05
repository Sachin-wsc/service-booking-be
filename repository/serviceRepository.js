import db from "../config/db.js";

const create = async (data) => {
  const [result] = await db.execute(
    "INSERT INTO services (provider_id,category_id,title,description,price,created_by) VALUES (?,?,?,?,?,?)",
    [
      data.provider_id,
      data.category_id,
      data.title,
      data.description,
      data.price,
      data.created_by || null
    ]
  );
  return result.insertId;
};

const findAll = async () => {
  const [rows] = await db.execute(
    `SELECT s.*, c.name as category_name, p.Buisness_name as provider_name
     FROM services s 
     JOIN categories c ON s.category_id=c.id
     JOIN provider p ON s.provider_id=p.id`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT s.*, c.name as category_name, p.Buisness_name as provider_name
     FROM services s 
     JOIN categories c ON s.category_id=c.id
     JOIN provider p ON s.provider_id=p.id
     WHERE s.id=?`,
    [id]
  );
  return rows[0];
};

const findByProvider = async (provider_id) => {
  const [rows] = await db.execute(
    `SELECT s.*, c.name as category_name 
     FROM services s 
     JOIN categories c ON s.category_id=c.id
     WHERE s.provider_id=?`,
    [provider_id]
  );
  return rows;
};

const update = async (id, data) => {
  const [result] = await db.execute(
    "UPDATE services SET category_id=?,title=?,description=?,price=?,updated_by=?,updated_at=CURRENT_TIMESTAMP WHERE id=?",
    [
      data.category_id,
      data.title,
      data.description,
      data.price,
      data.updated_by || null,
      id
    ]
  );
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await db.execute(
    "DELETE FROM services WHERE id=?",
    [id]
  );
  return result.affectedRows;
};

const findServicesWithAvailability = async () => {
  const [rows] = await db.execute(
    `SELECT s.*, c.name as category_name, p.Buisness_name as provider_name,
     COUNT(a.id) as available_slots
     FROM services s 
     JOIN categories c ON s.category_id=c.id
     JOIN provider p ON s.provider_id=p.id
     LEFT JOIN availability a ON s.id=a.service_id AND a.date >= CURDATE() AND a.is_available=TRUE
     GROUP BY s.id`
  );
  return rows;
};

export default { 
  create, 
  findAll, 
  findById,
  findByProvider, 
  update,
  remove,
  findServicesWithAvailability
};