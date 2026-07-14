import type { Card } from "@/lib/types"
import { initials } from "@/lib/utils"
import { StatusBadge } from "@/components/board/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function CardItem({
  card,
  onClick,
}: {
  card: Card
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-card hover:border-foreground/20 focus-visible:ring-ring/50 group w-full rounded-lg border p-3 text-left shadow-xs transition-colors focus-visible:ring-3 focus-visible:outline-none"
    >
      <p className="line-clamp-2 text-sm font-medium">{card.title}</p>
      {card.desc?.trim() && (
        <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
          {card.desc}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <StatusBadge status={card.status} />
        {card.assignedemailId && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Avatar className="size-6">
                  <AvatarFallback className="text-[10px]">
                    {initials(card.assignedemailId)}
                  </AvatarFallback>
                </Avatar>
              }
            />
            <TooltipContent>{card.assignedemailId}</TooltipContent>
          </Tooltip>
        )}
      </div>
    </button>
  )
}
