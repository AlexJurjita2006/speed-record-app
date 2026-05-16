import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RequireOnboarding = ({ children }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#888'
      }}>
        Se încarcă...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (profile && profile.username) {
    return <Navigate to="/" replace />;
  }

  return children;
};
