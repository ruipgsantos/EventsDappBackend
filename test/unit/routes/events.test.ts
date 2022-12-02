import request from "supertest";
import app from "../../../src/app";
import { loadEventsData } from "../../testutils";
import { Event } from "@prisma/client";

import EventRepository from "../../../src/db/repositories/event.repository";

//TODO: error scenarios
describe("Events Routes", () => {
  let mockEventsData: Event[] = loadEventsData();

  beforeAll(() => {
    mockEventsData = loadEventsData();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Returns events array", async () => {
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
      .get(`/events/${spaceId}`)
      .expect(200)
      .then((response) => expect(response.body).toEqual(expectedResult));

    expect(getEventsBySpaceIdSpy).toHaveBeenCalledTimes(1);
  });

  it("Returns created Event", async () => {
    const newEvent = {
      name: "newName",
      description: "newDescription",
      date: new Date(Date.now()),
      location: "newLocation",
      spaceId: 1,
    };

    const saveEventSpy = jest
      .spyOn(EventRepository.prototype, "saveEvent")
      .mockImplementation((): Promise<Event> => {
        return new Promise<Event>((res) => {
          return res({ id: 1000, ...newEvent });
        });
      });

    await request(app)
      .post(`/events`)
      .expect(200)
      .then((response) =>
        expect(response.body).toEqual({
          ...newEvent,
          date: newEvent.date.toISOString(),
          id: 1000,
        })
      );

    expect(saveEventSpy).toHaveBeenCalledTimes(1);
  });
});
