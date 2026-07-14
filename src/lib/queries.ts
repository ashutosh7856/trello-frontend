import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"
import type {
  Board,
  Invite,
  SpaceDetail,
  SpaceMembership,
} from "@/lib/types"

export function useSpaces() {
  return useQuery({
    queryKey: ["spaces"],
    queryFn: async () => {
      const { data } = await api.get<SpaceMembership[]>("/space/all")
      return data
    },
  })
}

export function useInvites() {
  return useQuery({
    queryKey: ["invites"],
    queryFn: async () => {
      const { data } = await api.get<Invite[]>("/space/invites/all")
      return data
    },
  })
}

/** Only PENDING invites are actionable in the inbox / badge. */
export function usePendingInvites() {
  const query = useInvites()
  return {
    ...query,
    data: query.data?.filter((i) => i.status === "PENDING"),
  }
}

export function useSpace(spaceId: string | undefined) {
  return useQuery({
    queryKey: ["space", spaceId],
    enabled: Boolean(spaceId),
    queryFn: async () => {
      const { data } = await api.get<SpaceDetail>(`/space/${spaceId}`)
      return data
    },
  })
}

export function useSpaceInvites(spaceId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["space-invites", spaceId],
    enabled: enabled && Boolean(spaceId),
    queryFn: async () => {
      const { data } = await api.get<Invite[]>(`/space/invites/${spaceId}`)
      return data
    },
  })
}

export function useBoard(spaceId: string, boardId: string, enabled = true) {
  return useQuery({
    queryKey: ["board", spaceId, boardId],
    enabled: enabled && Boolean(spaceId) && Boolean(boardId),
    queryFn: async () => {
      const { data } = await api.get<Board>(`/board/${boardId}/${spaceId}`)
      return data
    },
  })
}
