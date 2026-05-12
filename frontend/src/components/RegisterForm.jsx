import { useState } from 'react';
import './RegisterForm.css';

function RegisterForm({ onRegister, onSwitchToLogin }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [car, setCar] = useState('');
  const [color, setColor] = useState('#00d4ff'); // default electric
  const [plate, setPlate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!name || !email) {
        setError('Completează numele și emailul');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!password || password.length < 6) {
        setError('Parola trebuie să aibă minim 6 caractere');
        return;
      }
      setStep(3);
    } else {
      if (!car) {
        setError('Alege mașina ta');
        return;
      }
      onRegister({ name, email, car, color, plate: plate || undefined });
    }
  };

  return (
    <div className="login-form register-form">
      <div className="login-form__header">
        <div className="login-form__logo">🏁</div>
        <h2 className="login-form__title">Devino Pilot</h2>
        <p className="login-form__subtitle">Pasul {step} din 3</p>
        <div className="register-form__steps">
          <span className={`register-form__step-dot ${step >= 1 ? 'register-form__step-dot--active' : ''}`}></span>
          <span className={`register-form__step-dot ${step >= 2 ? 'register-form__step-dot--active' : ''}`}></span>
          <span className={`register-form__step-dot ${step >= 3 ? 'register-form__step-dot--active' : ''}`}></span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <div className="login-form__group">
              <label className="login-form__label">Nume Pilot</label>
              <div className="login-form__input-wrapper">
                <span className="login-form__icon">🏎️</span>
                <input className="login-form__input" placeholder="ex: SpeedMaster" value={name} onChange={e => setName(e.target.value)} />
              </div>
            </div>
            <div className="login-form__group">
              <label className="login-form__label">Email</label>
              <div className="login-form__input-wrapper">
                <span className="login-form__icon">📧</span>
                <input className="login-form__input" type="email" placeholder="pilot@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="login-form__group">
              <label className="login-form__label">Parolă</label>
              <div className="login-form__input-wrapper">
                <span className="login-form__icon">🔐</span>
                <input className="login-form__input" type="password" placeholder="minim 6 caractere" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
            <div className="login-form__group">
              <label className="login-form__label">Confirmă Parola</label>
              <div className="login-form__input-wrapper">
                <span className="login-form__icon">🔐</span>
                <input className="login-form__input" type="password" placeholder="reintrodu parola" />
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="login-form__group">
              <label className="login-form__label">Mașina ta</label>
              <div className="login-form__input-wrapper">
                <span className="login-form__icon">🚗</span>
                <input className="login-form__input" placeholder="ex: BMW M4" value={car} onChange={e => setCar(e.target.value)} />
              </div>
            </div>
            <div className="login-form__group">
              <label className="login-form__label">Culoare (opțional)</label>
              <div className="login-form__input-wrapper" style={{ alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '2px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    background: 'none',
                    cursor: 'pointer',
                    padding: '2px'
                  }}
                />
                <input className="login-form__input" placeholder="ex: Albastru electric" value={color} onChange={e => setColor(e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>
            <div className="login-form__group">
              <label className="login-form__label">Număr de înmatriculare (opțional)</label>
              <div className="login-form__input-wrapper">
                <span className="login-form__icon">🔢</span>
                <input className="login-form__input" placeholder="ex: B 123 XYZ" value={plate} onChange={e => setPlate(e.target.value)} />
              </div>
            </div>
          </>
        )}

        {error && <div style={{ color: 'var(--color-error)', fontSize: '0.875rem', marginBottom: '1rem' }}>⚠️ {error}</div>}

        <button type="submit" className="login-form__submit">
          {step === 3 ? '🚀 Creează Contul' : '➡️ Continuă'}
        </button>

        {step > 1 && (
          <button type="button" className="login-form__submit" style={{ background: 'transparent', border: '1px solid var(--color-border)', marginTop: '0.5rem' }} onClick={() => setStep(s => s - 1)}>
            ⬅️ Înapoi
          </button>
        )}
      </form>

      <div className="login-form__footer">
        Ai deja cont?{' '}
        <span className="login-form__link" onClick={onSwitchToLogin}>
          Conectează-te
        </span>
      </div>
    </div>
  );
}

export default RegisterForm;