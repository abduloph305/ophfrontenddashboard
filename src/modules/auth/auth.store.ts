import { create, StateCreator } from "zustand"
import { persist } from "zustand/middleware"

export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  hasHydrated: boolean
  setTokens: (accessToken: string, refreshToken: string) => void
  clearTokens: () => void
  logout: () => void
  setHasHydrated: (state: boolean) => void
}

const authStore: StateCreator<AuthState, [["zustand/persist", unknown]]> = (set) => ({
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
})

export const useAuthStore = create<AuthState>()(
  persist(authStore, {
    name: "auth-storage",
    onRehydrateStorage: () => (state) => {
      state?.setHasHydrated(true)
    },
  })
)