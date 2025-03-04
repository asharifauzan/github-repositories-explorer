import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Repository } from "@/lib/api/type"

export default function RepoList({
  data,
  loading,
  loadingNext,
  hasNext,
  onNextClick
}: {
  data: Repository[] | null
  loading: boolean
  loadingNext: boolean
  hasNext: boolean
  onNextClick: () => void
}) {
  // show loading
  if (loading) return <p>Loading...</p>

  // handle repository null
  if (!data || data.length === 0)
    return <p>This user has no public repository</p>

  return (
    <div className="max-h-[500px] mb-2 space-y-2 p-2 pl-6">
      {data?.map((repo: Repository) => (
        <div
          key={repo.id}
          className="bg-gray-400 p-4 rounded-lg flex justify-between"
        >
          <div>
            <p className="text-2xl font-bold hover:underline">
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
            </p>
            <p>{repo.description}</p>
          </div>
          <p className="flex gap-2">
            <span>{repo.stargazers_count}</span>
            <Star className="text-yellow-400" />
          </p>
        </div>
      ))}

      {hasNext && (
        <p
          className={cn(
            "underline hover:text-primary cursor-pointer text-center",
            {
              "pointer-events-none !cursor-not-allowed text-gray-500":
                loadingNext
            }
          )}
          onClick={onNextClick}
        >
          Show more repo
        </p>
      )}
    </div>
  )
}
