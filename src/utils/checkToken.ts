import { Response, NextFunction } from "express";
import { ErrorManager } from "../lib/classes/ErrorManager";
import Token from "../models/token";
import User from "../models/user";
import { Request } from "../lib/types/Request";

export const checkToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) throw ErrorManager.errors.NO_TOKEN;

        const splitToken: string[] = authorization.split(" ");

        if (splitToken[0] !== "Bearer" || splitToken[1] == null || splitToken[1] == "null")
            throw ErrorManager.errors.INVALID_TOKEN;

        const tbToken = await Token.findOne({ authToken: splitToken[1] }).lean();

        if (!tbToken) throw ErrorManager.errors.INVALID_TOKEN;
        // Assign user to the request
        const user = await User.findOne({ _id: tbToken.user }).populate(" roles ").lean();

        if (user) {
            req.user = user;
        }
    } catch (err) {
        next(err);
    }

    next();
};
