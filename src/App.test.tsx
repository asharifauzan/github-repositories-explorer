import { findByRole, fireEvent, render, screen } from "@testing-library/react"
import App from "./App"

const positive_keyword = "hello"
const negative_keyword = "asdasdsadasddkeuoawd"

describe("Search Users", () => {
  it("renderes list of user", async () => {
    const { container } = render(<App />)

    // search 'positive case' user in input element and submit
    const inputElement = screen.getByPlaceholderText("Search github username")
    const searchBtn = screen.getByText("Search")
    fireEvent.change(inputElement, { target: { value: positive_keyword } })
    fireEvent.click(searchBtn)

    // detect search status
    const searchStatus = await screen.findByText(/Showing users/)
    expect(searchStatus).toBeDefined()

    // detect loading skeleton
    const loadingSkeleton = container.querySelector("#skeleton-loading")
    expect(loadingSkeleton).toBeDefined()

    // count users, should be range in 1 to 5
    const listUser = await findByRole(container, "listbox")
    const countUser = listUser.querySelectorAll(
      "[data-slot='collapsible']"
    ).length
    expect(countUser).toBeGreaterThanOrEqual(1)
    expect(countUser).toBeLessThanOrEqual(5)
  })
  it("renders none of users", async () => {
    const { container } = render(<App />)

    // search 'negative' user in input element and submit
    const inputElement = screen.getByPlaceholderText("Search github username")
    const searchBtn = screen.getByText("Search")
    fireEvent.change(inputElement, { target: { value: negative_keyword } })
    fireEvent.click(searchBtn)

    // detect loading skeleton
    const loadingSkeleton = container.querySelector("#skeleton-loading")
    expect(loadingSkeleton).toBeDefined()

    // count users, should be 0
    const list = await findByRole(container, "listbox")
    const countUser = list.querySelectorAll("[data-slot='collapsible']").length
    expect(countUser).toEqual(0)
  })
})
