import { BrowserRouter, Route, Routes } from 'react-router'
import Canvas from "./components/Canvas"
import HomePage from "./components/HomePage"
import NotFound from './components/NotFound'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/canvas/:id" element={<Canvas />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
      
  )
}

export default App
