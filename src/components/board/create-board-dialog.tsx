import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loader2, Plus } from "lucide-react"

import { api, getErrorMessage } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function CreateBoardDialog({ spaceId }: { spaceId: string }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post(`/board/${spaceId}/create`, { title: title.trim(), spaceId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["space", spaceId] })
      toast.success("Board created")
      setTitle("")
      setOpen(false)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        <Plus className="size-4" />
        New board
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a board</DialogTitle>
          <DialogDescription>
            Boards act as columns — a stage, category, or workstream for your
            cards.
          </DialogDescription>
        </DialogHeader>
        <form
          id="create-board-form"
          onSubmit={(e) => {
            e.preventDefault()
            if (title.trim()) mutation.mutate()
          }}
          className="grid gap-1.5"
        >
          <Label htmlFor="board-title">Name</Label>
          <Input
            id="board-title"
            autoFocus
            value={title}
            placeholder="Backlog"
            onChange={(e) => setTitle(e.target.value)}
          />
        </form>
        <DialogFooter showCloseButton>
          <Button
            type="submit"
            form="create-board-form"
            disabled={mutation.isPending || !title.trim()}
          >
            {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
            Create board
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
