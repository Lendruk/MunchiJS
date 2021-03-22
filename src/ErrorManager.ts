import { ErrorFormat } from "./types/ErrorFormat";
import { Request, Response, NextFunction } from "express";

export class ErrorManager {
  static errors = {
    BAD_REQUEST: {
      status: 400,
      message: "Bad Request",
      messageCode: "BAD_REQUEST",
    },
    REQUIRED_FIELDS_EMPTY: {
      status: 400,
      message: "Required Fields Empty",
      messageCode: "REQUIRED_FIELDS_EMPTY",
    },
    INVALID_CREDENTIALS: {
      status: 400,
      message: "Invalid Credentials",
      messageCode: "INVALID_CREDENTIALS",
    },
    NO_TOKEN: {
      status: 401,
      message: "No Token",
      messageCode: "NO_TOKEN",
    },
    INVALID_TOKEN: {
      status: 401,
      message: "Invalid Token",
      messageCode: "INVALID_TOKEN",
    },
    NO_PERMISSION: {
      status: 403,
      message: "No Permission",
      messageCode: "NO_PERMISSION",
    },
    NOT_FOUND: {
      status: 404,
      message: "Not Found",
      messageCode: "NOT_FOUND",
    },
    RESOURCE_ALREADY_EXISTS: {
      status: 409,
      message: "Resource already exists",
      messageCode: "RESOURCE_ALREADY_EXISTS",
    },
    EMAIL_ALREADY_IN_USE: {
      status: 409,
      message: "Email already in use",
      messageCode: "EMAIL_ALREADY_IN_USE",
    },
    SERVER_ERROR: {
      status: 500,
      message: "Server Error",
      messageCode: "SERVER_ERROR",
    },
    DB_FAILED_UPDATE: {
      status: 500,
      message: "DB Failed Update",
      messageCode: "DB_FAILED_UPDATE",
    },
    FIELDS_EMPTY: (parameter: string, missingFields: Array<string>) => {
      return {
        status: 400,
        messageCode: "REQUIRED_FIELDS_EMPTY",
        message: "Required Fields Empty",
        parameter,
        missingFields,
      };
    },
  };

  static async handleError(err: ErrorFormat, req: Request, res: Response, next: NextFunction) {
    if (!err) {
      err = ErrorManager.errors.SERVER_ERROR;
    }
    console.error("[ERROR]", JSON.stringify(err));
    res.status(err.status).json({
      message: err.message,
      results: null,
      ...err,
    });
  }
}
