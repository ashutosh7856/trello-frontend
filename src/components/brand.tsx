import { SquareKanban } from "lucide-react"

import { cn } from "@/lib/utils"

export function Brand({
  className,
  showText = true,
}: {
  className?: string
  showText?: boolean
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
        <SquareKanban className="size-4" />
      </div>
      {showText && (
        <span className="text-base font-semibold tracking-tight">
          Flowboard
        </span>
      )}
    </div>
  )
}
