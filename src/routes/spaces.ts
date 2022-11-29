import express, { Request, Response } from "express";
import SpaceRepository from "../db/repositories/space.repository";
import RepositoryFactory from "../db/repository.factory";
import { Space } from "@prisma/client";

const router = express.Router();

const getSpaceRepo = async (): Promise<SpaceRepository> => {
  return (await RepositoryFactory.getInstance()).getSpaceRepository();
};

/**
 * Get Space By Id
 */
router.get(
  "/:spaceid",
  async (req: Request<{ spaceid: number }>, res: Response<Space>) => {
    const spaceRepo = await getSpaceRepo();
    const space = await spaceRepo.getSpaceById(Number(req.params.spaceid));

    res.send(space);
  }
);

/**
 * Save a Space Info
 * A Space can never be created here,
 * it should be created on user onboarding
 */
router.put("/", async (req: Request<{}, {}, Space>, res: Response<Space>) => {
  const spaceRepo = await getSpaceRepo();
  const updatedSpace = await spaceRepo.updateSpace(req.body);
  res.send(updatedSpace);
});

export default router;
