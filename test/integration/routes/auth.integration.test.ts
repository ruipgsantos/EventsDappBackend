import request from "supertest";
import app from "../../../src/app";
import { User, Space } from "@prisma/client";
import {
  signTypedData,
  SignTypedDataVersion,
  TypedDataV1,
} from "@metamask/eth-sig-util";

import UserRepository from "../../../src/db/repositories/user.repository";
import { PrismaClient } from "@prisma/client";
import Repository from "../../../src/db/repositories/repository";
import { resetDatabaseData } from "../int.test.utils";

const mockEthAdress = "0x62F87Ba3C0D00d1a6F0533d0309DB3720FF8AfFf";
const mockPrivateKey =
  "33310aabe472ccefd40a228ae0048b0bff11d10402f20397afac2908f69652e9";
const user1Address = "0x9fB48802C9c9A187Df19AF823a792b909bec8576";
const user1PrivateKey =
  "9ecf871857bd4a1b0aa41a7a0880428bb665e6400b45d20846d95906ac98b035";

jest.setTimeout(1000000);

describe("Auth Routes", () => {
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

  beforeAll(async () => {});

  afterAll(async () => {});

  beforeEach(() => {
    resetDatabaseData();
    jest.clearAllMocks();
  });

  it("Should register and authenticate new user", async () => {
    const getOrCreateUserSpy = jest.spyOn(
      UserRepository.prototype,
      "getOrCreateUser"
    );
    const getUserSpy = jest.spyOn(UserRepository.prototype, "getUser");

    const nonceResp = await request(app)
      .get(`/auth/nonce/${mockEthAdress}`)
      .expect(200);

    expect(nonceResp.body).toEqual({ nonce: expect.any(String) });
    expect(nonceResp.body.nonce).toHaveLength(36);

    //construct and sign data
    const datav1: TypedDataV1 = [
      {
        type: "string",
        name: "nonce",
        value: nonceResp.body.nonce,
      },
    ];

    const signedMsg = signTypedData({
      privateKey: Buffer.from(mockPrivateKey, "hex"),
      data: datav1,
      version: SignTypedDataVersion.V1,
    });

    //new user info
    const newUserInfo = {
      address: mockEthAdress,
    };

    //after challenge, do login
    await request(app)
      .post(`/auth/login`)
      .send({ pubkey: mockEthAdress, signedmsg: signedMsg })
      .expect(200)
      .then(async (response) => {
        expect(response.header["set-cookie"][0]).toContain(
          "isAuthenticated=true;"
        );

        //check returned user
        const newUser: User = response.body;
        expect(newUser).toEqual(expect.objectContaining(newUserInfo));

        //check database for the new user
        const newUserFromDb = await genericRepo.getUser(newUser.id);
        expect(newUserFromDb).toEqual(newUser);

        //check database for new created space for this user
        const newSpace = await genericRepo.getSpaceByUser(newUser.id);
        expect(newSpace).toBeTruthy();
        expect(newSpace?.name).toEqual(newUser.address);
      });

    //expect repo to have been called
    expect(getOrCreateUserSpy).toHaveBeenCalledTimes(1);
    expect(getUserSpy).toHaveBeenCalledTimes(1);
  });

  it("Should login with existing user", async () => {
    const getOrCreateUserSpy = jest.spyOn(
      UserRepository.prototype,
      "getOrCreateUser"
    );
    const getUserSpy = jest.spyOn(UserRepository.prototype, "getUser");
    const onboardUserSpy = jest.spyOn(
      UserRepository.prototype as any,
      "onboardUser"
    );

    const existingUser1 = await genericRepo.getUserByAddress(user1Address);

    const nonceResp = await request(app)
      .get(`/auth/nonce/${user1Address}`)
      .expect(200);

    expect(nonceResp.body).toEqual({ nonce: expect.any(String) });
    expect(nonceResp.body.nonce).toHaveLength(36);

    //construct and sign data
    const datav1: TypedDataV1 = [
      {
        type: "string",
        name: "nonce",
        value: nonceResp.body.nonce,
      },
    ];

    const signedMsg = signTypedData({
      privateKey: Buffer.from(user1PrivateKey, "hex"),
      data: datav1,
      version: SignTypedDataVersion.V1,
    });

    //after challenge, do login
    await request(app)
      .post(`/auth/login`)
      .send({ pubkey: existingUser1?.address, signedmsg: signedMsg })
      .expect(200)
      .then(async (response) => {
        expect(response.header["set-cookie"][0]).toContain(
          "isAuthenticated=true;"
        );

        //check returned user
        const resUser: User = response.body;
        expect(resUser).toEqual(existingUser1);
      });

    //expect
    //get or create to have been called
    expect(getOrCreateUserSpy).toHaveBeenCalledTimes(1);
    //get user to have been called
    expect(getUserSpy).toHaveBeenCalledTimes(1);
    //BUT onboardUser to NOT have been called (existing user)
    expect(onboardUserSpy).not.toHaveBeenCalled();
  });
});
