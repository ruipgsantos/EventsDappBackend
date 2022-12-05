import express, { Request, Response } from "express";
import EventRepository from "../db/repositories/event.repository";
import RepositoryFactory from "../db/repository.factory";
import { Event } from "@prisma/client";

const router = express.Router();

const getEventsRepo = async (): Promise<EventRepository> => {
  return (await RepositoryFactory.getInstance()).getEventRepository();
};

/**
 * Get All Events
 */
router.get("/", async (req: Request, res: Response) => {
  const eventsRepo = await getEventsRepo();
  const events = await eventsRepo.getEvents();
  res.send(events);
});

/**
 * Get Events By Space Id
 */
router.get(
  "/space/:spaceId",
  async (req: Request<{ spaceId: number }>, res: Response<Event[]>) => {
    const eventsRepo = await getEventsRepo();
    const events = await eventsRepo.getEventsBySpaceId(
      Number(req.params.spaceId)
    );
    res.send(events);
  }
);

/**
 * Save Event
 */
router.post("/", async (req: Request<{}, {}, Event>, res: Response) => {
  const eventRepo = await getEventsRepo();
  const resEvent = await eventRepo.saveEvent(req.body);

  res.send(resEvent);
});

export default router;
