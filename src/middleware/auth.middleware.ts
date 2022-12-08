import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../../src/error/unauthorized.error";

const auth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.isAuthenticated) {
    throw new UnauthorizedError();
  }

  next();
};

export default auth;
