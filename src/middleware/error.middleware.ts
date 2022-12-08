import { NextFunction, Request, Response } from "express";
import GenericError from "../error/generic.error";

const error = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    if (err instanceof GenericError) {
      const customError: GenericError = err;
      res.status(customError.status).send(customError.message);
    } else {
      res.status(500).send("Error");
    }

    console.warn(`An error has ocurred: ${err.message}`);
  } else {
    next();
  }
};

export default error;
