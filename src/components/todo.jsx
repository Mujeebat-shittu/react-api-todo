import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";   
import Pagination from "./pagination";
import { Link } from 'react-router-dom';
import AddTodo from './addtodo';    
import { Trash } from "lucide-react";



export default function Todos() {
    const [currentPage, setCurrentPage] = useState(1);
    const todosPerPage = 10;

    const startIndex = (currentPage - 1) * todosPerPage;
    const endIndex = startIndex + todosPerPage;

    const queryClient = useQueryClient();


    const updateTodo = useMutation({
  mutationFn: (updatedTodo) =>
    axios.put(
      `https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`,
      updatedTodo
    ),
  onSuccess: () => {
    queryClient.invalidateQueries(["todos"]);
  },
});

const deleteTodo = useMutation({
  mutationFn: (id) =>
    axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`),
  onSuccess: () => {
    queryClient.invalidateQueries(["todos"]);
  },
});


  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading todos...</p>;
  if (isError) return <p>Error: {error.message}</p>;


  const totalPages = Math.ceil(data.length / todosPerPage);
  const currentTodos = data.slice(startIndex, endIndex);


  return (
    <>
    <div className="todo-container">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <AddTodo />


      <ul className="space-y-2 max-w-xl mx-auto">
      {currentTodos.map((todo) => (
       <li key={todo.id} className="border p-2 rounded">
        <div className="flex justify-between items-center">
        
        <div>
          <Link to={`/todos/${todo.id}`} className="font-medium hover:underline block">
            {todo.title}
          </Link>
          <span
            className={todo.completed ? "text-green-600 text-sm" : "text-red-500 text-sm"}
          >
            {todo.completed ? "Completed" : "Incomplete"}
          </span>
        </div>

        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() =>
              updateTodo.mutate({ ...todo, completed: !todo.completed })
            }
          />
          <Trash
            onClick={() => deleteTodo.mutate(todo.id)}
            className="text-red-500 w-5 h-5 cursor-pointer hover:text-red-700-pointer"
          />
            
        </div>
      </div>
    </li>
  ))}
</ul>


       <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
    </>
  );
}

//  JSONPlaceholder Todo API
// https://jsonplaceholder.typicode.com/
// https://jsonplaceholder.typicode.com/