import request from "supertest";
import app from "../../../src/app";
import {
  signTypedData,
  SignTypedDataVersion,
  TypedDataV1,
} from "@metamask/eth-sig-util";
import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { CacheProvider, CacheType } from "../../../src/cache/cache.provider";
import { User } from "@prisma/client";
import UserRepository from "../../../src/db/repositories/user.repository";

const mockEthAdress = "0x62F87Ba3C0D00d1a6F0533d0309DB3720FF8AfFf";
const mockPubKey =
  "04f21b2b2fec758670c2906e685afa6bdec4a3655a2bcd5f12cabf0ebfbcc83d44eba21d1ba84e520cdd163d510a1e27f8f803c0ad941c7b50a91bd5e11556edaf";
const mockPrivateKey =
  "33310aabe472ccefd40a228ae0048b0bff11d10402f20397afac2908f69652e9";

describe("Auth Routes", () => {
  beforeAll(() => {});

  beforeEach(() => {});

  it("Should return nonce for signature challenge", async () => {
    await request(app)
      .get(`/auth/nonce/${mockEthAdress}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ nonce: expect.any(String) });
        expect(response.body.nonce).toHaveLength(36); //length of uuid4
      });
  });

  it("Should return user and authentication cookie after challenge", async () => {
    const nonce = uuidv4();
    CacheProvider.getCache(CacheType.AddressCache).set(mockEthAdress, nonce);

    const datav1: TypedDataV1 = [
      {
        type: "string",
        name: "nonce",
        value: nonce,
      },
    ];

    const signedMsg = signTypedData({
      privateKey: Buffer.from(mockPrivateKey, "hex"),
      data: datav1,
      version: SignTypedDataVersion.V1,
    });

    const user = {
      id: 1,
      address: mockEthAdress,
      name: "user1",
    };

    const getOrCreateUserSpy = jest
      .spyOn(UserRepository.prototype, "getOrCreateUser")
      .mockImplementation((): Promise<User> => {
        return new Promise<User>((res) => {
          return res(user);
        });
      });

    await request(app)
      .post(`/auth/login`)
      .send({ pubkey: mockEthAdress, signedmsg: signedMsg })
      .expect(200)
      .then((response) => {
        expect(response.header["set-cookie"][0]).toContain(
          "isAuthenticated=true;"
        );

        expect(response.body).toEqual(user);
      });

    expect(getOrCreateUserSpy).toBeCalledTimes(1);
  });

  it("Should return 401 for failed authentication", async () => {
    const nonce = uuidv4();
    CacheProvider.getCache(CacheType.AddressCache).set(mockEthAdress, nonce);

    const datav1: TypedDataV1 = [
      {
        type: "string",
        name: "nonce",
        value: nonce,
      },
    ];

    const signedMsg = signTypedData({
      privateKey: Buffer.from(mockPrivateKey, "hex"),
      data: datav1,
      version: SignTypedDataVersion.V1,
    });

    await request(app)
      .post(`/auth/login`)
      .send({
        //changing mock eth address to fail
        pubkey: `${mockEthAdress.substring(0, mockEthAdress.length - 5)}ffff`,
        signedmsg: signedMsg,
      })
      .expect(401);
  });
});
