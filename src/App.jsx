import Users from "./components/Users"
import './app.scss'
import { Route, Routes } from "react-router-dom"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Users />} />
      </Routes>
    </>
  )
}

export default App
