import { Routes, Route, Navigate } from "react-router-dom"

import { ProtectedRoute, PublicOnlyRoute } from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import LoginPage from "@/pages/login"
import RegisterPage from "@/pages/register"
import DashboardPage from "@/pages/dashboard"
import SpacePage from "@/pages/space"
import InvitesPage from "@/pages/invites"
import NotFoundPage from "@/pages/not-found"

function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/spaces/:spaceId" element={<SpacePage />} />
          <Route path="/invites" element={<InvitesPage />} />
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default App
