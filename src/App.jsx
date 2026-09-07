import { useState } from 'react'
import './App.css'
import GetStartes from './pages/getStartes';
import CreateAccount from './components/createAccount/createAccount';
import Login from './components/login/login';
import Home from './pages/home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  const [count, setCount] = useState(0)
  
  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/Tasks-reminder" element={<GetStartes />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
