import { Link } from 'react-router-dom'
import TransSymbol from '../components/TransSymbol.jsx'
import './HomePage.css'

const criteria = [
  { label: 'Who', text: 'A Black trans man, ages 25–40' },
  { label: 'Where', text: 'In or near Dallas, Texas' },
  { label: 'Looking for', text: 'A serious relationship with women' },
]

const steps = [
  {
    title: 'Fill out the application',
    text: 'Name, age, location, contact info, and social handles.',
  },
  {
    title: 'Upload 3–4 recent photos',
    text: 'Include a clear face shot and one full-body shot.',
  },
  {
    title: 'Hear back from casting',
    text: 'Selected applicants will be contacted about a video submission.',
  },
]

function HomePage() {
  return (
    <div className="home">
      <TransSymbol className="home__backdrop" strokeWidth={9} />

      <nav className="home__nav" aria-label="Main">
        <span className="home__network">BOW Network</span>
        <Link className="button button--small" to="/apply">
          Apply now
        </Link>
      </nav>

      <main>
        <header className="home__hero">
          <p className="home__presents">BOW Network Presents</p>

          <h1 className="home__title" aria-label="Transforming Love">
            <span aria-hidden="true">Transforming</span>
            <span className="home__title-love" aria-hidden="true">
              L
              <TransSymbol className="home__title-symbol" />
              ve
            </span>
          </h1>

          <p className="home__casting gradient-text">Open casting call</p>

          <p className="home__tagline">
            Are you ready to share your story, step into the spotlight, and
            find the love of your life?
          </p>

          <p className="home__lede">
            A groundbreaking new reality dating series,{' '}
            <span className="home__script gradient-text">Transforming Love</span>, is
            officially searching for its leading man.
          </p>

          <div className="home__cta">
            <Link className="button" to="/apply">
              Apply now
            </Link>
            <p className="home__closes">Applications close Nov 15, 2026</p>
          </div>
        </header>

        <section className="home__section" aria-labelledby="about-show">
          <h2 id="about-show" className="home__heading gradient-text--pink">
            About the show
          </h2>
          <div className="home__prose">
            <p>
              <em>Transforming Love</em> is a romantic, heartfelt reality dating
              series, with plenty of fun and a little drama along the way. Our
              bachelor will get to know 10 women through group dates and
              one-on-one moments, with an elimination at the end of each
              episode. At its heart, the show is a real, relatable look into a
              trans man's life and his search for lasting love.
            </p>
            <p>
              We're currently casting for the pilot episode, which films over
              1–2 days in Dallas. If the series moves forward, the full season
              films over 3–7 days, also in Dallas. Filming begins in 2027.
            </p>
          </div>
        </section>

        <section className="home__section" aria-labelledby="our-bachelor">
          <h2 id="our-bachelor" className="home__heading gradient-text--pink">
            Could you be our bachelor?
          </h2>
          <p className="home__intro">
            We're looking for a charming, standout single man who's ready to
            open his heart and embark on a journey to find true love.
          </p>
          <ul className="home__criteria">
            {criteria.map(({ label, text }) => (
              <li key={label}>
                <span className="home__criteria-label">{label}</span>
                <span className="home__criteria-text">{text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="home__section" aria-labelledby="how-to-apply">
          <h2 id="how-to-apply" className="home__apply-heading gradient-text">
            How to apply
          </h2>
          <ol className="home__steps">
            {steps.map(({ title, text }, index) => (
              <li key={title}>
                <span className="home__step-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="home__step-title">{title}</span>
                <span className="home__step-text">{text}</span>
              </li>
            ))}
          </ol>

          <div className="home__deadline">
            <span className="home__deadline-label">Deadline:</span>
            <span className="home__deadline-date">15 November, 2026</span>
          </div>

          <Link className="button" to="/apply">
            Start your application
          </Link>
        </section>
      </main>

      <footer className="home__footer">
        © 2026 BOW Network · Transforming Love
      </footer>
    </div>
  )
}

export default HomePage