export interface Segment {
  _id: string
  name: string
  rules: any[]
  createdAt: string
}

export interface CreateSegmentDto {
  name: string
  rules: any[]
}