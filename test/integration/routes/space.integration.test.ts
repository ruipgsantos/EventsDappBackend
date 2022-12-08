import request from "supertest";
import app from "../../../src/app";
import { loadEventsData, loadSpacesData } from "../../test.utils";
import { Space } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

// import EventRepository from "../../../src/db/repositories/event.repository";
import SpaceRepository from "../../../src/db/repositories/space.repository";
import RepositoryFactory from "../../../src/db/repository.factory";
import { PrismaClient } from "@prisma/client";
import Repository from "../../../src/db/repositories/repository";
import {
  authenticateUser,
  resetDatabaseData,
  mockData,
} from "../int.test.utils";

jest.setTimeout(100000);
describe("Space Routes", () => {
  let mockSpacesData: any[] = loadSpacesData();
  let spaceRepo: SpaceRepository;

  class GenericRepo extends Repository {
    public async getSpace(id: number): Promise<Space | null> {
      return this.execute<Space | null>(async () => {
        return await this._prismaClient.space.findUnique({ where: { id } });
      });
    }
  }

  const genericRepo = new GenericRepo(new PrismaClient());

  beforeAll(async () => {
    spaceRepo = (await RepositoryFactory.getInstance()).getSpaceRepository();    
  });

  beforeEach(() => {
    resetDatabaseData();
    jest.clearAllMocks();
  });
  describe("WITHOUT Auth", () => {
    it("Returns All Spaces", async () => {
      await request(app)
        .get("/spaces")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(mockSpacesData);
        });
    });

    it("Returns Space By Id", async () => {
      await request(app)
        .get(`/spaces/5`)
        .expect(200)
        .then((response) => {
          const expectedSpace = mockSpacesData.find(
            (s: Space) => s.id === 5
          );          
          expect(response.body).toEqual(expectedSpace);
        });
    });
  });

  describe("WITH Auth", () => {
    const updatedSpace: Space = {
      id: 1,
      userId: 1,
      location: "new Space Location",
      name: "new Space",
      active: true,
    };
    let cookie: any = {};
    beforeEach(async () => {
      //authenticate
      cookie = await authenticateUser(
        app,
        mockData.user1Address,
        mockData.user1PrivateKey
      );
    });

    it("Update Space", async () => {
      await request(app)
        .put("/spaces")
        .send(updatedSpace)
        .set("Cookie", [cookie])
        .expect(200)
        .then(async (response) => {
          const resSpace: Space = response.body;
          expect(resSpace).toEqual(expect.objectContaining(resSpace));

          const dbSpace = await genericRepo.getSpace(resSpace.id);
          expect(dbSpace).toEqual(expect.objectContaining(updatedSpace));
        });
    });

    it("Returns 401 Unauthorized when trying to update Space", async () => {
      await request(app).put("/spaces").send(updatedSpace).expect(401);
    });

    it("Returns 403 Forbidden when trying to save Space that it doesnt Own", async () => {
      await request(app)
        .put("/spaces")
        .send({ ...updatedSpace, id: 3 }) //space does not belong to user1
        .set("Cookie", [cookie])
        .expect(403);
    });
  });
});
