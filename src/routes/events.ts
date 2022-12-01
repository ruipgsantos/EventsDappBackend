import express, { Request, Response } from "express";
import EventsRepository from "../db/repositories/events.repository";
import { RepositoryFactory } from "../db/repository.factory";
import { Event } from "@prisma/client";

const router = express.Router();

const getEventsRepo = async (): Promise<EventsRepository> => {
  return (await RepositoryFactory.getInstance()).getEventsRepository();
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
  "/:spaceId",
  async (req: Request<{ spaceId: number }>, res: Response<Event[]>) => {
    const eventsRepo = await getEventsRepo();
    const events = await eventsRepo.getEventsBySpaceId(
      Number(req.params.spaceId)
    );
    res.send(events);
  }
);

router.post("/", async (req: Request<{}, {}, Event>, res: Response) => {
  const eventRepo = await getEventsRepo();
  const resEvent = await eventRepo.saveEvent(req.body);

  res.send(resEvent);
});

export default router;
