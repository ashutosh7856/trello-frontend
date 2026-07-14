import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

export function Loader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] w-full items-center justify-center",
        className
      )}
    >
      <Loader2 className="text-muted-foreground size-6 animate-spin" />
    </div>
  )
}
