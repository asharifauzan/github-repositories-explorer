import { ReactNode } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { User } from "@/lib/api/type"

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div id="user-list" className="min-h-96 bg-slate-100 p-4 rounded-sm">
      {children}
    </div>
  )
}

export default function UserList({
  data,
  loading,
  errorMessage,
  children
}: {
  data: User[] | null
  loading: boolean
  errorMessage: string | null
  children: (items: User[]) => React.ReactNode
}) {
  // show loading during fetch
  if (loading) {
    return (
      <Wrapper>
        <div className="space-y-1">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </Wrapper>
    )
  }

  // handle error while fetching
  if (errorMessage) return <p className="text-destructive">{errorMessage}</p>

  // used in initial state, when data is null
  if (!data)
    return (
      <Wrapper>
        <p>Search user</p>
      </Wrapper>
    )

  // show when no users related to keyword
  if (data.length === 0)
    return (
      <Wrapper>
        <p>No user found.</p>
      </Wrapper>
    )

  return (
    <Wrapper>
      <div className="space-y-2">{children(data)}</div>
    </Wrapper>
  )
}
