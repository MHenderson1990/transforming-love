import { Link } from 'react-router-dom'
import BachelorApplicationForm from '../components/BachelorApplicationForm'

function ApplicationPage() {
  return (
    <main>
      <section aria-labelledby="application-title">
        <Link to="/">← Back to Transforming Love</Link>
        <h1 id="application-title">Bachelor application</h1>
        <p>Apply by November 15, 2026.</p>
        <p>Three photos are required, including one full-body photo.</p>

        <BachelorApplicationForm />
      </section>
    </main>
  )
}

export default ApplicationPage