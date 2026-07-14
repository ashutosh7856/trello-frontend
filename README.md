# Flowboard

A Trello-style team workspace built on React. Organize work into **spaces**,
break each space into **boards**, and track tasks as **cards** that move through
_To do → In progress → Done_. Spaces are shared through email invitations, with
role-based access (admins manage boards and members, members work the cards).

## Features

- Email/password and Google OAuth sign-in (httpOnly cookie session)
- Dashboard of every space you own or collaborate on
- Board view with columns, cards, statuses and assignees
- Create/edit/assign cards; admins manage boards and membership
- Invite teammates by email and accept/decline invites from an inbox
- Light/dark theme, with toasts and loading states throughout

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** + **shadcn/ui** (Base UI primitives)
- **TanStack Query** for server state
- **React Router** for routing
- **React Hook Form** + **Zod** for forms and validation
- **Axios** for the API client

## Getting started

```bash
pnpm install
cp .env.example .env   # point VITE_API_ORIGIN at your backend
pnpm dev
```

The app runs on http://localhost:5173 and expects the API at
`VITE_API_ORIGIN` (default `http://localhost:3001`). Because auth uses an
httpOnly cookie, the API must allow credentialed CORS from the app origin.

## Scripts

| Command        | Description                         |
| -------------- | ----------------------------------- |
| `pnpm dev`     | Start the Vite dev server           |
| `pnpm build`   | Type-check and build for production  |
| `pnpm preview` | Preview the production build        |

## Project structure

```
src/
  components/        Shared UI, app shell, board + auth building blocks
    ui/              shadcn/ui components
    board/           Board columns, cards, dialogs
  lib/               API client, query hooks, auth context, types
  pages/             Route-level screens
```

## Roadmap

- Real-time board updates over WebSockets so every member sees changes live
- Drag-and-drop card ordering across boards
