import api from "@/lib/axios"
import { LoginDto, RegisterDto } from "./auth.types"

export const loginApi = (data: LoginDto) =>
  api.post("/auth/login", data)

export const registerApi = (data: RegisterDto) =>
  api.post("/auth/register", data)