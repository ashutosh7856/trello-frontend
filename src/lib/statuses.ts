import type { Status } from "@/lib/types"

export interface StatusMeta {
  value: Status
  label: string
  /** Tailwind classes for the dot/badge accent. */
  dot: string
  badge: string
}

export const STATUSES: StatusMeta[] = [
  {
    value: "PENDING",
    label: "To do",
    dot: "bg-amber-500",
    badge:
      "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  {
    value: "ONGOING",
    label: "In progress",
    dot: "bg-blue-500",
    badge:
      "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  },
  {
    value: "DONE",
    label: "Done",
    dot: "bg-emerald-500",
    badge:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
]

export const statusMap: Record<Status, StatusMeta> = Object.fromEntries(
  STATUSES.map((s) => [s.value, s])
) as Record<Status, StatusMeta>
