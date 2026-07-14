import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"
import type { User } from "@/lib/types"

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function fetchMe(): Promise<User | null> {
  try {
    const { data } = await api.get<User>("/user/me")
    return data
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  const logout = useCallback(async () => {
    // Best-effort: the session cookie is httpOnly, so clearing it requires the
    // server. Falls through cleanly whether or not that route exists yet.
    try {
      await api.post("/user/logout")
    } catch {
      /* ignore */
    }
    queryClient.setQueryData(["me"], null)
    queryClient.clear()
  }, [queryClient])

  return (
    <AuthContext.Provider value={{ user: data ?? null, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
