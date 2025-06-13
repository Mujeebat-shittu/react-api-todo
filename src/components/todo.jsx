import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";   
import Pagination from "./pagination";
import { Link } from 'react-router-dom';
import AddTodo from './addtodo';    
import { Edit, Trash } from "lucide-react";



export default function Todos() {
    const [currentPage, setCurrentPage] = useState(1);
    const todosPerPage = 10;

    const startIndex = (currentPage - 1) * todosPerPage;
    const endIndex = startIndex + todosPerPage;

    const queryClient = useQueryClient();

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");


    const updateTodo = useMutation({
  mutationFn: (updatedTodo) =>
    axios.put(
      `https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`,
      updatedTodo
    ),
  onSuccess: (response) => {
    const updated = response.data; 

    queryClient.setQueryData(["todos"], (oldTodos) =>
      oldTodos.map((todo) =>
        todo.id === updated.id ? { ...todo, ...updated } : todo
      )
    );
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
         {editingId === todo.id ? (
     <div className="flex justify-between items-center gap-2">
     <input
  type="text"
  value={editTitle}
  onChange={(e) => setEditTitle(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      updateTodo.mutate({ ...todo, title: editTitle });
      setEditingId(null);
    } else if (e.key === 'Escape') {
      setEditingId(null); // Cancel editing
    }
  }}
  className="border px-2 py-1 rounded w-full"
/>

    <button
      disabled={updateTodo.isLoading}
      onClick={() => {
        updateTodo.mutate({ ...todo, title: editTitle });
        setEditingId(null);
      }}
      className="text-green-600 text-sm disabled:opacity-50"
    >
        {updateTodo.isLoading ? "Saving..." : "Save"}

    </button>
    <button
      onClick={() => setEditingId(null)}
      className="text-gray-500 text-sm"
    >
      Cancel
    </button>
  </div>
) : (

        <div className="flex justify-between items-center">
        
        <div>
          <Link to={`/todos/${todo.id}`} className="font-medium hover:underline block">
            {todo.title}
          </Link>
          <span
            className={todo.completed ? "text-green-600 text-sm" : "text-red-400 text-sm"}
          >
            {todo.completed ? "Completed" : "Pending..."}
          </span>
        </div>

        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={todo.completed}
            aria-label="Toggle Todo Completion"
            onChange={() =>
              updateTodo.mutate({ ...todo, completed: !todo.completed })
            }
          />

           <Edit
         onClick={() => {
          setEditingId(todo.id);
          setEditTitle(todo.title);
        }}
        className="text-blue-500 cursor-pointer w-5 h-5 hover:text-blue-700"
        size={18}
        aria-label="Edit Todo"
      />


          <Trash
            onClick={() => deleteTodo.mutate(todo.id)}
            className="text-red-500 w-5 h-5 cursor-pointer hover:text-red-700"
          />
            
        </div>
      </div>
)}
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
