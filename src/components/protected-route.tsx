import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "@/lib/auth"
import { Loader } from "@/components/loader"

export function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <Loader />
  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return <Outlet />
}

export function PublicOnlyRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <Loader />
  if (user) return <Navigate to="/" replace />

  return <Outlet />
}
