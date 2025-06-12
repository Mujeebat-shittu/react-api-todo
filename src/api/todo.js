import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export const fetchTodos = async () => {
  const response = await axios.get(`${BASE_URL}/todos`);
  return response.data;
};
