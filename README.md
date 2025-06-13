# Todo App

Fetching a React Todo app from an API using Tanstack Query, Axios, and pagination.

## Features
- View, add, update, and delete todos (the change disappears after refreshing the page)
- Pagination (10 todos per page)
- Accessible and mobile-friendly layout

## Tech Stack
- React
- React Router
- React Query
- Axios
- JSONPlaceholder API (https://jsonplaceholder.typicode.com/)


## Challenges
- Updating the todo list to display changes
since the API only returns the same ToDo even after updating. I had to directly pass the result inside the function but the changes only appear when the page is not getting refreshed. As soon as the page gets refreshed, the page gets updated to display the same data from the API over and over 

## Setup
```bash
npm install
npm run dev
```