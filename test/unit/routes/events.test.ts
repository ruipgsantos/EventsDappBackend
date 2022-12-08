import request from "supertest";
import app from "../../../src/app";
import { loadEventsData } from "../../test.utils";
import { Event } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import EventRepository from "../../../src/db/repositories/event.repository";

import { UnauthorizedError, ForbiddenError } from "../../../src/error";

//allow unauthenticated requests for all tests
import AuthMiddleware from "../../../src/middleware/auth.middleware";
jest.mock("../../../src/middleware/auth.middleware");

import IsEventSpaceOwnerMiddleware from "../../../src/middleware/ownership/eventowner.middleware";
jest.mock("../../../src/middleware/ownership/eventowner.middleware");

//TODO: spy on route METHODS and ensure they're called with correct arguments
describe("Event Routes", () => {
  let mockEventsData: Event[] = loadEventsData();

  beforeAll(() => {
    mockEventsData = loadEventsData();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("WITHOUT Auth", () => {
    it("Returns an events array", async () => {
      const getEventsSpy = jest
        .spyOn(EventRepository.prototype, "getEvents")
        .mockImplementation((): Promise<Event[]> => {
          return new Promise<Event[]>((res) => {
            return res(mockEventsData);
          });
        });

      await request(app)
        .get("/events")
        .expect(200)
        .then((response) => expect(response.body).toEqual(mockEventsData));

      expect(getEventsSpy).toHaveBeenCalledTimes(1);
    });

    it("Returns events array by space id", async () => {
      const spaceId = 2;
      const expectedResult = mockEventsData.filter((e) => {
        return e.spaceId === spaceId;
      });
      const getEventsBySpaceIdSpy = jest
        .spyOn(EventRepository.prototype, "getEventsBySpaceId")
        .mockImplementation((): Promise<Event[]> => {
          return new Promise<Event[]>((res) => {
            return res(expectedResult);
          });
        });

      await request(app)
        .get(`/events/space/${spaceId}`)
        .expect(200)
        .then((response) => expect(response.body).toEqual(expectedResult));

      expect(getEventsBySpaceIdSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("WITH Auth", () => {
    const newEvent = {
      name: "newName",
      description: "newDescription",
      date: new Date(Date.now()),
      location: "newLocation",
      spaceId: 1,
    };

    beforeEach(() => {
      (AuthMiddleware as jest.Mock).mockImplementation(
        jest.fn((req: Request, res: Response, next: NextFunction) => {
          next();
        })
      );
      (IsEventSpaceOwnerMiddleware as jest.Mock).mockImplementation(
        jest.fn((req: Request, res: Response, next: NextFunction) => {
          next();
        })
      );
    });

    it("Returns created Event", async () => {
      const saveEventSpy = jest
        .spyOn(EventRepository.prototype, "saveEvent")
        .mockImplementation((event: Event): Promise<Event> => {
          return new Promise<Event>((res) => {
            return res({ ...event, id: 1000 });
          });
        });

      await request(app)
        .post(`/events`)
        .expect(200)
        .send(newEvent)
        .then((response) =>
          expect(response.body).toEqual({
            ...newEvent,
            date: newEvent.date.toISOString(),
            id: 1000,
          })
        );

      expect(saveEventSpy).toHaveBeenCalledTimes(1);
    });

    it("Returns 401 Unauthorized if not authenticated to create Event", async () => {
      (AuthMiddleware as jest.Mock).mockImplementation(
        (req: Request, res: Response, next: NextFunction) => {
          throw new UnauthorizedError();
        }
      );

      await request(app).post(`/events`).send(newEvent).expect(401);
    });

    it("Returns 403 Forbidden if not owner of Space to create Event", async () => {
      (IsEventSpaceOwnerMiddleware as jest.Mock).mockImplementation(
        (req: Request, res: Response, next: NextFunction) => {
          throw new ForbiddenError();
        }
      );

      await request(app).post(`/events`).send(newEvent).expect(403);
    });
  });
});
