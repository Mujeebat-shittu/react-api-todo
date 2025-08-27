import './App.css'
import Todos from './components/todo';
import TodoDetail from './components/todoDetail';
import Home from './components/home';
import NotFound from './components/notfound';
import ErrorPage from './components/error'
import {Routes, Route} from 'react-router-dom';


function App() {
 

  return (
    <>
      
      <div className="p-4 max-w-xl mx-auto">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/todo' element={<Todos/>}/>
        <Route path="/todos/:id" element={<TodoDetail />} />
        <Route path="*" element={<NotFound />} /> 
        <Route path="/error" element={<ErrorPage />} />               
      </Routes>
      </div>
      
    </>
  ); 
}

export default App
