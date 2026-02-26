export interface Campaign {
  _id: string
  name: string
  type: string
  subject?: string
  previewText?: string
  htmlContent?: string
  segmentId?: string
  status: "draft" | "scheduled" | "processing" | "sent" | "paused"
  scheduledAt?: string
  timezone?: string
  emailBlocks?: any[]
  createdAt: string
  updatedAt: string
}

export interface CreateCampaignDto {
  name: string
  type: string
  subject: string
  previewText?: string
  htmlContent: string
  emailBlocks?: any[]
  segmentId: string
  timezone?: string
  status?: string
  scheduledAt?: string
}

export interface ABTest {
  _id: string
  name: string
  testType: "subject_line" | "content" | "send_time" | "cta"
  campaignId: string
  variants: {
    label: string
    description: string
    segmentSize: number
  }[]
  testDuration: number
  winningMetric: "open_rate" | "click_rate" | "conversion_rate"
  status: "active" | "completed" | "draft"
  createdAt: string
}

export interface CreateABTestDto {
  name: string
  testType: string
  campaignId: string
  variants: any[]
  testDuration: number
  winningMetric: string
}