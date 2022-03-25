import crypto from 'crypto';

export function rsa_4096_gen() {
  // The `generateKeyPairSync` method accepts two arguments:
  // 1. The type ok keys we want, which in this case is "rsa"
  // 2. An object with the properties of the key
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    // The standard secure default length for RSA keys is 4096 bits
    // It is recommended to encode public keys as `'spki'` and private keys as`'pkcs8'` with encryption for long-term storage:
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      // May use password the shalted
      // cipher: 'aes-256-cbc',
      // passphrase: 'top secret'
    }
  });
  return [privateKey, publicKey];
}

export function rsa_4096_encrypt(publicKey: string, data: string | Buffer) {
  const data_encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "SHA256",
    },
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from(data)
  );
  return data_encrypted;
}

export function rsa_4096_decrypt(privateKey: string, data: string) {
  const data_decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      // In order to decrypt the data, we need to specify the
      // same hashing function and padding scheme that we used to
      // encrypt the data in the previous step
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "SHA256",
    },
    Buffer.from(data, 'base64'),
  );
  return data_decrypted;
}
