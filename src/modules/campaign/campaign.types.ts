export interface Campaign {
  _id: string
  name: string
  segmentId: string
  message: string
  createdAt: string
}

export interface CreateCampaignDto {
  name: string
  segmentId: string
  message: string
}