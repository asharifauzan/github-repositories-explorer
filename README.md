## GitHub Repositories Explorer

React + Vite application that allows users for search github profile and display their repositories.

### Features

- Search users by github username
- List all users repositories
- Display description of repository

### Additional Features

- Network offline alert
- Display first 5 repositories with "load more" function
- Clear search

### Technologies

- Vite
- React
- Typescript
- Axios
- ShadcnUI
- Eslint
- Prettier
- GitHub API

### How to run

1. Clone this repository
2. run `yarn install` to install all dependencies
3. run `yarn dev` to run application in development mode
4. Open browser and navigate to `http://localhost:5173` to use application

### Used API

- GitHub API: https://api.github.com/search/users?q={username}&per_page=5 search users
- GitHub API: https://api.github.com/users/{username}/repos display repositories of user
