import { IImage } from ".."
export type IProduct =  {
    id?: number
    name: string
    price: number
    stock: number,
    description: string
    images?: IImage[]
}