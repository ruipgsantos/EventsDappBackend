import express, { Request, Response } from "express";
import EventsRepository from "../db/repositories/events.repository";
import { RepositoryFactory } from "../db/repository.factory";
import { Event } from "@prisma/client";

const router = express.Router();

const getEventsRepo = async (): Promise<EventsRepository> => {
  return (await RepositoryFactory.getInstance()).getEventsRepository();
};

router.get("/", async (req: Request, res: Response) => {
  const eventsRepo = await getEventsRepo();
  const events = await eventsRepo.getEvents();

  console.log(
    `requested ${events ? events.length : 0} events at ${Date.now()}`
  );
  res.send(events);
});

type SpaceParams = {
  spaceId: number;
};

router.get("/:spaceId", async (req: Request<SpaceParams, Event[]>, res) => {
  const eventsRepo = await getEventsRepo();
  const events = await eventsRepo.getEventsBySpaceId(
    Number(req.params.spaceId)
  );
  console.log(
    `requested ${events ? events.length : 0} events by spaceid at ${Date.now()}`
  );
  res.send(events);
});

export default router;
