import { User } from "@/types"
import { create } from "zustand"

type UserStore = {
  profile: User | null
  isAuthenticated: boolean
  setUser: (profile: User) => void
  setAuthenticated: (state: boolean) => void
}

export const useUser = create<UserStore>((set) => ({
  profile: null,
  isAuthenticated: false,
  setUser: (profile: User) => set({ profile }),
  setAuthenticated: (state: boolean) => set({ isAuthenticated: state }),
}))
