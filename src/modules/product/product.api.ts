import api from "@/lib/axios"
import { CreateProductDto } from "./product.types"

export const getProductsApi = () =>
  api.get("/products")

export const createProductApi = (data: CreateProductDto) =>
  api.post("/products", data)