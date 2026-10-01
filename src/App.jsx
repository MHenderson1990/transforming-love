import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ApplicationPage from './pages/ApplicationPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/apply" element={<ApplicationPage />} />
    </Routes>
  )
}

export default App
