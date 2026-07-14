import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Check, Inbox, Loader2, X } from "lucide-react"

import { api, getErrorMessage } from "@/lib/api"
import { useInvites } from "@/lib/queries"
import type { Invite } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function InviteRow({ invite }: { invite: Invite }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const isPending = invite.status === "PENDING"

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["invites"] })
    queryClient.invalidateQueries({ queryKey: ["spaces"] })
  }

  const accept = useMutation({
    mutationFn: async () => {
      await api.post(`/space/invite/join/${invite.id}`)
    },
    onSuccess: () => {
      refresh()
      toast.success("Invitation accepted")
      navigate(`/spaces/${invite.spaceId}`)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const reject = useMutation({
    mutationFn: async () => {
      await api.post(`/space/invite/reject/${invite.id}`)
    },
    onSuccess: () => {
      refresh()
      toast.success("Invitation declined")
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">You've been invited to a space</p>
          <p className="text-muted-foreground text-xs">
            Invited {formatDate(invite.createdAt)} · Space{" "}
            <span className="font-mono">{invite.spaceId.slice(0, 8)}</span>
          </p>
        </div>

        {isPending ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => reject.mutate()}
              disabled={reject.isPending || accept.isPending}
            >
              {reject.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <X className="size-4" />
              )}
              Decline
            </Button>
            <Button
              size="sm"
              onClick={() => accept.mutate()}
              disabled={accept.isPending || reject.isPending}
            >
              {accept.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Accept
            </Button>
          </div>
        ) : (
          <Badge variant={invite.status === "ACCEPTED" ? "default" : "outline"}>
            {invite.status.toLowerCase()}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

export default function InvitesPage() {
  const { data: invites, isLoading, isError } = useInvites()

  const pending = invites?.filter((i) => i.status === "PENDING") ?? []
  const past = invites?.filter((i) => i.status !== "PENDING") ?? []

  return (
    <div>
      <PageHeader
        title="Invites"
        description="Spaces other people have invited you to collaborate on."
      />

      {isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={<Inbox className="size-5" />}
          title="Couldn't load invites"
          description="Please try again in a moment."
        />
      ) : invites && invites.length > 0 ? (
        <div className="grid gap-6">
          {pending.length > 0 && (
            <section className="grid gap-3">
              {pending.map((invite) => (
                <InviteRow key={invite.id} invite={invite} />
              ))}
            </section>
          )}
          {past.length > 0 && (
            <section className="grid gap-3">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Earlier
              </p>
              {past.map((invite) => (
                <InviteRow key={invite.id} invite={invite} />
              ))}
            </section>
          )}
        </div>
      ) : (
        <EmptyState
          icon={<Inbox className="size-5" />}
          title="No invites right now"
          description="When a teammate invites you to a space, it'll show up here."
        />
      )}
    </div>
  )
}
