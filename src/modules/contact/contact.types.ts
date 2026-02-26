export interface Contact {
  _id: string
  name: string
  email: string
  phone?: string
  createdAt: string
}

export interface CreateContactDto {
  name: string
  email: string
  phone?: string
}