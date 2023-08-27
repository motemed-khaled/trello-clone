import { check } from "express-validator";

import { validatorMiddleware } from "../../middleWares/validator.middleware";


export const registerValidation = [
    check("email").notEmpty()
        .withMessage("email is required")
        .isEmail().withMessage("invalid email format"),
    check("userName").notEmpty()
        .withMessage("userName is required")
        .isLength({ min: 5 }).withMessage("very short userName")
        .isLength({ max: 25 }).withMessage("very long userName"),
    check("password").notEmpty()
        .withMessage("password is required")
        .isLength({ min: 6 }).withMessage("very short password"),
    validatorMiddleware
];

export const loginValidation = [
    check("email").notEmpty()
        .withMessage("email is required")
        .isEmail().withMessage("invalid email format"),
    validatorMiddleware
];