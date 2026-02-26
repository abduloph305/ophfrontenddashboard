// import axios from "axios"
// import { useAuthStore } from "@/modules/auth/auth.store"

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
// })

// console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)

// api.interceptors.request.use((config) => {
//   const token = useAuthStore.getState().accessToken
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// export default api


import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Get token from localStorage or cookies
const getToken = () => {
  if (typeof window === "undefined") return null

  // Try localStorage first
  const token = localStorage.getItem("accessToken")
  if (token) return token

  // Try cookies
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))

  return match?.split("=")[1]
}

// Fetch dev token if in development
const initializeDevToken = async () => {
  if (typeof window === "undefined") return

  const existingToken = getToken()
  if (existingToken) return

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/dev-token`)
    if (response.ok) {
      const data = await response.json()
      localStorage.setItem("accessToken", data.accessToken)
    }
  } catch (error) {
    console.error("Failed to get dev token:", error)
  }
}

// Initialize dev token on first load
if (typeof window !== "undefined") {
  initializeDevToken()
}

api.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api