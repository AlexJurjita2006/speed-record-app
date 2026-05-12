import './Footer.css';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="footer__social-icon">
    <path
      fill="currentColor"
      d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 1.8A4 4 0 0 0 3.8 7.8v8.4a4 4 0 0 0 4 4h8.4a4 4 0 0 0 4-4V7.8a4 4 0 0 0-4-4H7.8Zm9.1 1.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="footer__social-icon">
    <path
      fill="currentColor"
      d="M6.94 8.5v10H3.62v-10h3.32ZM5.28 3a1.92 1.92 0 1 1 0 3.84 1.92 1.92 0 0 1 0-3.84ZM20.38 12.84v5.66h-3.31v-5.3c0-1.33-.48-2.24-1.67-2.24-.91 0-1.45.61-1.69 1.2-.09.2-.11.48-.11.76v5.58h-3.31s.04-9.06 0-10h3.31v1.42c.44-.68 1.22-1.64 2.97-1.64 2.16 0 3.81 1.42 3.81 4.46Z"
    />
  </svg>
);

function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explorare: [
      { label: 'Navigație Live', icon: '🗺️', page: 'map' },
    ],
    comunitate: [
      { label: 'Comunitate', icon: '👥', page: 'community' },
      { label: 'Evenimente', icon: '📅', page: 'events' },
    ],
    suport: [
      { label: 'Contact', icon: '📧', page: 'contact' },
      { label: 'Termeni și Condiții', icon: '📄', page: 'terms' },
    ],
  };

  const socialLinks = [
    { icon: InstagramIcon, label: 'Instagram', url: 'https://www.instagram.com/alexandru.j1/' },
    { icon: LinkedInIcon, label: 'LinkedIn', url: 'https://www.linkedin.com/in/alexandru-daniel-jurji%C8%9Ba-a255863b2/' },
  ];

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          {/* Brand Section */}
          <div className="footer__brand">
            <div className="footer__logo" onClick={() => onNavigate('home')}>
              <span className="footer__logo-icon">🏎️</span>
              <span className="footer__logo-text">
                Speed<span className="footer__logo-accent">Record</span>
              </span>
            </div>
            <p className="footer__description">
              Platforma #1 pentru pasionații de condus din România. 
              Înregistrează-ți recordurile, compară timpii și provoacă-ți 
              limitele pe cele mai spectaculoase rute auto.
            </p>
            <a className="footer__contact-mail" href="mailto:alexandru.jurjita2006@gmail.com">
              alexandru.jurjita2006@gmail.com
            </a>
            <div className="footer__social">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="footer__social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Explorare Column */}
          <div className="footer__column">
            <h3 className="footer__column-title">Explorare</h3>
            <ul className="footer__links">
              {footerLinks.explorare.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="footer__link"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(link.page);
                    }}
                  >
                    <span className="footer__link-icon">→</span>
                    <span>{link.icon}</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Comunitate Column */}
          <div className="footer__column">
            <h3 className="footer__column-title">Comunitate</h3>
            <ul className="footer__links">
              {footerLinks.comunitate.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="footer__link"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(link.page);
                    }}
                  >
                    <span className="footer__link-icon">→</span>
                    <span>{link.icon}</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Suport Column */}
          <div className="footer__column">
            <h3 className="footer__column-title">Suport</h3>
            <ul className="footer__links">
              {footerLinks.suport.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="footer__link"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(link.page);
                    }}
                  >
                    <span className="footer__link-icon">→</span>
                    <span>{link.icon}</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <div className="footer__copyright">
            © {currentYear}{' '}
            <span className="footer__copyright-highlight">SpeedRecord</span>
            . Toate drepturile rezervate. 
            🏎️ Construit pentru viteză în România.
          </div>
          <ul className="footer__bottom-links">
            <li>
              <a
                href="#"
                className="footer__bottom-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('terms');
                }}
              >
                Termeni
              </a>
            </li>
            <li>
              <a href="#" className="footer__bottom-link">
                Cookies
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
