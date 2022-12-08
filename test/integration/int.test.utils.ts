import request from "supertest";
import express from "express";
import {
  signTypedData,
  SignTypedDataVersion,
  TypedDataV1,
} from "@metamask/eth-sig-util";
import * as ChildProcess from "child_process";
const execSync = ChildProcess.execSync;

export function resetDatabaseData() {
  execSync(
    `psql -f ${__dirname}/testdata.sql postgresql://postgres:postgres@localhost:5555/postgres`
  );
}

export async function authenticateUser(
  app: express.Express,
  address: string,
  privateKey: string
): Promise<any> {
  const nonceResp = await request(app).get(`/auth/nonce/${address}`);

  //construct and sign data
  const datav1: TypedDataV1 = [
    {
      type: "string",
      name: "nonce",
      value: nonceResp.body.nonce,
    },
  ];

  const signedMsg = signTypedData({
    privateKey: Buffer.from(privateKey, "hex"),
    data: datav1,
    version: SignTypedDataVersion.V1,
  });

  let cookie: any;

  //after challenge, do login
  await request(app)
    .post(`/auth/login`)
    .send({ pubkey: address, signedmsg: signedMsg })
    .then((res) => {
      cookie = res.headers["set-cookie"].pop().split(";")[0];
    });

  return cookie;
}

export const mockData = {
  mockEthAdress: "0x62F87Ba3C0D00d1a6F0533d0309DB3720FF8AfFf",
  mockPrivateKey:
    "33310aabe472ccefd40a228ae0048b0bff11d10402f20397afac2908f69652e9",
  user1Address: "0x9fB48802C9c9A187Df19AF823a792b909bec8576",
  user1PrivateKey:
    "9ecf871857bd4a1b0aa41a7a0880428bb665e6400b45d20846d95906ac98b035",
};
