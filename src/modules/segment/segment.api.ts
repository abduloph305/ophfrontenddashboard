import api from "@/lib/axios"
import { CreateSegmentDto } from "./segment.types"

export const getSegmentsApi = () =>
  api.get("/segments")

export const createSegmentApi = (data: CreateSegmentDto) =>
  api.post("/segments", data)