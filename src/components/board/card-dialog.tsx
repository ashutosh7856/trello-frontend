import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loader2, Trash2, UserPlus } from "lucide-react"

import { api, getErrorMessage } from "@/lib/api"
import type { Card, Status } from "@/lib/types"
import { STATUSES, statusMap } from "@/lib/statuses"
import { initials } from "@/lib/utils"
import { StatusBadge } from "@/components/board/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

interface CardDialogProps {
  spaceId: string
  card: Card | null
  canDelete: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CardDialog({
  spaceId,
  card,
  canDelete,
  open,
  onOpenChange,
}: CardDialogProps) {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [status, setStatus] = useState<Status>("PENDING")
  const [assignee, setAssignee] = useState("")

  useEffect(() => {
    if (card) {
      setTitle(card.title)
      setDesc(card.desc ?? "")
      setStatus(card.status)
      setAssignee(card.assignedemailId ?? "")
    }
  }, [card])

  function invalidate() {
    if (card) {
      queryClient.invalidateQueries({
        queryKey: ["board", spaceId, card.boardId],
      })
    }
  }

  const save = useMutation({
    mutationFn: async () => {
      if (!card) return
      await api.put(`/board/${spaceId}/card/${card.id}`, {
        title,
        desc,
        status,
      })
    },
    onSuccess: () => {
      invalidate()
      toast.success("Card updated")
      onOpenChange(false)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const assign = useMutation({
    mutationFn: async () => {
      if (!card) return
      await api.patch(`/board/${spaceId}/card/assign`, {
        cardId: card.id,
        email: assignee.trim(),
      })
    },
    onSuccess: () => {
      invalidate()
      toast.success("Assignee updated")
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const remove = useMutation({
    mutationFn: async () => {
      if (!card) return
      await api.delete(`/board/${spaceId}/card/${card.id}`)
    },
    onSuccess: () => {
      invalidate()
      toast.success("Card deleted")
      onOpenChange(false)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="sr-only">Card details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="card-title">Title</Label>
            <Input
              id="card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base font-medium"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="card-desc">Description</Label>
            <Textarea
              id="card-desc"
              value={desc}
              rows={4}
              placeholder="Add more detail to this task…"
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as Status)}
            >
              <SelectTrigger className="w-48">
                <StatusBadge status={status} />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {statusMap[s.value].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="grid gap-1.5">
            <Label htmlFor="card-assignee">Assignee</Label>
            <div className="flex items-center gap-2">
              {card?.assignedemailId && (
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="text-xs">
                    {initials(card.assignedemailId)}
                  </AvatarFallback>
                </Avatar>
              )}
              <Input
                id="card-assignee"
                type="email"
                value={assignee}
                placeholder="teammate@example.com"
                onChange={(e) => setAssignee(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => assign.mutate()}
                disabled={assign.isPending || !assignee.trim()}
              >
                {assign.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <UserPlus className="size-4" />
                )}
                Assign
              </Button>
            </div>
          </div>
        </div>

        <div className="-mx-4 -mb-4 mt-2 flex items-center justify-between gap-2 rounded-b-xl border-t bg-muted/50 p-4">
          <div>
            {canDelete && (
              <Button
                variant="destructive"
                onClick={() => remove.mutate()}
                disabled={remove.isPending}
              >
                {remove.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Delete
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending && <Loader2 className="size-4 animate-spin" />}
              Save changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
