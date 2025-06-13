import './App.css'
import Todos from './components/todo';
import TodoDetail from './components/todoDetail';
import NotFound from './components/notfound';
import {Routes, Route} from 'react-router-dom';


function App() {
 

  return (
    <>
      
      <div className="p-4 max-w-xl mx-auto">
      <Routes>
        <Route path="/" element={<Todos />} />
        <Route path="/todos/:id" element={<TodoDetail />} />
        <Route path="*" element={<NotFound />} /> 
       
      </Routes>
      </div>
      
    </>
  ); 
}

export default App
