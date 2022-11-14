import express, { Request, Response, NextFunction } from "express";
import { EventsRepository } from "../db/repositories/events.repository";
import { RepositoryFactory } from "../db/repository.factory";
import { Event } from "@prisma/client";

const router = express.Router();

const getEventsRepo = async (): Promise<EventsRepository> => {
  return (await RepositoryFactory.getInstance()).getEventsRepository();
};

router.get("/", async (req: Request, res: Response) => {
  const eventsRepo = await getEventsRepo();
  const events = await eventsRepo.getEvents();
  console.log(`request events at ${Date.now()}`);
  res.send(events);
});

type SpaceParams = {
  spaceId: number;
};

router.get(
  "/:spaceId",
  async (
    req: Request<{ spaceId: number }, { events: Event[] }, {}, SpaceParams>,
    res
  ) => {
    const params: SpaceParams = req.params;
    const eventsRepo = await getEventsRepo();
    const events = await eventsRepo.getEventsBySpaceId(params.spaceId);
    console.log(`request events by spaceid at ${Date.now()}`);
    res.send({ events });
  }
);

export default router;
