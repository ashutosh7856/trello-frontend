import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loader2, UserPlus, Mail } from "lucide-react"

import { api, getErrorMessage } from "@/lib/api"
import { useSpaceInvites } from "@/lib/queries"
import { initials } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const inviteStatusVariant = {
  PENDING: "secondary",
  ACCEPTED: "default",
  REJECTED: "outline",
} as const

export function InviteMembersDialog({ spaceId }: { spaceId: string }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const queryClient = useQueryClient()
  const { data: invites, isLoading } = useSpaceInvites(spaceId, open)

  const invite = useMutation({
    mutationFn: async () => {
      await api.post(
        `/space/invite/${spaceId}/${encodeURIComponent(email.trim())}`
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["space-invites", spaceId] })
      toast.success("Invite sent")
      setEmail("")
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        <UserPlus className="size-4" />
        Invite
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite people</DialogTitle>
          <DialogDescription>
            Send an invite by email. They&apos;ll join as a member once they
            accept.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (email.trim()) invite.mutate()
          }}
          className="grid gap-1.5"
        >
          <Label htmlFor="invite-email">Email address</Label>
          <div className="flex items-center gap-2">
            <Input
              id="invite-email"
              type="email"
              autoFocus
              value={email}
              placeholder="teammate@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" disabled={invite.isPending || !email.trim()}>
              {invite.isPending && <Loader2 className="size-4 animate-spin" />}
              Send
            </Button>
          </div>
        </form>

        <Separator />

        <div className="grid gap-2">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Invitations
          </p>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading…</p>
          ) : invites && invites.length > 0 ? (
            <ul className="grid max-h-56 gap-1.5 overflow-y-auto">
              {invites.map((inv) => (
                <li
                  key={inv.id}
                  className="flex items-center justify-between gap-2 rounded-lg border p-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-[10px]">
                        {initials(inv.emailId)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm">{inv.emailId}</span>
                  </div>
                  <Badge variant={inviteStatusVariant[inv.status]}>
                    {inv.status.toLowerCase()}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted-foreground flex items-center gap-2 rounded-lg border border-dashed p-3 text-sm">
              <Mail className="size-4" />
              No invitations sent yet.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
