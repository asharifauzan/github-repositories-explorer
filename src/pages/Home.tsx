import { FormEvent, useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { searchUser } from "@/lib/api/github.api"
import UserList from "./_components/UserList"
import UserItem from "./_components/UserItem"
import { Wifi, X } from "lucide-react"
import type { User } from "@/lib/api/type"
import { Alert, AlertTitle } from "@/components/ui/alert"

function SearchStatus({
  search,
  className
}: {
  search: string
  className?: string
}) {
  return <p className={className}>Showing users "{search}"</p>
}

export default function HomePage() {
  const [isPending, startTransition] = useTransition()
  const [keyword, setKeyword] = useState<string>("")
  const [userSearch, setUserSearch] = useState<string>("")
  const [results, setResults] = useState<User[] | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState<boolean>(true)

  // check network status
  useEffect(() => {
    const updateNetworkStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener("load", updateNetworkStatus)
    window.addEventListener("online", updateNetworkStatus)
    window.addEventListener("offline", updateNetworkStatus)

    return () => {
      window.removeEventListener("load", updateNetworkStatus)
      window.removeEventListener("online", updateNetworkStatus)
      window.removeEventListener("offline", updateNetworkStatus)
    }
  }, [])

  const fetchUsers = () => {
    startTransition(async () => {
      try {
        const response = await searchUser(keyword)
        setUserSearch(keyword)
        setResults(response.data?.items || [])
        setErrorMessage(null)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setErrorMessage(
          "Failed to search users, please check your network connection"
        )
      }
    })
  }

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchUsers()
  }

  const handleClear = () => {
    setKeyword("")
    setUserSearch("")
    setResults(null)
  }

  return (
    <div id="content" className="container mx-auto p-6">
      <form onSubmit={handleSearch}>
        <div className="form flex flex-col lg:flex-row gap-1 mb-2">
          <div className="relative flex-1">
            <Input
              className="h-14 !text-xl"
              placeholder="Search github username"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value.trimStart())}
            />
            <X
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
              onClick={handleClear}
            />
          </div>
          <Button type="submit" className="h-14 text-xl" disabled={!keyword}>
            Search
          </Button>
        </div>
      </form>

      {!isOnline && (
        <Alert variant="destructive" className="mb-2">
          <Wifi className="mr-2" />
          <AlertTitle>
            Your network currently offline, please check the connection
          </AlertTitle>
        </Alert>
      )}

      {userSearch && !isPending && (
        <SearchStatus search={userSearch} className="mb-2" />
      )}

      {results && (
        <UserList
          data={results}
          loading={isPending}
          errorMessage={errorMessage}
        >
          {(users) => {
            return users.map((user) => (
              <UserItem key={user.id} username={user.login} />
            ))
          }}
        </UserList>
      )}
    </div>
  )
}
