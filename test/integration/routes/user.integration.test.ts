import request from "supertest";
import app from "../../../src/app";
import { User, Space } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import Repository from "../../../src/db/repositories/repository";
import { resetDatabaseData, mockData } from "../int.test.utils";
import { authenticateUser } from "../int.test.utils";

const { user1Address, user1PrivateKey } = mockData;

describe("User Routes", () => {
  class GenericRepo extends Repository {
    public async getUserByAddress(address: string): Promise<User | null> {
      return this.execute<User | null>(async () => {
        return await this._prismaClient.user.findUnique({ where: { address } });
      });
    }

    public async getUser(id: number): Promise<User | null> {
      return this.execute<User | null>(async () => {
        return await this._prismaClient.user.findUnique({ where: { id } });
      });
    }

    public async getSpaceByUser(id: number): Promise<Space | null> {
      return this.execute<Space | null>(async () => {
        return await this._prismaClient.space.findFirst({
          where: { userId: id },
        });
      });
    }
  }

  const genericRepo = new GenericRepo(new PrismaClient());

  let cookie: any = {};
  beforeEach(async () => {
    resetDatabaseData();
    jest.clearAllMocks();
    cookie = await authenticateUser(app, user1Address, user1PrivateKey);
  });

  it("Should update existing user", async () => {
    const newUserInfo = { id: 1, name: "New User 1 Name" };
    await request(app)
      .put(`/user`)
      .set("Cookie", [cookie])
      .send(newUserInfo)
      .expect(200)
      .then(async (res) => {
        const resUser: User = res.body;
        expect(resUser).toEqual(expect.objectContaining(newUserInfo));

        const dbUser = await genericRepo.getUser(newUserInfo.id);
        expect(dbUser).toEqual(expect.objectContaining(newUserInfo));
      });
  });

  it("Returns 401 Unauthorized when trying to update User without Auth", async () => {
    const newUserInfo = { id: 1, name: "New User 1 Name" };
    await request(app).put(`/user`).send(newUserInfo).expect(401);
  });

  it("Returns 403 Forbidden when trying to update User it does not own", async () => {
    const newUserInfo = { id: 3, name: "New User 1 Name" };
    await request(app)
      .put(`/user`)
      .set("Cookie", [cookie])
      .send(newUserInfo)
      .expect(403);
  });
});
