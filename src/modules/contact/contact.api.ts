import api from "@/lib/axios"
import { CreateContactDto } from "./contact.types"

export const getContactsApi = () =>
  api.get("/contacts")

export const createContactApi = (data: CreateContactDto) =>
  api.post("/contacts", data)