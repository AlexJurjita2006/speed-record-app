import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginForm.css';

// Iconițe SVG exacte (Google G, Instagram)
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path
      fill="currentColor"
      d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V4.9c-.3 0-1.4-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.5V11H7.8v3h2.7v8h3z"
    />
  </svg>
);

function LoginForm({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signInWithGoogle, signInWithInstagram, signInWithPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Completează toate câmpurile!');
      return;
    }

    const { data, error: authError } = await signInWithPassword(email, password);
    if (authError) {
      setError(authError.message);
      return;
    }

    if (data?.user) {
      onLogin({
        id: data.user.id,
        name:
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          data.user.email?.split('@')[0] ||
          'Pilot',
        email: data.user.email,
        avatar: data.user.user_metadata?.avatar_url || data.user.email?.charAt(0)?.toUpperCase() || '👤',
      });
    }
  };

  const handleGoogleLogin = async () => {
    const { error: oauthError } = await signInWithGoogle();
    if (oauthError) {
      setError(oauthError.message);
    }
  };

  const handleFacebookLogin = async () => {
    const { error: oauthError } = await signInWithInstagram();
    if (oauthError) {
      setError(oauthError.message);
    }
  };

  return (
    <div className="login-form">
      <div className="login-form__header">
        <div className="login-form__logo">🔐</div>
        <h2 className="login-form__title">Conectare Pilot</h2>
        <p className="login-form__subtitle">Intră în cockpitul tău</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="login-form__group">
          <label className="login-form__label">Email</label>
          <div className="login-form__input-wrapper">
            <span className="login-form__icon">📧</span>
            <input
              className="login-form__input"
              type="email"
              placeholder="pilot@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="login-form__group">
          <label className="login-form__label">Parolă</label>
          <div className="login-form__input-wrapper">
            <span className="login-form__icon">🔑</span>
            <input
              className="login-form__input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="login-form__forgot">
            <span className="login-form__forgot-link">Ai uitat parola?</span>
          </div>
        </div>

        {error && (
          <div style={{ color: 'var(--color-error)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            ⚠️ {error}
          </div>
        )}

        <button type="submit" className="login-form__submit">
          🏎️ Conectează-te
        </button>
      </form>

      <div className="login-form__divider">
        <span className="login-form__divider-line"></span>
        <span className="login-form__divider-text">sau</span>
        <span className="login-form__divider-line"></span>
      </div>

      <div className="login-form__socials">
        <button
          className="login-form__social-btn login-form__social-btn--google"
          onClick={handleGoogleLogin}
          title="Conectează-te cu Google"
        >
          <GoogleIcon />
          <span>Google</span>
        </button>
        <button
          className="login-form__social-btn login-form__social-btn--instagram"
          onClick={handleFacebookLogin}
          title="Conectează-te cu Facebook"
        >
          <FacebookIcon />
          <span>Facebook</span>
        </button>
      </div>

      <div className="login-form__footer">
        Nu ai cont?{' '}
        <span className="login-form__link" onClick={onSwitchToRegister}>
          Înregistrează-te
        </span>
      </div>
    </div>
  );
}

export default LoginForm;
