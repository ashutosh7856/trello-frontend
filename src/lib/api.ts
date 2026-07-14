import axios from "axios"

export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ?? "http://localhost:3001"

/** Backend mounts the REST API under /api/v1 and uses an httpOnly cookie. */
export const api = axios.create({
  baseURL: `${API_ORIGIN}/api/v1`,
  withCredentials: true,
})

/** Google OAuth lives outside the /api/v1 prefix. */
export const googleAuthUrl = `${API_ORIGIN}/google`

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { message?: unknown; error?: unknown }
      | undefined
    const msg = data?.message ?? data?.error
    if (typeof msg === "string") return msg
    if (Array.isArray(msg) && msg[0]?.message) return String(msg[0].message)
    return err.message
  }
  if (err instanceof Error) return err.message
  return "Something went wrong"
}
