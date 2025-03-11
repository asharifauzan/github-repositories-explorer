import { useState, useEffect, useTransition } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

export default function UserItem({
  username,
  image
}: {
  username: string
  image: string
}) {
  const [isPending, startTransition] = useTransition()
  const [isPendingNext, startTransitionNext] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
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
    if ((isOpen && !repos) || errorMessage) {
      startTransition(async () => {
        try {
          const response = await fetchUserRepos(username, INITIAL_OPTIONS)
          setRepos(response.data)
          setHasNext(response.headers.link?.includes('rel="next"'))
          setErrorMessage(null)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: unknown) {
          setErrorMessage(
            "Failed to fetch repositories, try to reopen this card"
          )
        }
      })
    }
  }, [isOpen, username, repos, errorMessage])

  // fetch 5 more repos and merge with current repos in state
  const handleNext = () => {
    try {
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
        setErrorMessage(null)
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      setErrorMessage("Failed to fetch repositories, try to reopen this card")
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Card>
          <CardContent className="flex gap-3">
            <Avatar>
              <AvatarImage src={image} alt={username} />
              <AvatarFallback>{username}</AvatarFallback>
            </Avatar>
            <p className="text-xl">{username}</p>
            <div role="treegrid" className="ml-auto">
              {isOpen ? <ChevronUpIcon /> : <ChevronDown />}
            </div>
          </CardContent>
        </Card>
      </CollapsibleTrigger>
      <CollapsibleContent className="max-h-96 overflow-scroll">
        <RepoList
          data={repos}
          loading={isPending}
          loadingNext={isPendingNext}
          errorMessage={errorMessage}
          hasNext={hasNext}
          onNextClick={() => {
            handleNext()
          }}
        />
      </CollapsibleContent>
    </Collapsible>
  )
}
