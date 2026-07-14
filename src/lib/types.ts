export type Role = "ADMIN" | "MEMBER" | "USER"
export type Status = "PENDING" | "ONGOING" | "DONE"
export type InviteStatus = "ACCEPTED" | "PENDING" | "REJECTED"

export interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  googleId?: string | null
  createdAt: string
}

export interface Space {
  id: string
  title: string
  desc: string | null
  createrEmail: string
}

export interface Board {
  id: string
  title: string
  spaceId: string
  createdAt: string
  cards?: Card[]
}

export interface Card {
  id: string
  title: string
  desc: string | null
  boardId: string
  status: Status
  assignedemailId: string | null
  createdAt: string
  updatedAt: string
}

export interface Invite {
  id: string
  spaceId: string
  emailId: string
  status: InviteStatus
  createdAt: string
  updateAt: string
}

/** GET /space/all returns Access rows with the related space embedded. */
export interface SpaceMembership {
  emailId: string
  spaceId: string
  role: Role
  addedAt: string
  updatedAt: string
  space: Space
}

/** GET /space/:spaceId returns an Access row with space + boards embedded. */
export interface SpaceDetail {
  emailId: string
  spaceId: string
  role: Role
  addedAt: string
  updatedAt: string
  space: Space & { boards: Board[] }
}
