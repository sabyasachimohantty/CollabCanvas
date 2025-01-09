import { BrowserRouter, Route, Routes } from 'react-router'
import Canvas from "./components/Canvas"
import HomePage from "./components/HomePage"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/canvas/:id" element={<Canvas />} />
      </Routes>
    </BrowserRouter>
      
  )
}

export default App
