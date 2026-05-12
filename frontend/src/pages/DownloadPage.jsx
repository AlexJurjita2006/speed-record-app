import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DownloadPage.css';

const DownloadPage = () => {
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [copied, setCopied] = useState(false);

  // URL permanent către cel mai recent APK din GitHub Releases
  const downloadUrl = 'https://github.com/AlexJurjita2006/speed-record-app/releases/latest/download/SpeedRecord.apk';
  const githubReleasesUrl = 'https://github.com/AlexJurjita2006/speed-record-app/releases/latest';

  useEffect(() => {
    // Detectare sistem de operare
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      setIsAndroid(true);
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setIsIOS(true);
    } else {
      setIsDesktop(true);
    }
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(downloadUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const features = [
    {
      icon: '📡',
      title: 'Track & Record',
      description: 'Înregistrează-ți performanțele pe circuite și drumuri închise.',
    },
    {
      icon: '🏁',
      title: 'Evenimente Exclusive',
      description: 'Drift, drag racing, expoziții auto – fii primul care află.',
    },
    {
      icon: '👥',
      title: 'Comunități Auto',
      description: 'Conectează-te cu peste 50.000 de pasionați.',
    },
    {
      icon: '🛡️',
      title: 'Siguranță & Legalitate',
      description: 'Promovăm condusul responsabil pe drumurile publice.',
    },
  ];

  const steps = [
    {
      step: '1',
      title: 'Descarcă APK-ul',
      description: 'Apasă butonul de download și salvează fișierul pe telefon.',
    },
    {
      step: '2',
      title: 'Activează sursele necunoscute',
      description: 'Setări → Securitate → Permite instalarea din surse necunoscute.',
    },
    {
      step: '3',
      title: 'Instalează aplicația',
      description: 'Deschide fișierul descărcat și urmează pașii de instalare.',
    },
    {
      step: '4',
      title: 'Bucură-te de viteză!',
      description: 'Autentifică-te și intră în comunitatea Speed Record.',
    },
  ];

  const faqs = [
    {
      question: 'Este aplicația gratuită?',
      answer: 'Da, Speed Record este complet gratuit. Toate funcționalitățile sunt disponibile fără costuri.',
    },
    {
      question: 'De ce nu apare în Google Play?',
      answer: 'Momentan distribuim aplicația direct pentru a oferi actualizări mai rapide. În viitor va fi disponibilă și în magazinele oficiale.',
    },
    {
      question: 'Cum primesc actualizări?',
      answer: 'De fiecare dată când deschizi aplicația, vei fi notificat dacă există o versiune nouă. Poți descărca oricând ultima versiune de pe această pagină.',
    },
    {
      question: 'Funcționează pe iOS?',
      answer: 'Momentan aplicația este disponibilă doar pentru Android. Versiunea pentru iOS este în dezvoltare și va fi lansată în curând.',
    },
    {
      question: 'Este sigur să instalez APK-ul?',
      answer: 'Da, absolut. Aplicația este construită open-source, codul este public pe GitHub, iar fiecare build este generat automat prin GitHub Actions, fără intervenție manuală.',
    },
  ];

  return (
    <div className="download-page">
      {/* ===== HERO ===== */}
      <section className="download-hero">
        <div className="download-hero__overlay" />
        <div className="download-hero__content">
          <div className="download-hero__icon-wrapper">
            <img
              src="/resources/icon.png"
              alt="Speed Record Logo"
              className="download-hero__icon"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span style="font-size:5rem">🏎️</span>';
              }}
            />
          </div>
          <h1 className="download-hero__title">
            <span className="download-hero__title--accent">SPEED</span>{' '}
            <span className="download-hero__title--light">RECORD</span>
          </h1>
          <p className="download-hero__subtitle">
            Instalează aplicația și alătură-te celei mai mari comunități auto din România
          </p>

          {/* Badge versiune */}
          <div className="download-hero__version">
            <span className="version-badge">v1.0.0</span>
            <span className="version-badge version-badge--android">Android</span>
          </div>

          {/* Buton principal de download */}
          {isAndroid || isDesktop ? (
            <div className="download-hero__actions">
              <a
                href={downloadUrl}
                className="download-btn download-btn--primary"
                download
              >
                <svg className="download-btn__icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Descarcă APK
                <span className="download-btn__size">~15 MB</span>
              </a>

              <button
                onClick={handleCopyLink}
                className="download-btn download-btn--secondary"
              >
                {copied ? '✅ Link copiat!' : '📋 Copiază link-ul'}
              </button>

              <a
                href={githubReleasesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="download-btn download-btn--ghost"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub Releases
              </a>
            </div>
          ) : isIOS ? (
            <div className="download-hero__ios-message">
              <span className="ios-icon">🍎</span>
              <h3>Versiunea iOS este în dezvoltare</h3>
              <p>
                Momentan Speed Record este disponibil doar pe Android.
                Între timp, poți accesa versiunea web de pe telefonul tău.
              </p>
              <Link to="/" className="download-btn download-btn--primary">
                Accesează versiunea web
              </Link>
            </div>
          ) : null}
        </div>

        {/* Efect de particule */}
        <div className="download-hero__particles">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="download-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${3 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="download-features">
        <div className="download-features__header">
          <h2 className="section-title">Ce primești odată cu aplicația</h2>
          <p className="section-subtitle">Toate funcționalitățile platformei, direct pe telefonul tău</p>
        </div>
        <div className="download-features__grid">
          {features.map((feature, index) => (
            <div className="download-feature-card" key={index}>
              <div className="download-feature-card__icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== INSTALARE PAȘI ===== */}
      <section className="download-steps">
        <div className="download-steps__header">
          <h2 className="section-title">Cum instalezi aplicația</h2>
          <p className="section-subtitle">Doar 4 pași simpli și ești pe drumul cel bun</p>
        </div>
        <div className="download-steps__timeline">
          {steps.map((item, index) => (
            <div className="download-step" key={index}>
              <div className="download-step__number">{item.step}</div>
              <div className="download-step__content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              {index < steps.length - 1 && <div className="download-step__connector" />}
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA SECUNDAR ===== */}
      <section className="download-cta">
        <div className="download-cta__content">
          <h2>Ești pe desktop?</h2>
          <p>
            Scanează codul QR cu telefonul sau copiază link-ul și trimite-l pe WhatsApp.
            Instalarea durează mai puțin de un minut.
          </p>
          <div className="download-cta__actions">
            <button onClick={handleCopyLink} className="download-btn download-btn--primary">
              {copied ? '✅ Link copiat!' : '📋 Copiază link-ul'}
            </button>
            <Link to="/community" className="download-btn download-btn--secondary">
              Intră în comunitate
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="download-faq">
        <div className="download-faq__header">
          <h2 className="section-title">Întrebări frecvente</h2>
        </div>
        <div className="download-faq__grid">
          {faqs.map((faq, index) => (
            <details className="download-faq__item" key={index} open={index === 0}>
              <summary className="download-faq__question">{faq.question}</summary>
              <p className="download-faq__answer">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ===== FOOTER MINI ===== */}
      <footer className="download-footer">
        <p>
          🏁 Speed Record &copy; {new Date().getFullYear()} &mdash; Toate recordurile sunt obținute în condiții legale, pe circuite sau drumuri închise.
        </p>
      </footer>
    </div>
  );
};

export default DownloadPage;