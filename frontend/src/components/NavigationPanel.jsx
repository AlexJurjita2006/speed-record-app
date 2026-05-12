import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './NavigationPanel.css';

function NavigationPanel({ instruction, distance, direction, streetName, eta, totalDistance, onStop, compact = false }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const formatDistance = (meters) => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
  };

  // Citire vocală a instrucțiunii
  useEffect(() => {
    if (instruction && 'speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(instruction);
      utter.lang = 'ro-RO';
      window.speechSynthesis.speak(utter);
    }
  }, [instruction]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className={`nav-panel ${compact ? 'nav-panel--compact' : ''}`}>
      <button className="nav-panel__close" onClick={onStop}>✕</button>

      {/* User Info Section */}
      {user ? (
        <div className="nav-panel__user">
          {user.user_metadata?.avatar_url && (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="avatar" 
              className="nav-panel__avatar" 
            />
          )}
          <div className="nav-panel__user-info">
            <span className="nav-panel__user-name">
              {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Pilot'}
            </span>
          </div>
          <button 
            className="nav-panel__logout-btn"
            onClick={handleLogout}
            title="Deconectează-te"
          >
            🚪
          </button>
        </div>
      ) : (
        <div className="nav-panel__login">
          <a 
            href="#"
            className="nav-panel__login-link"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
          >
            🔐 Conectează-te
          </a>
        </div>
      )}

      <div className="nav-panel__instruction">
        <span className={`nav-panel__icon nav-panel__icon--${direction || 'straight'}`}>
          {direction === 'left' ? '↰' : direction === 'right' ? '↱' : '↑'}
        </span>
        <div>
          <div className="nav-panel__text">{instruction}</div>
          {streetName && <div className="nav-panel__street">{streetName}</div>}
        </div>
      </div>
      <div className="nav-panel__distance">
        {distance > 0 ? `în ${formatDistance(distance)}` : 'Sosire'}
      </div>
      {eta && <div className="nav-panel__eta">ETA: {eta}</div>}
      {totalDistance && <div className="nav-panel__total">Rămas: {formatDistance(totalDistance)}</div>}
    </div>
  );
}

export default NavigationPanel;
