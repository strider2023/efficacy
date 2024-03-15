import { Request, Response, NextFunction } from "express";
import { ApiError, AuthError } from "../errors";
import { ValidateError } from "tsoa";

export const errorHandlerMiddleware = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction) => {
    if (err instanceof AuthError) {
        return res.status(err.statusCode).json({
            message: err.name,
            details: err.message,
        });
    }
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            message: err.name,
            details: err.message,
        });
    }
    if (err instanceof ValidateError) {
        return res.status(422).json({
            message: "Validation Failed",
            details: err?.fields,
        });
    }
    if (err instanceof Error) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
    next();
}