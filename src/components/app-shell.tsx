import { Link, NavLink, Outlet } from "react-router-dom"
import { Bell } from "lucide-react"

import { cn } from "@/lib/utils"
import { usePendingInvites } from "@/lib/queries"
import { Brand } from "@/components/brand"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/user-menu"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "hover:text-foreground rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          isActive ? "text-foreground" : "text-muted-foreground"
        )
      }
    >
      {children}
    </NavLink>
  )
}

export function AppShell() {
  const { data: pending } = usePendingInvites()
  const count = pending?.length ?? 0

  return (
    <div className="min-h-svh">
      <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link to="/">
            <Brand />
          </Link>

          <nav className="ml-2 hidden items-center gap-1 sm:flex">
            <NavItem to="/">Spaces</NavItem>
            <NavItem to="/invites">Invites</NavItem>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <Link
              to="/invites"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "relative"
              )}
              aria-label="Invites"
            >
              <Bell className="size-4" />
              {count > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 size-4 justify-center rounded-full p-0 text-[10px] tabular-nums">
                  {count}
                </Badge>
              )}
            </Link>
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
