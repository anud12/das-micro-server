type IsStrictlyAny<T> = (T extends never ? true : false) extends false ? false : true;

export type RecursiveTreeMap<Tree extends object | Primitive | unknown, Primitive = unknown > =
  IsStrictlyAny<Tree> extends true
    ? Primitive
    : {
      [P in keyof Tree]: Tree[P] extends object
        ? RecursiveTreeMap<Tree[P], Primitive>
        : Primitive
    }