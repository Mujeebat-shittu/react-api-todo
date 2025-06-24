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

## Link to Live App 
[Link to Live App](https://react-api-todo.netlify.app/)

## Images Displaying Features
- An image showing the result of only completed todos after using the search filter
![App Screenshot Preview](./readme%20images/image1.png)

- An image displaying the edit feature
![App Screenshot Preview](./readme%20images/image2.png)

- An image displaying the pagination feature
![App Screenshot Preview](./readme%20images/image3.png)

- An image displaying the delete feature
![App Screenshot Preview](./readme%20images/image4.png)

## Setup
```bash
npm install
npm run dev
```