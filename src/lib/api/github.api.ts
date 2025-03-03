import axios from "axios"
import type { ResponseSchema, User, Repository } from "./type"

const GithubAPI = axios.create({
  baseURL: "https://api.github.com"
})

// Get all users that username related to keyworkd
export const searchUser = async (keyword: string, options = {}) => {
  const response = await GithubAPI.get<ResponseSchema<User[]>>(
    "/search/users",
    {
      params: {
        q: keyword
      },
      ...options
    }
  )
  return response
}

// Get all repositories from an user
export const getUserRepos = async (username: string, options = {}) => {
  const response = await GithubAPI.get<Repository[]>(
    `/users/${username}/repos`,
    {
      ...options
    }
  )
  return response
}
