export interface Segment {
  _id: string
  name: string
  description?: string
  rules: any[]
  logic: "AND" | "OR"
  contactCount: number
  lastCalculatedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateSegmentDto {
  name: string
  description?: string
  rules: any[]
  logic: "AND" | "OR"
}