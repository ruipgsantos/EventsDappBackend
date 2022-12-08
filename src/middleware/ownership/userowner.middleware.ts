import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import { ForbiddenError } from "../../error";

export default async function IsUserOwnerMiddleware(
  req: Request<{}, {}, User>,
  res: Response,
  next: NextFunction
) {
  const userId = req.session.userId;
  const newUserInfo: User = req.body;

  if (userId !== newUserInfo.id) {
    throw new ForbiddenError();
  }

  next();
}
