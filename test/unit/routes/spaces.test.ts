import request from "supertest";
import app from "../../../src/app";
import { Space } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import SpaceRepository from "../../../src/db/repositories/space.repository";
import { loadSpacesData } from "../../test.utils";

//allow unauthenticated requests for all tests
import AuthMiddleware from "../../../src/middleware/auth.middleware";
import UnauthorizedError from "../../../src/error/unauthorized.error";
jest.mock("../../../src/middleware/auth.middleware");

import IsSpaceOwnerMiddleware from "../../../src/middleware/ownership/spaceowner.middleware";
import ForbiddenError from "../../../src/error/forbidden.error";
jest.mock("../../../src/middleware/ownership/spaceowner.middleware");

describe("Spaces Routes", () => {
  let mockSpace: Space = {
    id: 1000,
    location: "Mock Street 22",
    name: "Mock Space",
    userId: 2000,
    active: false,
  };

  let newSpace = {
    location: "Mock new Street 22",
    name: "Mock new Space",
    userId: 2000,
    active: true,
  };

  let mockSpacesData: Space[] = loadSpacesData();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Without Auth", () => {
    it("Returns Space List", async () => {
      const getSpacesSpy = jest
        .spyOn(SpaceRepository.prototype, "getSpaces")
        .mockImplementation((): Promise<Space[]> => {
          return new Promise<Space[]>((res) => {
            res(mockSpacesData);
          });
        });

      await request(app)
        .get(`/spaces`)
        .expect(200)
        .then((response) => expect(response.body).toEqual(mockSpacesData));

      expect(getSpacesSpy).toHaveBeenCalledTimes(1);
    });
    it("Returns Space", async () => {
      const getSpaceByIdSpy = jest
        .spyOn(SpaceRepository.prototype, "getSpaceById")
        .mockImplementation((id: number): Promise<Space> => {
          return new Promise<Space>((res) => {
            if (id !== mockSpace.id) throw Error();
            return res(mockSpace);
          });
        });

      await request(app)
        .get(`/spaces/${mockSpace.id}`)
        .expect(200)
        .then((response) => expect(response.body).toEqual(mockSpace));

      expect(getSpaceByIdSpy).toHaveBeenCalledTimes(1);
    });

    it("Returns 404 status when Space does not exist", async () => {
      const getSpaceByIdSpy = jest
        .spyOn(SpaceRepository.prototype, "getSpaceById")
        .mockImplementation((id: number): Promise<Space> => {
          return new Promise<Space>((res, rej) => {
            rej();
          });
        });

      await request(app).get(`/spaces/9999`).expect(404);

      expect(getSpaceByIdSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe("With Auth", () => {
    beforeEach(() => {
      (AuthMiddleware as jest.Mock).mockImplementation(
        jest.fn((req: Request, res: Response, next: NextFunction) => {
          next();
        })
      );

      (IsSpaceOwnerMiddleware as jest.Mock).mockImplementation(
        jest.fn((req: Request, res: Response, next: NextFunction) => {
          next();
        })
      );
    });
    it("Returns updated Space", async () => {
      const updateSpaceSpy = jest
        .spyOn(SpaceRepository.prototype, "updateSpace")
        .mockImplementation((space: Space): Promise<Space> => {
          return new Promise<Space>((res) => {
            return res({
              ...space,
              id: 1000,
            });
          });
        });

      await request(app)
        .put(`/spaces`)
        .send(newSpace)
        .expect(200)
        .then((response) =>
          expect(response.body).toEqual({
            ...newSpace,
            id: 1000,
          })
        );

      expect(updateSpaceSpy).toHaveBeenCalledTimes(1);
    });

    it("Returns 401 Unauthorized if not authenticated to updated Space", async () => {
      (AuthMiddleware as jest.Mock).mockImplementation(() => {
        throw new UnauthorizedError();
      });

      await request(app).put(`/spaces`).send(newSpace).expect(401);
    });

    it("Returns 403 Forbidden if not owner of updated Space", async () => {
      (IsSpaceOwnerMiddleware as jest.Mock).mockImplementation(() => {
        throw new ForbiddenError();
      });

      await request(app).put(`/spaces`).send(newSpace).expect(403);
    });
  });
});
