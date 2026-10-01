import { Link } from 'react-router-dom'
import BachelorApplicationForm from '../components/BachelorApplicationForm.jsx'
import TransSymbol from '../components/TransSymbol.jsx'
import './ApplicationPage.css'

function ApplicationPage() {
  return (
    <div className="apply">
      <main className="apply__inner">
        <Link className="apply__back" to="/">
          ← Transforming Love
        </Link>

        <div className="apply__title" aria-hidden="true">
          <span>Transforming</span>
          <span className="apply__title-love">
            L
            <TransSymbol className="apply__title-symbol" />
            ve
          </span>
        </div>

        <header className="apply__header">
          <h1 className="apply__heading">Bachelor application</h1>
          <p className="apply__intro">
            Apply by November 15, 2026. Three photos are required, including
            one full-body photo.
          </p>
        </header>

        <BachelorApplicationForm />
      </main>
    </div>
  )
}

export default ApplicationPage