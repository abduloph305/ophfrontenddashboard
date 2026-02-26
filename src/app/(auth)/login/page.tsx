
"use client"

import { useState } from "react"
import { loginApi } from "@/modules/auth/auth.api"
import { useAuthStore } from "@/modules/auth/auth.store"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const setTokens = useAuthStore((s) => s.setTokens)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

//   const handleLogin = async () => {
//     try {
//       setLoading(true)
//       setError("")

//       const res = await loginApi({ email, password })

//       setTokens(res.data.accessToken, res.data.refreshToken)
//       router.push("/dashboard")
//     } catch (err: any) {
//       setError(err?.response?.data?.message || "Invalid credentials")
//     } finally {
//       setLoading(false)
//     }
//   }

// const handleLogin = async () => {
//   try {
//     console.log("🔥 Login started")
//     setLoading(true)
//     setError("")

//     console.log("📤 Sending:", { email, password })

//     const res = await loginApi({ email, password })

//     console.log("✅ Full response:", res)
//     console.log("✅ Response data:", res.data)
//     console.log("🔑 Access token:", res.data?.accessToken)
//     console.log("🔑 Refresh token:", res.data?.refreshToken)

//     if (!res.data?.accessToken || !res.data?.refreshToken) {
//       console.log("❌ Tokens missing!")
//       setError("Tokens not received")
//       return
//     }

//     console.log("💾 Setting tokens in store...")
//     setTokens(res.data.accessToken, res.data.refreshToken)

//     console.log("🚀 Redirecting to dashboard...")
//     router.push("/dashboard")

//     console.log("✅ router.push called")

//   } catch (err: any) {
//     console.log("❌ Login error:", err)
//     console.log("❌ Error response:", err?.response)

//     setError(err?.response?.data?.message || "Invalid credentials")
//   } finally {
//     console.log("🏁 Login finished")
//     setLoading(false)
//   }
// }

const handleLogin = async () => {
  try {
    setLoading(true)
    setError("")

    const res = await loginApi({ email, password })

    const { accessToken, refreshToken } = res.data

    
    setTokens(accessToken, refreshToken)

   
    document.cookie = `accessToken=${accessToken}; path=/`

    router.push("/dashboard")
  } catch (err: any) {
    setError(err?.response?.data?.message || "Invalid credentials")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-2 rounded-lg outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-2 rounded-lg outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end">
            <span
              onClick={() => router.push("/forgot-password")}
              className="text-sm text-indigo-600 hover:underline cursor-pointer"
            >
              Forgot Password?
            </span>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition font-medium"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-indigo-600 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}