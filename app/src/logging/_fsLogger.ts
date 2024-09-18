export const toFS = Symbol("toFS")
export const updateFS = Symbol("updateFS")
export type FsLoggerObject = {
  [P in string]: unknown
} & {
  _type: string
}

export type FsLogger<T = unknown> = T & {
  [toFS]: () => FsLoggerObject
  [updateFS]: () => void
}