// Simple in-memory token blacklist
// In production, use Redis for distributed systems
const blacklist = new Set();

const addToBlacklist = (token) => {
  blacklist.add(token);
};

const isTokenBlacklisted = (token) => {
  return blacklist.has(token);
};

const clearBlacklist = () => {
  blacklist.clear();
};

export default { addToBlacklist, isTokenBlacklisted, clearBlacklist };
