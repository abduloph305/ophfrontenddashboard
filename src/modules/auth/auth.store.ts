// import { create } from "zustand"

// interface AuthState {
//   accessToken: string | null
//   refreshToken: string | null
//   setTokens: (a: string, r: string) => void
//   logout: () => void
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   accessToken: null,
//   refreshToken: null,
//   setTokens: (a, r) =>
//     set({ accessToken: a, refreshToken: r }),
//   logout: () =>
//     set({ accessToken: null, refreshToken: null }),
// }))

import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      hasHydrated: false,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      clearTokens: () =>
        set({ accessToken: null, refreshToken: null }),

      logout: () => {
        // Clear cookies
        if (typeof document !== "undefined") {
          document.cookie = "accessToken=; Max-Age=0; path=/;"
          document.cookie = "refreshToken=; Max-Age=0; path=/;"
        }
        // Clear store
        set({ accessToken: null, refreshToken: null })
      },

      setHasHydrated: (state: boolean) =>
        set({ hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)