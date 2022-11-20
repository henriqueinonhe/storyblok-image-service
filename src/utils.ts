export type Xor<T extends {}, U extends {}> =
  | (T & {
      [Key in keyof U]?: never;
    })
  | (U & {
      [Key in keyof T]?: never;
    });
