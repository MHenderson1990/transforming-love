import { Link, Route, Routes } from 'react-router-dom'
import ApplicationPage from './pages/ApplicationPage'
import './App.css'

function HomePage() {
  return (
    <main>
      <header>
        <p>BOW Network Presents</p>
        <h1>Transforming Love</h1>
        <p>Open casting call for our bachelor</p>

        <div className="intro">
          <h2>About the show</h2>
          <p>
            Transforming Love is a reality dating show about finding a
            connection that sees the whole person.
          </p>

          <h2>Could you be our bachelor?</h2>
          <p>
            We’re casting a Black trans man, ages 25–40, in or near Dallas
            who’s ready to pursue a serious relationship with women.
          </p>
          <p>Applications close November 15, 2026.</p>
          <p>Selected applicants will be contacted about a video submission.</p>
        </div>

        <Link to="/apply">Apply now</Link>
      </header>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/apply" element={<ApplicationPage />} />
    </Routes>
  )
}

export default App
