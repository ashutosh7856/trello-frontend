import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loader2, Plus } from "lucide-react"

import { api, getErrorMessage } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function AddCard({
  spaceId,
  boardId,
}: {
  spaceId: string
  boardId: string
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post(`/board/${spaceId}/card/create`, {
        title: title.trim(),
        boardId,
        status: "PENDING",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", spaceId, boardId] })
      setTitle("")
      setOpen(false)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  function submit() {
    if (!title.trim()) return
    mutation.mutate()
  }

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground w-full justify-start"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" />
        Add card
      </Button>
    )
  }

  return (
    <div className="grid gap-2">
      <Textarea
        autoFocus
        value={title}
        rows={2}
        placeholder="What needs to be done?"
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            submit()
          }
          if (e.key === "Escape") setOpen(false)
        }}
      />
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={submit} disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
          Add
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setOpen(false)
            setTitle("")
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
