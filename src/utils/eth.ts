import {
  recoverTypedSignature,
  TypedDataV1,
  SignTypedDataVersion,
} from "@metamask/eth-sig-util";

/**
 * Checks if user is authenticated by recovering the public key from the signed message and comparing to the provided key
 *
 * @param publicKey
 * @param signedMessage
 * @param nonce
 * @returns
 */
export const authenticateWalletUser = (
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
