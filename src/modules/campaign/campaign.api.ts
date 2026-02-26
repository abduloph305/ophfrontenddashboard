import api from "@/lib/axios"
import { CreateCampaignDto } from "./campaign.types"

export const getCampaignsApi = (params?: any) =>
  api.get("/campaigns", { params })

export const getCampaignApi = (id: string) =>
  api.get(`/campaigns/${id}`)

export const createCampaignApi = (data: CreateCampaignDto) =>
  api.post("/campaigns", data)

export const updateCampaignApi = (id: string, data: Partial<CreateCampaignDto>) =>
  api.put(`/campaigns/${id}`, data)

export const deleteCampaignApi = (id: string) =>
  api.delete(`/campaigns/${id}`)

// Campaign Sending
export const sendCampaignNowApi = (id: string) =>
  api.post(`/campaigns/${id}/send`)

export const scheduleCampaignApi = (id: string, scheduledAt: Date) =>
  api.post(`/campaigns/${id}/schedule`, { scheduledAt })

export const pauseCampaignApi = (id: string) =>
  api.post(`/campaigns/${id}/pause`)

export const resumeCampaignApi = (id: string) =>
  api.post(`/campaigns/${id}/resume`)

// Analytics
export const getCampaignAnalyticsApi = (id: string) =>
  api.get(`/campaigns/${id}/analytics`)

// Templates
export const getTemplatesApi = () =>
  api.get("/campaigns/templates/list")

export const cloneCampaignApi = (id: string, name: string) =>
  api.post(`/campaigns/${id}/clone`, { name })

export const saveAsTemplateApi = (id: string, templateName: string) =>
  api.post(`/campaigns/${id}/save-template`, { templateName })

export const loadTemplateApi = (campaignId: string, templateId: string) =>
  api.post(`/campaigns/${campaignId}/load-template`, { templateId })

// A/B Testing
export const createABTestApi = (data: any) =>
  api.post("/campaigns/ab-test/create", data)

export const getABTestsApi = () =>
  api.get("/campaigns/ab-test")

export const getABTestApi = (id: string) =>
  api.get(`/campaigns/ab-test/${id}`)

export const getABTestPerformanceApi = (id: string) =>
  api.get(`/campaigns/ab-test/${id}/performance`)

export const startABTestApi = (id: string) =>
  api.post(`/campaigns/ab-test/${id}/start`)

export const completeABTestApi = (id: string, winnerId: string, improvement: number) =>
  api.post(`/campaigns/ab-test/${id}/complete`, {
    winnerId,
    improvementPercentage: improvement,
  })