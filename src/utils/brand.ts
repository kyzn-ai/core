export declare const __brand: unique symbol
export interface BrandHelper<BrandKey> {
    [__brand]?: BrandKey
}
export type Brand<Type, BrandKey> = BrandHelper<BrandKey> & Type
