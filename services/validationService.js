import { body, validationResult } from "express-validator";

// Validation middleware that checks errors and returns 400 if any exist
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Registration validation rules
const validateRegister = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  .withMessage("Please provide a valid email address"),
  
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  
  body("role")
    .optional()
    .isIn(["customer", "provider", "admin"]).withMessage("Invalid role"),
  
  body("phone")
    .optional()
    .trim()
    .matches(/^[+\d\s\-()]+$/).withMessage("Invalid phone number format"),
  
  body("street")
    .optional()
    .trim(),
  
  body("city")
    .optional()
    .trim(),
  
  body("state")
    .optional()
    .trim(),
  
  body("country")
    .optional()
    .trim(),
  
  body("zip")
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9\s\-]+$/).withMessage("Invalid zip code format"),
  
  body("Buisness_name")
    .optional()
    .trim(),
  
  body("description")
    .optional()
    .trim()
];

// Login validation rules
const validateLogin = [
  body("email")
    .trim()
    .isEmail().withMessage("Invalid email format"),
  
  body("password")
    .notEmpty().withMessage("Password is required")
];

// Legacy function for backward compatibility
const validateRequired = (fields, body) => {
  for (const field of fields) {
    if (!body[field]) {
      throw new Error(`${field} is required`);
    }
  }
};

const validateRating = (rating) => {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be 1-5");
  }
};

export default { 
  validateRegister,
  validateLogin,
  handleValidationErrors,
  validateRequired,
  validateRating
};