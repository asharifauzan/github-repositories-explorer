import { FormEvent, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { searchUser } from "@/lib/api/github.api"
import UserList from "./_components/UserList"
import UserItem from "./_components/UserItem"
import { X } from "lucide-react"
import type { User } from "@/lib/api/type"

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

  const fetchUsers = () => {
    startTransition(async () => {
      const response = await searchUser(keyword)
      setUserSearch(keyword)
      setResults(response.data.items)
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

      {userSearch && !isPending && (
        <SearchStatus search={userSearch} className="mb-2" />
      )}

      <UserList data={results} loading={isPending}>
        {(users) => {
          return users.map((user) => (
            <UserItem key={user.id} username={user.login} />
          ))
        }}
      </UserList>
    </div>
  )
}
