import express, { Request, Response, NextFunction } from "express";
import UserRepository from "../db/repositories/user.repository";
import RepositoryFactory from "../db/repository.factory";
import { User } from "@prisma/client";
import { IsUserOwnerMiddleware } from "../middleware/ownership";
import { AuthMiddleware } from "../middleware";

const router = express.Router();
const getUserRepo = async (): Promise<UserRepository> => {
  return (await RepositoryFactory.getInstance()).getUserRepository();
};

/**
 * Update User info
 */
router.put(
  "/",
  AuthMiddleware,
  IsUserOwnerMiddleware,
  async (req: Request<{}, {}, User>, res: Response) => {
    const userRepo = await getUserRepo();    
    res.json(await userRepo.updateUser(req.body));
  }
);

export default router;
