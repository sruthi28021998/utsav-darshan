import { body, validationResult } from "express-validator";

export const check = (req, res, next) => {
  const e = validationResult(req);
  if (!e.isEmpty()) return res.status(400).json({ message: e.array()[0].msg });
  next();
};

export const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().toLowerCase().isEmail().withMessage("Enter a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

export const loginRules = [
  body("email").trim().toLowerCase().isEmail().withMessage("Enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const eventRules = [
  body("name").trim().notEmpty().withMessage("Event name is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("location").trim().notEmpty().withMessage("Venue is required"),
  body("category").notEmpty().withMessage("Select a category"),
  body("startDate").isISO8601().withMessage("Valid start date required"),
  body("endDate")
    .isISO8601()
    .withMessage("Valid end date required")
    .custom((v, { req }) => new Date(v) >= new Date(req.body.startDate))
    .withMessage("End date must be on or after start date"),
  body("lat").optional({ values: "falsy" }).isFloat({ min: -90, max: 90 }).withMessage("Invalid latitude"),
  body("lng").optional({ values: "falsy" }).isFloat({ min: -180, max: 180 }).withMessage("Invalid longitude"),
];