import bcrypt from "bcryptjs";

const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch {
    throw new Error("Hash failed");
  }
};

const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    throw new Error("Compare failed");
  }
};

export default { hashPassword, comparePassword };