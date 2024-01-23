import { IProduct } from ".."

export type ICart = {
    productId: IProduct['id'],
    quantity: number,
    accountId: number
}