// import crypto from 'node:crypto'
import bcrypto from 'bcrypt'

const { CRYPTO_SECRET_KEY, IV_SECRET_KEY } = process.env

if (!CRYPTO_SECRET_KEY || !IV_SECRET_KEY) {
  throw new Error('secretKey and secretIV are required')
}

export async function encryptPassword(password: string) {
  const salt = await bcrypto.genSalt(10)
  const encrypted = await bcrypto.hash(password, salt)
  return encrypted
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypto.compare(password, hash)
}

// const key = crypto
//   .createHash('sha512')
//   .update(CRYPTO_SECRET_KEY)
//   .digest('hex')
//   .substring(0, 32)

// const encryptionIV = crypto
//   .createHash('sha512')
//   .update(IV_SECRET_KEY)
//   .digest('hex')
//   .substring(0, 16)

// // Encrypt data
// export function encryptData(data: string, publicKey?: string) {
//   const cipher = crypto.createCipheriv(
//     'aes-256-cbc',
//     publicKey ?? key,
//     encryptionIV
//   )
//   return Buffer.from(
//     cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
//   ).toString('base64')
// }

// // Decrypt data
// export function decryptData(encryptedData: string, publicKey?: string) {
//   const buff = Buffer.from(encryptedData, 'base64')
//   const decipher = crypto.createDecipheriv(
//     'aes-256-cbc',
//     publicKey ?? key,
//     encryptionIV
//   )
//   return (
//     decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
//     decipher.final('utf8')
//   )
// }
