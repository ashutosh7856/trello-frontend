import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { MoreHorizontal, Trash2 } from "lucide-react"

import { api, getErrorMessage } from "@/lib/api"
import type { Board, Card } from "@/lib/types"
import { useBoard } from "@/lib/queries"
import { CardItem } from "@/components/board/card-item"
import { AddCard } from "@/components/board/add-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function BoardColumn({
  spaceId,
  board,
  isAdmin,
  onCardClick,
}: {
  spaceId: string
  board: Board
  isAdmin: boolean
  onCardClick: (card: Card) => void
}) {
  const queryClient = useQueryClient()
  const { data, isLoading } = useBoard(spaceId, board.id)
  const cards = data?.cards ?? []

  const deleteBoard = useMutation({
    mutationFn: async () => {
      await api.delete(`/board/${board.id}/${spaceId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["space", spaceId] })
      toast.success("Board deleted")
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  return (
    <div className="bg-muted/40 flex max-h-full w-72 shrink-0 flex-col rounded-xl border">
      <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{board.title}</h3>
          <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-xs tabular-nums">
            {isLoading ? "…" : cards.length}
          </span>
        </div>
        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground"
                />
              }
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                variant="destructive"
                onClick={() => deleteBoard.mutate()}
              >
                <Trash2 className="size-4" />
                Delete board
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto px-3 pb-2">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </>
        ) : (
          cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onClick={() => onCardClick(card)}
            />
          ))
        )}
      </div>

      <div className="mt-auto p-2">
        <AddCard spaceId={spaceId} boardId={board.id} />
      </div>
    </div>
  )
}
