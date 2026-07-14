import { Link } from "react-router-dom"

import { Brand } from "@/components/brand"
import { buttonVariants } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center">
      <Brand />
      <div className="space-y-1">
        <p className="text-5xl font-semibold tracking-tight">404</p>
        <p className="text-muted-foreground">
          We couldn&apos;t find the page you were looking for.
        </p>
      </div>
      <Link to="/" className={buttonVariants({ variant: "default" })}>
        Back to spaces
      </Link>
    </div>
  )
}
