import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, KanbanSquare, Lock } from "lucide-react"

import { useSpace } from "@/lib/queries"
import type { Card } from "@/lib/types"
import { Loader } from "@/components/loader"
import { EmptyState } from "@/components/empty-state"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { BoardColumn } from "@/components/board/board-column"
import { CardDialog } from "@/components/board/card-dialog"
import { CreateBoardDialog } from "@/components/board/create-board-dialog"
import { InviteMembersDialog } from "@/components/board/invite-members-dialog"

export default function SpacePage() {
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data, isLoading, isError } = useSpace(spaceId)
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const [cardOpen, setCardOpen] = useState(false)

  if (isLoading) return <Loader />

  if (isError || !data) {
    return (
      <EmptyState
        icon={<Lock className="size-5" />}
        title="You don't have access to this space"
        description="It may have been removed, or you're not a member yet."
        action={
          <Link to="/" className={buttonVariants({ variant: "outline" })}>
            Back to spaces
          </Link>
        }
      />
    )
  }

  const { space, role } = data
  const isAdmin = role === "ADMIN"
  const boards = space.boards ?? []

  function openCard(card: Card) {
    setActiveCard(card)
    setCardOpen(true)
  }

  return (
    <div className="flex h-[calc(100svh-8rem)] flex-col">
      <div className="mb-5">
        <Link
          to="/"
          className="text-muted-foreground hover:text-foreground mb-2 inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-3.5" />
          Spaces
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">
                {space.title}
              </h1>
              <Badge variant={isAdmin ? "default" : "secondary"}>
                {isAdmin ? "Admin" : "Member"}
              </Badge>
            </div>
            {space.desc?.trim() && (
              <p className="text-muted-foreground text-sm">{space.desc}</p>
            )}
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <InviteMembersDialog spaceId={space.id} />
              <CreateBoardDialog spaceId={space.id} />
            </div>
          )}
        </div>
      </div>

      {boards.length === 0 ? (
        <EmptyState
          className="flex-1"
          icon={<KanbanSquare className="size-5" />}
          title="No boards yet"
          description={
            isAdmin
              ? "Create your first board to start adding cards."
              : "An admin hasn't set up any boards in this space yet."
          }
          action={isAdmin ? <CreateBoardDialog spaceId={space.id} /> : undefined}
        />
      ) : (
        <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
          {boards.map((board) => (
            <BoardColumn
              key={board.id}
              spaceId={space.id}
              board={board}
              isAdmin={isAdmin}
              onCardClick={openCard}
            />
          ))}
        </div>
      )}

      <CardDialog
        spaceId={space.id}
        card={activeCard}
        canDelete={isAdmin}
        open={cardOpen}
        onOpenChange={setCardOpen}
      />
    </div>
  )
}
