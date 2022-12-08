import { Request, Response, NextFunction } from "express";
import { User, Event } from "@prisma/client";
import { ForbiddenError } from "../../error";
import UserRepository from "../../db/repositories/user.repository";
import RepositoryFactory from "../../db/repository.factory";

const getUserRepo = async (): Promise<UserRepository> => {
  return (await RepositoryFactory.getInstance()).getUserRepository();
};

const IsEventSpaceOwnerMiddleware = async (
  req: Request<{}, {}, Event>,
  res: Response,
  next: NextFunction
) => {
  const userRepo = await getUserRepo();
  const user = await userRepo.getBySpace(req.body.spaceId);

  //space id of the event is not owned by current user
  if (user.id !== req.session.userId) throw new ForbiddenError();

  next();
};

export default IsEventSpaceOwnerMiddleware;
