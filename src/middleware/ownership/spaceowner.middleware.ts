import { Request, Response, NextFunction } from "express";
import { Space } from "@prisma/client";
import { ForbiddenError } from "../../error";
import UserRepository from "../../db/repositories/user.repository";
import RepositoryFactory from "../../db/repository.factory";

const getUserRepo = async (): Promise<UserRepository> => {
  return (await RepositoryFactory.getInstance()).getUserRepository();
};

export default async function IsSpaceOwnerMiddleware(
  req: Request<{}, {}, Space>,
  res: Response,
  next: NextFunction
) {
  const userRepo = await getUserRepo();
  const user = await userRepo.getBySpace(req.body.id);

  if (user.id !== req.session.userId) {
    throw new ForbiddenError();
  }

  next();
}
