import type { ReactNode } from "react"

import { Brand } from "@/components/brand"

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Brand />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="mb-6 flex flex-col gap-1.5">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="text-muted-foreground text-sm">{subtitle}</p>
            </div>
            {children}
            <div className="text-muted-foreground mt-6 text-center text-sm">
              {footer}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--color-primary)/8%,transparent_55%),radial-gradient(circle_at_80%_80%,var(--color-primary)/6%,transparent_50%)]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div />
          <blockquote className="space-y-3">
            <p className="text-2xl leading-snug font-medium tracking-tight text-balance">
              Organize work into spaces, boards, and cards — and keep the whole
              team moving in the same direction.
            </p>
            <footer className="text-muted-foreground text-sm">
              Plan. Assign. Ship.
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
