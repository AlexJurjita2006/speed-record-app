import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  // Date fictive pentru live feed (acum denumit "Pe circuit")
  const circuitRecords = [
    {
      id: 1,
      user: 'TurboDan',
      avatar: 'https://i.pravatar.cc/60?img=1',
      speed: 287,
      location: 'Autostrada A1 (eveniment organizat)',
      car: 'Porsche 911 Turbo S',
      time: 'acum 2 ore',
    },
    {
      id: 2,
      user: 'NitrousQueen',
      avatar: 'https://i.pravatar.cc/60?img=5',
      speed: 312,
      location: 'Transfagarasan (zi inchisa)',
      car: 'Nissan GT-R',
      time: 'acum 5 ore',
    },
    {
      id: 3,
      user: 'DriftKing99',
      avatar: 'https://i.pravatar.cc/60?img=3',
      speed: 204,
      location: 'Complex Adancata (circuit)',
      car: 'BMW M4 Competition',
      time: 'acum 8 ore',
    },
  ];

  const stats = [
    { value: 51237, suffix: '+', label: 'Utilizatori activi', icon: '👥' },
    { value: 214, suffix: '+', label: 'Evenimente anul acesta', icon: '🏁' },
    { value: 847, suffix: '', label: 'Comunitati auto', icon: '🏎️' },
    { value: 1200000, suffix: '+', label: 'Km parcursi pe circuite', icon: '🛣️' },
  ];

  return (
    <div className="homepage">
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            ⚡ Pasiune si responsabilitate
          </div>
          <h1 className="hero-title">
            <span className="hero-title--accent">PASIUNEA</span>{' '}
            <span className="hero-title--light">VITEZEI,</span>
            <br />
            <span className="hero-title--light">CONDUSA</span>{' '}
            <span className="hero-title--accent">RESPONSABIL</span>
          </h1>
          <p className="hero-subtitle">
            Inregistreaza-ti performantele pe circuite si drumuri inchise,
            conecteaza-te cu comunitatea auto si promoveaza un condus preventiv.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary">
              Intra in comunitate
              <span className="btn-icon">⚡</span>
            </Link>
            <Link to="/events" className="btn-secondary">
              Vezi evenimente
              <span className="btn-icon">📅</span>
            </Link>
          </div>
          <div className="scroll-indicator">
            <span>Deruleaza pentru mai mult</span>
            <div className="scroll-arrow">▼</div>
          </div>
        </div>
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${4 + Math.random() * 6}s`,
              }}
            />
          ))}
        </div>
      </section>

      {/* ===== DISCLAIMER BAND ===== */}
      <div className="disclaimer-band">
        <p>
          🛡️ <strong>Speed Record</strong> sustine condusul legal si responsabil.
          Toate performantele sunt obtinute pe drumuri inchise, circuite sau in conditii controlate.
        </p>
      </div>

      {/* ===== STATS BAR ===== */}
      <section className="stats-bar">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div className="stat-item" key={index}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">
                <span className="stat-number">{stat.value.toLocaleString()}</span>
                <span className="stat-suffix">{stat.suffix}</span>
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== VALORI (Performanta / Siguranta / Comunitate) ===== */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">De ce Speed Record?</h2>
          <p className="section-subtitle">
            Imbinam adrenalina cu responsabilitatea
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-card__icon">🏎️</div>
            <h3>Performanta pe Circuit</h3>
            <p>
              Inregistreaza-ti tururile, viteza maxima si timpii pe sfert de mila
              doar pe circuite legale sau drumuri inchise. Urca in clasament si
              compara-te cu alti piloti.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">🛡️</div>
            <h3>Siguranta Inainte de Toate</h3>
            <p>
              Promovam campanii de condus preventiv, cursuri de pilotaj defensiv
              si evenimente unde siguranta este prioritatea zero. Fii rapid, dar
              fii in siguranta.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">🤝</div>
            <h3>Comunitate Responsabila</h3>
            <p>
              Alatura-te unor grupuri care respecta regulile de circulatie si
              impartasesc pasiunea pentru masini intr-un cadru legal. Fa-ti
              prieteni, schimba idei si participa la intalniri.
            </p>
          </div>
        </div>
      </section>

      {/* ===== EVENIMENTE RECOMANDATE (mini preview) ===== */}
      <section className="events-preview-section">
        <div className="section-header">
          <h2 className="section-title">Evenimente Recomandate</h2>
          <p className="section-subtitle">
            Drift, drag racing si expozitii - toate intr-un cadru organizat si sigur
          </p>
        </div>
        <div className="events-preview-grid">
          <Link to="/events" className="event-preview-card">
            <img
              src="https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=400"
              alt="Drift"
            />
            <div className="event-preview-overlay">
              <span>🏎️ Drift Nights</span>
            </div>
          </Link>
          <Link to="/events" className="event-preview-card">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c40c589?w=400"
              alt="Drag Racing"
            />
            <div className="event-preview-overlay">
              <span>⚡ Drag Racing</span>
            </div>
          </Link>
          <Link to="/events" className="event-preview-card">
            <img
              src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400"
              alt="Expo"
            />
            <div className="event-preview-overlay">
              <span>🏁 Expozitii Auto</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ===== LIVE FEED ===== */}
      <section className="feed-section">
        <div className="section-header">
          <h2 className="section-title">Top Performante pe Circuit</h2>
          <p className="section-subtitle">
            Cele mai bune rezultate inregistrate in conditii legale
          </p>
        </div>
        <div className="feed-grid">
          {circuitRecords.map((record) => (
            <div className="feed-card" key={record.id}>
              <div className="feed-card__header">
                <img
                  src={record.avatar}
                  alt={record.user}
                  className="feed-card__avatar"
                />
                <div className="feed-card__user-info">
                  <span className="feed-card__username">{record.user}</span>
                  <span className="feed-card__time">{record.time}</span>
                </div>
                <div className="feed-card__medal">
                  {record.speed > 300 ? '🥇' : record.speed > 250 ? '🥈' : '🥉'}
                </div>
              </div>
              <div className="feed-card__speed">
                <span className="speed-value">{record.speed}</span>
                <span className="speed-unit">km/h</span>
              </div>
              <div className="feed-card__details">
                <div className="feed-card__detail">
                  <span className="detail-label">Locatie</span>
                  <span className="detail-value">{record.location}</span>
                </div>
                <div className="feed-card__detail">
                  <span className="detail-label">Masina</span>
                  <span className="detail-value">{record.car}</span>
                </div>
              </div>
              <div className="feed-card__glow" />
            </div>
          ))}
        </div>
        <Link to="/leaderboard" className="btn-secondary-outline">
          Vezi clasamentul complet
        </Link>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">
            Alatura-te miscarii pentru un condus pasionat si responsabil
          </h2>
          <p className="cta-text">
            Indiferent daca esti pe circuit sau pe sosea, fii parte dintr-o
            comunitate care pune siguranta pe primul loc. Inregistreaza-te si
            incepe sa traiesti adrenalina in siguranta.
          </p>
          <div className="cta-actions">
            <Link to="/register" className="btn-primary btn-large">
              Inregistreaza-te gratuit
            </Link>
            <Link to="/community" className="btn-secondary-outline">
              Exploreaza comunitatile
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2 className="footer-logo">
              SPEED <span>RECORD</span>
            </h2>
            <p className="footer-tagline">
              Pasiunea vitezei, responsabilitatea condusului.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h3>Platforma</h3>
              <Link to="/events">Evenimente</Link>
              <Link to="/leaderboard">Clasament</Link>
              <Link to="/map">Harta</Link>
            </div>
            <div className="footer-column">
              <h3>Comunitate</h3>
              <Link to="/community">Grupuri</Link>
              <Link to="/dashboard">Profilul meu</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="footer-column">
              <h3>Legal</h3>
              <Link to="/terms">Termeni</Link>
              <Link to="/privacy">Confidentialitate</Link>
              <span>© {new Date().getFullYear()} Speed Record</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            🏁 Speed Record promoveaza condusul responsabil si legal. Toate recordurile
            sunt obtinute pe drumuri inchise, circuite sau in conditii de maxima
            siguranta. Respectati regulile de circulatie.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
