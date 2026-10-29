import type { ShellAppProps } from '../types';
import './Landing.css';

interface LandingProps extends ShellAppProps {
  onNavigate: (view: 'landing' | 'select' | 'form' | 'history' | 'view' | 'new' | 'all') => void;
}

export function Landing({ onNavigate, shellContext }: LandingProps) {
  const forceHide = import.meta.env.VITE_FORCE_HIDE_ROLE_SELECTOR === 'true';
  const useLocal = import.meta.env.VITE_USE_LOCAL_ROLE_SELECTOR === 'true';
  const showStart = !!shellContext || (!forceHide && useLocal);

  const logoLeft = new URL('../utils/assets/startchancen.png', import.meta.url).href;
  const logoRight = new URL('../utils/assets/isb_raute.png', import.meta.url).href;


  return (
    <div className="landing">
      <div className="landing-logos">
        <img
          className="landing-logo-startchancen"
          src={logoLeft}
          alt="Startchancen-Programm"
        />

        <img
          className="landing-logo-isb"
          src={logoRight}
          alt="Staatsinstitut für Schulqualität und Bildungsforschung"
        />
      </div>

      <section className="landing-benefits" aria-labelledby="landing-title" lang="de">
        <div className="landing-intro">
          <span className="landing-eyebrow">Prototyp</span>
          <h1 id="landing-title">
            Ziel- und Handlungsvereinbarungs<br />
            <span><i>App</i> </span>
          </h1>
          <div className="landing-note">
            <span className="landing-note-icon" aria-hidden="true">✓</span>
            <span>Digital. Übersichtlich. Einfach.</span>
          </div>
          {showStart ? (
            <div className="landing-actions">
              <button
                className="landing-start"
                onClick={() => onNavigate('select')}
              >
                Start
              </button>
            </div>
          ) : (
            <div className="landing-actions">
              <p className="landing-access-note">
                Die App funktioniert nur für registrierte User. Bitte registrieren Sie sich
                auf der Dash-Demo Plattform, um Einblicke in die App Entwicklung zu bekommen.
              </p>
              <a
                className="landing-start landing-portal-link"
                href="https://edgar-treischl.pages.gitlab.lrz.de/dash-demo/"
                title="Öffnet das Portal in einem neuen Tab (externer Link)"
                target="_blank"
                rel="noopener noreferrer"
              >
                Zur Dash-Demo
                <svg className="landing-external-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            </div>
          )}
        </div>

        <div className="landing-benefits-visual">
          <div className="landing-benefit">
            <div className="landing-benefit-icon landing-icon-blue">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                <path d="M14 3v5h5M9 13h6M9 17h6M3 8l2 2 3-3" />
              </svg>
            </div>
            <div className="landing-benefit-copy">
              <span className="landing-benefit-number">01 / DIGITALISIERUNG</span>
              <h2>Vereinbarungen digital erstellen</h2>
              <p>
                Ziel- und Handlungsvereinbarungen digital erstellen, überarbeiten
                und direkt einreichen.
              </p>
            </div>
          </div>

          <div className="landing-benefit">
            <div className="landing-benefit-icon landing-icon-turquoise">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 4a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
                <path d="M8 12h8M8 9h5M8 15h6" />
              </svg>
            </div>
            <div className="landing-benefit-copy">
              <span className="landing-benefit-number">02 / ZUSAMMENARBEIT</span>
              <h2>Zusammenarbeit mit der Schulaufsicht</h2>
              <p>
                Mehr als ein digitales Formular: Vereinbarungen einreichen um Rückmeldungen zu erhalten, sich auszutauschen und nächste Schritte planen.
              </p>
            </div>
          </div>

          <div className="landing-benefit">
            <div className="landing-benefit-icon landing-icon-lightblue">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="7" r="3" />
                <circle cx="5" cy="17" r="2.5" />
                <circle cx="19" cy="17" r="2.5" />
                <path d="M9.5 8.5 6.5 14.5M14.5 8.5l3 6M7.5 17h9" />
              </svg>
            </div>
            <div className="landing-benefit-copy">
              <span className="landing-benefit-number">03 / VERNETZUNG</span>
              <h2>Mit anderen Schulen vernetzen</h2>
              <p>
                Schulen mit gleichen Zielen entdecken und sich vernetzen – für neue Perspektiven
                und gemeinsame Weiterentwicklung.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
