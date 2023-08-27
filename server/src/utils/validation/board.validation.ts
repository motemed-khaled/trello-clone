import { check } from "express-validator";

import { validatorMiddleware } from "../../middleWares/validator.middleware";

export const createBoardValidation = [
    check("title").notEmpty().withMessage("title required"),
    validatorMiddleware
];

export const getBoardValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    validatorMiddleware
];