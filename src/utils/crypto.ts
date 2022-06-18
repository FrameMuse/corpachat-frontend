import CryptoJS from "crypto-js"

export function encrypt(input: string | CryptoJS.lib.WordArray, secret: string): string {
  return CryptoJS.Rabbit.encrypt(input, secret).toString()
}

export function decrypt(input: string, secret: string): string | null {
  try {
    const result = CryptoJS.Rabbit.decrypt(input, secret).toString(CryptoJS.enc.Utf8)
    return result === "" ? null : result
  } catch (error) {
    // if (process.env.NODE_ENV === "development") {
    //   console.error(error)
    // }

    return null
  }
}

export function decryptPure(input: string, secret: string): number[] {
  try {
    return CryptoJS.Rabbit.decrypt(input, secret).words
  } catch (error) {
    // if (process.env.NODE_ENV === "development") {
    //   console.error(error)
    // }

    return []
  }
}