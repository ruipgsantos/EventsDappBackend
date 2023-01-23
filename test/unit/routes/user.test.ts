import request from "supertest";
import app from "../../../src/app";
import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import UserRepository from "../../../src/db/repositories/user.repository";
import { UnauthorizedError, ForbiddenError } from "../../../src/error";

//allow unauthenticated requests for all tests
import AuthMiddleware from "../../../src/middleware/auth.middleware";
jest.mock("../../../src/middleware/auth.middleware");

import IsUserOwnerMiddleware from "../../../src/middleware/ownership/userowner.middleware";
jest.mock("../../../src/middleware/ownership/userowner.middleware");

describe("User Routes", () => {
  const mockNewUser: User = {
    id: 5,
    name: "mockUserUpdated",
    address: "0x62F87Ba3C0D00d1a6F0533d0309DB3720FF8AfFf",
  };

  beforeEach(() => {
    (AuthMiddleware as jest.Mock).mockImplementation(
      jest.fn((req: Request, res: Response, next: NextFunction) => {
        next();
      })
    );

    (IsUserOwnerMiddleware as jest.Mock).mockImplementation(
      jest.fn((req: Request, res: Response, next: NextFunction) => {
        next();
      })
    );
  });

  it("Gets user info", async () => {
    const getUserSpy = jest
      .spyOn(UserRepository.prototype, "getUser")
      .mockImplementation((address: string): Promise<User> => {
        return new Promise<User>((res) => {
          return res(mockNewUser);
        });
      });

    await request(app)
      .get(`/user/${mockNewUser.address}`)
      .send(mockNewUser)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(mockNewUser);
      });

    expect(getUserSpy).toHaveBeenCalledTimes(1);
  });

  it("Updates user info", async () => {
    const updateUserSpy = jest
      .spyOn(UserRepository.prototype, "updateUser")
      .mockImplementation((user: User): Promise<User> => {
        return new Promise<User>((res) => {
          return res(user);
        });
      });

    await request(app)
      .put(`/user`)
      .send(mockNewUser)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(mockNewUser);
      });

    expect(updateUserSpy).toHaveBeenCalledTimes(1);
  });

  it("Returns 401 Unauthorized when trying to update user info", async () => {
    (AuthMiddleware as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        throw new UnauthorizedError();
      }
    );

    await request(app).put(`/user`).send(mockNewUser).expect(401);
  });

  it("Returns 403 Forbidden when trying to update other user info", async () => {
    (IsUserOwnerMiddleware as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        throw new ForbiddenError();
      }
    );

    await request(app).put(`/user`).send(mockNewUser).expect(403);
  });
});
