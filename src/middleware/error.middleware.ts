import { NextFunction, Request, Response } from "express";

import { CustomError } from "../errors/app.error";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => { 
    if (err instanceof CustomError) { 
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }


    console.error("Unhandled Error");
    return res.status(500).send({
        errors: [{
            message: "Ops! Something went wrong from our end"
        }]})
     
}