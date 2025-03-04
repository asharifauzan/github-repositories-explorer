import { useState, useEffect, useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUpIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import RepoList from "./RepoList"
import { getUserRepos } from "@/lib/api/github.api"
import type { Repository } from "@/lib/api/type"

const INITIAL_OPTIONS = {
  params: {
    per_page: 5
  }
}

export default function UserItem({ username }: { username: string }) {
  const [isPending, startTransition] = useTransition()
  const [isPendingNext, startTransitionNext] = useTransition()
  const [repos, setRepos] = useState<Repository[] | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  // meta pagination
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [hasNext, setHasNext] = useState<boolean>(false)

  const fetchUserRepos = async (githubUsername: string, options = {}) => {
    const response = await getUserRepos(githubUsername, options)
    return response
  }

  // fetch first 5 repos during first content open
  useEffect(() => {
    if (isOpen && !repos) {
      startTransition(async () => {
        const response = await fetchUserRepos(username, INITIAL_OPTIONS)
        setRepos(response.data)
        setHasNext(response.headers.link?.includes('rel="next"'))
      })
    }
  }, [isOpen, username, repos])

  // fetch 5 more repos and merge with current repos in state
  const handleNext = () => {
    startTransitionNext(async () => {
      const targetPage = currentPage + 1
      const response = await fetchUserRepos(username, {
        params: { per_page: 5, page: targetPage }
      })
      setRepos((prevRepos) => [
        ...(prevRepos as Repository[]),
        ...response.data
      ])
      setHasNext(response.headers.link?.includes('rel="next"'))
      setCurrentPage(targetPage)
    })
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Card>
          <CardContent className="flex justify-between">
            <p className="text-xl">{username}</p>
            {isOpen ? <ChevronUpIcon /> : <ChevronDown />}
          </CardContent>
        </Card>
      </CollapsibleTrigger>
      <CollapsibleContent className="max-h-96 overflow-scroll">
        <RepoList
          data={repos}
          loading={isPending}
          loadingNext={isPendingNext}
          hasNext={hasNext}
          onNextClick={() => {
            handleNext()
          }}
        />
      </CollapsibleContent>
    </Collapsible>
  )
}
