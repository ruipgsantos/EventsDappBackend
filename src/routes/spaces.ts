import express, { Request, Response } from "express";
import SpaceRepository from "../db/repositories/space.repository";
import RepositoryFactory from "../db/repository.factory";
import { Space } from "@prisma/client";
import { AuthMiddleware } from "../middleware";
import { IsSpaceOwnerMiddleware } from "../middleware/ownership";

const router = express.Router();

const getSpaceRepo = async (): Promise<SpaceRepository> => {
  return (await RepositoryFactory.getInstance()).getSpaceRepository();
};

/**
 * Get All Spaces
 */
router.get(
  "/",
  async (req: Request<{ spaceid: number }>, res: Response<Space[]>) => {
    const spaceRepo = await getSpaceRepo();
    res.json(await spaceRepo.getSpaces());
  }
);

/**
 * Get Space By Id
 */
router.get(
  "/:spaceid",
  async (req: Request<{ spaceid: number }>, res: Response<Space>) => {
    const spaceRepo = await getSpaceRepo();
    const space = await spaceRepo.getSpaceById(Number(req.params.spaceid));
    res.json(space);
  }
);

/**
 * Save a Space Info
 * A Space can never be *created* here,
 * it should be created on user onboarding
 */
router.put(
  "/",
  AuthMiddleware,
  IsSpaceOwnerMiddleware,
  async (req: Request<{}, {}, Space>, res: Response<Space>) => {
    const spaceRepo = await getSpaceRepo();
    const updatedSpace = await spaceRepo.updateSpace(req.body);
    res.json(updatedSpace);
  }
);

export default router;
