import './App.css'
import Todos from './components/todo';
import TodoDetail from './components/todoDetail';
import {Routes, Route} from 'react-router-dom';


function App() {
 

  return (
    <>
      
      <div className="p-4 max-w-xl mx-auto">
      <Routes>
        <Route path="/" element={<Todos />} />
        <Route path="/todos/:id" element={<TodoDetail />} />
       
      </Routes>
      </div>
      
    </>
  ); 
}

export default App
