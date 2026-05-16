import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path
      fill="currentColor"
      d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V4.9c-.3 0-1.4-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.5V11H7.8v3h2.7v8h3z"
    />
  </svg>
);

function Header({ currentPage, onNavigate, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user: authUser, loading } = useAuth();
  const resolvedUser = authUser ?? user;
  const metadataName = authUser?.user_metadata?.full_name;
  const metadataAvatar = authUser?.user_metadata?.avatar_url;
  const userName = metadataName || resolvedUser?.name || 'Cont';
  const avatarValue = metadataAvatar || resolvedUser?.avatar || userName.charAt(0).toUpperCase();
  const hasAvatarImage =
    typeof avatarValue === 'string' && (avatarValue.startsWith('http://') || avatarValue.startsWith('https://'));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Închide meniul când se schimbă pagina
  useEffect(() => {
    setMobileOpen(false);
  }, [currentPage]);

  const navigate = (page) => {
    setMobileOpen(false);
    onNavigate(page);
  };

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="header__container">
          <div className="header__logo" onClick={() => navigate('home')}>
            <span className="header__logo-icon">🏎️</span>
            <div className="header__logo-text">
              <span className="header__logo-title">
                Speed<span className="header__logo-accent">Record</span>
              </span>
              <span className="header__logo-subtitle">România</span>
            </div>
          </div>

          <div className="header__actions">
            <button
              className="header__btn header__btn--navigate"
              onClick={() => navigate('map')}
            >
              🗺️ Navigheaza
            </button>

            <div className="user-section">
              {loading ? null : resolvedUser ? (
                <button
                  className="header__btn header__btn--user user-profile"
                  onClick={() => navigate('dashboard')}
                >
                  <span className="header__user-avatar">
                    {hasAvatarImage ? (
                      <img src={avatarValue} alt={userName} />
                    ) : (
                      <span>{String(avatarValue).slice(0, 1).toUpperCase()}</span>
                    )}
                  </span>
                  <span className="header__user-name">{userName}</span>
                </button>
              ) : (
                <div className="auth-buttons">
                  <button
                    className="header__btn header__btn--auth"
                    onClick={() => navigate('login')}
                  >
                    <FacebookIcon />
                    Autentificare
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            className="header__mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Meniu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

       <div className={`header__mobile-nav ${mobileOpen ? 'header__mobile-nav--open' : ''}`}>
          <button className="header__mobile-link" onClick={() => navigate('map')}>
            🗺️ Navigheaza
          </button>
          {loading ? null : resolvedUser ? (
            <>
              <button className="header__mobile-link header__mobile-link--profile" onClick={() => navigate('dashboard')}>
                <span className="header__user-avatar">
                  {hasAvatarImage ? (
                    <img src={avatarValue} alt={userName} />
                  ) : (
                    <span>{String(avatarValue).slice(0, 1).toUpperCase()}</span>
                  )}
                </span>
                <span className="header__user-name">{userName}</span>
              </button>
              <button className="header__mobile-link" onClick={() => { onLogout(); setMobileOpen(false); }}>
                🚪 Deconectare
              </button>
            </>
          ) : (
            <button className="header__mobile-auth" onClick={() => navigate('login')}>
              <FacebookIcon />
              Autentificare
            </button>
         )}
       </div>
    </>
  );
}

export default Header;
