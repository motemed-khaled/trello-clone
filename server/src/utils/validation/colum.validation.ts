import { check } from "express-validator";

import { validatorMiddleware } from "../../middleWares/validator.middleware";

export const getColumsValidation = [
    check("boardId").isMongoId().withMessage("invalid id format"),
    validatorMiddleware
];