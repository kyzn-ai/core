

/**
 * @description Creates a union type from the elements of an array.
 */
export type ArrayElementUnion<T extends readonly unknown[]> = T[number]