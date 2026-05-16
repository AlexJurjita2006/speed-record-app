import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NavigationPanel.css';

const NavigationPanel = () => {
  const { user, profile, signInWithGoogle, signOut } = useAuth();
  const [imgError, setImgError] = useState(false);

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const displayName = profile?.username || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilizator';
  const username = profile?.username ? `@${profile.username}` : '';

  return (
    <nav className="nav-panel">
      <Link to="/" className="nav-logo">SPEED RECORD</Link>

      <div className="nav-links">
        <Link to="/events">Evenimente</Link>
        <Link to="/community">Comunități</Link>
        <Link to="/leaderboard">Clasament</Link>
        <Link to="/map">Hartă</Link>
      </div>

      <div className="nav-auth">
        {user ? (
          <div className="user-menu">
            {!imgError && avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="user-avatar"
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="user-avatar placeholder-avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="user-info">
              <span className="user-name">{displayName}</span>
              {username && <span className="user-username">{username}</span>}
            </div>
            <button onClick={signOut} className="btn-signout" title="Deconectează-te">⏻</button>
          </div>
        ) : (
          <button onClick={signInWithGoogle} className="btn-google-login">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Conectează-te cu Google
          </button>
        )}

        <Link to="/download" className="nav-download-btn">
          📱 Instalează aplicația
        </Link>
      </div>
    </nav>
  );
};

export default NavigationPanel;
