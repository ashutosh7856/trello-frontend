import { Link } from "react-router-dom"
import { LayoutGrid, FolderKanban } from "lucide-react"

import { useSpaces } from "@/lib/queries"
import type { SpaceMembership } from "@/lib/types"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { CreateSpaceDialog } from "@/components/create-space-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function RoleBadge({ role }: { role: SpaceMembership["role"] }) {
  return (
    <Badge variant={role === "ADMIN" ? "default" : "secondary"}>
      {role === "ADMIN" ? "Admin" : "Member"}
    </Badge>
  )
}

function SpaceCard({ membership }: { membership: SpaceMembership }) {
  const { space, role } = membership
  return (
    <Link to={`/spaces/${space.id}`} className="group block">
      <Card className="hover:border-foreground/20 h-full gap-3 transition-colors">
        <CardHeader>
          <div className="bg-muted text-foreground/70 mb-1 flex size-9 items-center justify-center rounded-lg">
            <FolderKanban className="size-4.5" />
          </div>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="group-hover:text-primary line-clamp-1 transition-colors">
              {space.title}
            </CardTitle>
            <RoleBadge role={role} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2 min-h-[2.5rem] text-sm">
            {space.desc?.trim() || "No description yet."}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function DashboardPage() {
  const { data: spaces, isLoading, isError } = useSpaces()

  return (
    <div>
      <PageHeader
        title="Your spaces"
        description="Every project you own or collaborate on lives here."
        actions={<CreateSpaceDialog />}
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="gap-3">
              <CardHeader>
                <Skeleton className="size-9 rounded-lg" />
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={<LayoutGrid className="size-5" />}
          title="Couldn't load your spaces"
          description="Check that you're signed in and the server is running, then try again."
        />
      ) : spaces && spaces.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spaces.map((m) => (
            <SpaceCard key={m.spaceId} membership={m} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<LayoutGrid className="size-5" />}
          title="No spaces yet"
          description="Create your first space to start organizing boards and tasks with your team."
          action={<CreateSpaceDialog />}
        />
      )}
    </div>
  )
}
