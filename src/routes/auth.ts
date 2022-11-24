import express, { Request, Response } from "express";
import { CacheProvider, CacheType } from "../../src/cache/cache.provider";
import { v4 as uuidv4 } from "uuid";
import {
  recoverTypedSignature,
  TypedDataV1,
  SignTypedDataVersion,
} from "@metamask/eth-sig-util";

declare module "express-session" {
  export interface SessionData {
    isAuthenticated: boolean;
  }
}

const router = express.Router();

const addressCache = CacheProvider.getCache(CacheType.AddressCache);

router.get(
  "/nonce/:pubkey",
  (req: Request<{ pubkey: string }>, res: Response<{ nonce: string }>) => {
    const nonce = uuidv4();
    addressCache.set(req.params.pubkey, nonce);
    res.send({ nonce });
  }
);

/**
 * Checks if user is authenticated by recovering the public key from the signed message and comparing to the provided key
 *
 * @param publicKey
 * @param signedMessage
 * @param nonce
 * @returns
 */
const authenticateWalletUser = (
  publicKey: string,
  signedMessage: string,
  nonce: string
) => {
  const datav1: TypedDataV1 = [
    {
      type: "string",
      name: "nonce",
      value: nonce,
    },
  ];

  try {
    const recoveredAdress = recoverTypedSignature({
      data: datav1,
      signature: signedMessage,
      version: SignTypedDataVersion.V1,
    });

    return recoveredAdress.toUpperCase() === publicKey.toUpperCase();
  } catch (err) {
    console.error(err);
    return false;
  }
};

router.post(
  "/login",
  (
    req: Request<{}, {}, { pubkey: string; signedmsg: string }>,
    res: Response<{ result: Boolean }>
  ) => {
    const pubkey = req.body.pubkey;
    const signedMsg = req.body.signedmsg;
    const nonce = addressCache.get(pubkey);

    //authenticate user through his wallet address
    const userIsAuthd = authenticateWalletUser(pubkey, signedMsg, nonce);

    //set session
    if (userIsAuthd) {
      req.session.isAuthenticated = true;
      res.cookie("isAuthenticated", true, {
        maxAge: req.session.cookie.maxAge,
        httpOnly: false,
      });
      res.status(200).send();
    } else {
      console.error(`could not login...`);
      res.status(401).send();
    }
  }
);

export default router;
