import db from "../config/db.js";

const create = async (data) => {
  try {
    const { service_id, date, start_time, end_time, is_available, created_by } = data;
    const [result] = await db.execute(
      "INSERT INTO availability (service_id,date,start_time,end_time,is_available,created_by) VALUES (?,?,?,?,?,?)",
      [service_id, date, start_time, end_time, is_available !== undefined ? is_available : true, created_by || null]
    );
    return result.insertId;
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      throw new Error("This time slot already exists");
    }
    throw new Error("Availability creation failed");
  }
};

const findByService = async (service_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM availability WHERE service_id=? ORDER BY date, start_time",
    [service_id]
  );
  return rows;
};

const findByServiceAndDate = async (service_id, date) => {
  const [rows] = await db.execute(
    "SELECT * FROM availability WHERE service_id=? AND date=? ORDER BY start_time",
    [service_id, date]
  );
  return rows;
};

const findAvailableSlots = async (service_id, date) => {
  const [rows] = await db.execute(
    "SELECT * FROM availability WHERE service_id=? AND date=? AND is_available=TRUE ORDER BY start_time",
    [service_id, date]
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.execute(
    "SELECT * FROM availability WHERE id=?",
    [id]
  );
  return rows[0];
};

const update = async (id, data) => {
  try {
    const { date, start_time, end_time, is_available, updated_by } = data;
    const [result] = await db.execute(
      "UPDATE availability SET date=?,start_time=?,end_time=?,is_available=?,updated_by=?,updated_at=CURRENT_TIMESTAMP WHERE id=?",
      [date, start_time, end_time, is_available, updated_by || null, id]
    );
    return result.affectedRows;
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      throw new Error("This time slot already exists");
    }
    throw new Error("Availability update failed");
  }
};

const updateStatus = async (id, is_available, updated_by) => {
  const [result] = await db.execute(
    "UPDATE availability SET is_available=?,updated_by=?,updated_at=CURRENT_TIMESTAMP WHERE id=?",
    [is_available, updated_by || null, id]
  );
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await db.execute(
    "DELETE FROM availability WHERE id=?",
    [id]
  );
  return result.affectedRows;
};

const findUpcomingAvailable = async (service_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM availability 
     WHERE service_id=? AND date >= CURDATE() AND is_available=TRUE 
     ORDER BY date, start_time 
     LIMIT 50`,
    [service_id]
  );
  return rows;
};

const checkSlotAvailability = async (service_id, date, time) => {
  const [rows] = await db.execute(
    `SELECT * FROM availability 
     WHERE service_id=? AND date=? AND start_time<=? AND end_time>? AND is_available=TRUE`,
    [service_id, date, time, time]
  );
  return rows[0];
};

export default {
  create,
  findByService,
  findByServiceAndDate,
  findAvailableSlots,
  findById,
  update,
  updateStatus,
  remove,
  findUpcomingAvailable,
  checkSlotAvailability
};
