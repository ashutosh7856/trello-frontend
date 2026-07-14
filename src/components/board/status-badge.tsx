import type { Status } from "@/lib/types"
import { statusMap } from "@/lib/statuses"
import { cn } from "@/lib/utils"

export function StatusBadge({
  status,
  className,
}: {
  status: Status
  className?: string
}) {
  const meta = statusMap[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        meta.badge,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  )
}
