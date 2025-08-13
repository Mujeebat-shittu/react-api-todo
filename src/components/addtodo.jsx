import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

function AddTodo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const openModal = function () {
    setModalOpen(true);
  };


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
    },
  {
      onSuccess: () => {
        setTitle("");        
        setModalOpen(false); 
      },
    }
    );
  };

  return (
    <>
      <button
        aria-label="Open Add Todo Modal"
        type="button"
        onClick={openModal}
        className="bg-[#444] :hover-bg-gray-400 my-3 mx-auto text-white px-4 py-2 rounded flex items-center justify-center"
      >
        Add Todo
      </button>

      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setModalOpen(false)}
        >
          <dialog
            open
            className="bg-white dark:bg-[#444] py-8 px-6 rounded-xl shadow-lg max-w-[300px] md:max-w-md  mx-auto text-gray-900 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a new todo"
                className="border px-4 py-2 rounded w-full bg-gray-300 text-black mb-4 border-none"
              />
              <button
                type="submit"
                className="border px-4 py-2 rounded w-full bg-gray-300 text-gray-700 disabled:opacity-50"
                disabled={addTodo.isLoading}
              >
                {addTodo.isLoading ? "Adding..." : "Add Todo"}
              </button>
            </form>
          </dialog>
        </div>
      )}
    </>
  );
}
export default AddTodo;
