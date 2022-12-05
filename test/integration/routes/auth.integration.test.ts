import request from "supertest";
import app from "../../../src/app";
import { User } from "@prisma/client";
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

jest.setTimeout(1000000);

describe("Auth Routes", () => {
  class GenericRepo extends Repository {
    public async getUser(id: number): Promise<User | null> {
      return this.execute<User | null>(async () => {
        return await this._prismaClient.user.findUnique({ where: { id } });
      });
    }
  }

  const genericRepo = new GenericRepo(new PrismaClient());

  beforeAll(async () => {});

  afterAll(async () => {});

  beforeEach(() => {
    resetDatabaseData();
  });

  it("Should register and authenticate new user", async () => {
    const getOrCreateUserSpy = jest.spyOn(
      UserRepository.prototype,
      "getOrCreateUser"
    );

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
      });

    //expect repo to have been called
    expect(getOrCreateUserSpy).toHaveBeenCalledTimes(1);
  });
});
