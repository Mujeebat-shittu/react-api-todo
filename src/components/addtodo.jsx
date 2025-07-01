import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

function AddTodo() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const addTodo = useMutation({
    mutationFn: (newTodo) =>
      axios.post("https://jsonplaceholder.typicode.com/todos", newTodo),
onSuccess: (response) => {
      const newTodo = {
        ...response.data,
        id: Math.random(),
        completed: false, 
      };

      queryClient.setQueryData(["todos"], (old = []) => [newTodo, ...old]);

      setTitle("");
    },
    
  });

  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTodo.mutate({
      title,
      completed: false,
      userId: 1,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo"
        className="border px-4 py-2 rounded w-full"
      />
      <button
        aria-label="Add Todo"
        type="submit"
        disabled={addTodo.isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {addTodo.isLoading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
export default AddTodo