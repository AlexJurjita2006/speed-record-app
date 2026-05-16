import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import './OnboardingPage.css';

const OnboardingPage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Preia avatarul default de la Google sau din profilul existent
  const defaultAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url || '';
  const defaultName = profile?.full_name || user?.user_metadata?.full_name || '';

  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);
  const [useDefaultAvatar, setUseDefaultAvatar] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Upload personalizat
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (error) {
      setError('Eroare la încărcarea imaginii');
      setUploading(false);
      return;
    }

    // Obține URL-ul public
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    setAvatarUrl(data.publicUrl);
    setUseDefaultAvatar(false);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username-ul este obligatoriu');
      return;
    }

    setSaving(true);
    const finalAvatar = useDefaultAvatar ? defaultAvatar : avatarUrl;

    // Actualizează profilul în tabela profiles
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username: username.trim(),
        avatar_url: finalAvatar,
        full_name: defaultName,
        updated_at: new Date(),
      }, { onConflict: 'id' });

    if (updateError) {
      setError('Username-ul este deja folosit sau a apărut o eroare');
      setSaving(false);
      return;
    }

    await refreshProfile(); // reîncarcă profilul în context
    setSaving(false);
    navigate('/'); // sau unde dorești
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <h1>Finalizează-ți profilul</h1>
        <p className="onboarding-subtitle">
          Alege un username și o poză de profil (sau păstreaz-o pe cea de la Google).
        </p>

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="avatar-section">
            <img
              src={useDefaultAvatar ? defaultAvatar : avatarUrl}
              alt="Avatar"
              className="onboarding-avatar"
              onError={(e) => { e.target.src = '/default-avatar.png'; }}
            />
            <div className="avatar-options">
              <label className={`avatar-option ${useDefaultAvatar ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="avatar"
                  checked={useDefaultAvatar}
                  onChange={() => setUseDefaultAvatar(true)}
                />
                Folosește poza de la Google
              </label>
              <label className={`avatar-option ${!useDefaultAvatar ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="avatar"
                  checked={!useDefaultAvatar}
                  onChange={() => setUseDefaultAvatar(false)}
                />
                Încarcă o poză personalizată
              </label>
              {!useDefaultAvatar && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              )}
            </div>
          </div>

          <div className="username-section">
            <label htmlFor="username">Username *</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Alege un username unic"
              maxLength={20}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={saving || uploading} className="btn-save">
            {saving ? 'Se salvează...' : 'Salvează și continuă'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;