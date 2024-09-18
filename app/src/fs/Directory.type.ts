import {SpawnSyncReturns} from "child_process";
import {RecursiveTreeMap} from "./recursiveTreeMap.type";

export type Directory<Tree extends object | Primitive = object, Primitive = string, T extends RecursiveTreeMap<Tree, Primitive> = RecursiveTreeMap<Tree, Primitive>> = {
  absolutePath: () => string
  relativePath: () => string
  exists: (name: string) => boolean
  navigateInto: (name: string) => Directory<Tree, Primitive> | undefined
  findMatchingPath: (path: string) => Directory<Tree, Primitive> | undefined
  read: (path: string) => string | undefined,
  run: (path: string, processArguments: unknown) => SpawnSyncReturns<Buffer> | undefined,
}
