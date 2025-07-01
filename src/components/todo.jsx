import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import Pagination from "./pagination";
import { Link } from "react-router-dom";
import AddTodo from "./addtodo";
import { Edit, Trash } from "lucide-react";

function Todos() {
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 10;

  const startIndex = (currentPage - 1) * todosPerPage;
  const endIndex = startIndex + todosPerPage;

  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all | completed | pending

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
    onSuccess: (_, id) => {
      queryClient.setQueryData(["todos"], (old = []) =>
        old.filter((todo) => todo.id !== id)
      );
    },
  });

  const handleDelete = (id) => {
    const confirmDelete = confirm("Delete this todo?");
    if (!confirmDelete) return;

    deleteTodo.mutate(id);
  };

  const { data: todos = [], isLoading, isError, error } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading todos...</p>;
  if (isError) return <p>Error: {error.message}</p>;



  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all"
        ? true
        : filterStatus === "completed"
        ? todo.completed
        : !todo.completed;

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);
  const currentTodos = filteredTodos.slice(startIndex, endIndex);

  return (
    <>
      <div className="todo-container">
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-4 py-2 rounded"
            aria-label="Filter Todos"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

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
                      if (e.key === "Enter") {
                        updateTodo.mutate({ ...todo, title: editTitle });
                        setEditingId(null);
                      } else if (e.key === "Escape") {
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
                    <Link
                      to={`/todos/${todo.id}`}
                      className="font-medium hover:underline block"
                    >
                      {todo.title}
                    </Link>
                    <span
                      className={
                        todo.completed
                          ? "text-green-600 text-sm"
                          : "text-red-400 text-sm"
                      }
                    >
                      {todo.completed ? "Completed" : "Pending..."}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={!!todo.completed}
                      aria-label="Toggle Todo Completion"
                      onChange={() =>
                        updateTodo.mutate({
                          ...todo,
                          completed: !todo.completed,
                        })
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
                      onClick={() => handleDelete(todo.id)}
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

export default Todos;
// Note: This code uses the JSONPlaceholder API for demonstration purposes.

//  JSONPlaceholder Todo API
// https://jsonplaceholder.typicode.com/
