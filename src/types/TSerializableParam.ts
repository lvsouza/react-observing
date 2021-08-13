type Primitive = undefined | null | boolean | number | symbol | string;

export type TSerializableParam =
  | Primitive
  | { toJSON: () => string }
  | ReadonlyArray<TSerializableParam>
  | Readonly<{ [key: string]: TSerializableParam }>;
