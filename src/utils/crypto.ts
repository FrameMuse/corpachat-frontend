import CryptoJS from "crypto-js"

export function encrypt(input: string, secret: string): string {
  return CryptoJS.AES.encrypt(input, secret).toString(CryptoJS.format.OpenSSL)
}

export function decrypt(input: string, secret: string): string | null {
  try {
    const result = CryptoJS.AES.decrypt(input, secret, { format: CryptoJS.format.OpenSSL }).toString(CryptoJS.enc.Utf8)
    return result === "" ? null : result
  } catch (error) {
    // if (process.env.NODE_ENV === "development") {
    //   console.error(error)
    // }

    return null
  }
}