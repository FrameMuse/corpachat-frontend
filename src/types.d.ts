export type URLType = `${string}://${string}` | URLData


export type URLData = `data:${string};${string}`
export type URLDataBase64 = `data:${string};base64,${string}`


export type OrderingType<U extends string> = U | `-${U}`

// https://stackoverflow.com/questions/50158272/what-is-the-type-of-an-enum-in-typescript
export type Enum<E> = Record<keyof E, number | string> & { [k: number]: string }