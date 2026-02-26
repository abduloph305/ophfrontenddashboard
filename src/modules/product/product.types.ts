export interface Product {
  _id: string
  name: string
  price: number
  category: string
  isBestSeller: boolean
  createdAt: string
}

export interface CreateProductDto {
  name: string
  price: number
  category: string
  isBestSeller?: boolean
}