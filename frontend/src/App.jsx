import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MapPage from './pages/MapPage';
import CommunityPage from './pages/CommunityPage';
import EventsPage from './pages/EventsPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import DownloadPage from './pages/DownloadPage';
import OnboardingPage from './pages/OnboardingPage';
import { useAuth } from './context/AuthContext';
import { RequireOnboarding } from './components/RequireOnboarding';
import { isWebApp } from './platform';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [legacyUser, setLegacyUser] = useState(null);
  const [oauthProfile, setOauthProfile] = useState({});
  const [carDraft, setCarDraft] = useState('');
  const [carPromptError, setCarPromptError] = useState('');
  const loadingTimerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, signOut } = useAuth();

  const pathToPage = (pathname) => {
    switch (pathname) {
      case '/dashboard':
        return 'dashboard';
      case '/leaderboard':
        return 'leaderboard';
      case '/contact':
        return 'contact';
      case '/community':
        return 'community';
      case '/events':
        return 'events';
      case '/terms':
        return 'terms';
      case '/download':
        return 'download';
      case '/login':
        return 'login';
      case '/register':
        return 'register';
      case '/map':
        return 'map';
      case '/onboarding':
        return 'onboarding';
      case '/':
      default:
        return 'home';
    }
  };

  const pageToPath = (page) => {
    switch (page) {
      case 'dashboard':
        return '/dashboard';
      case 'leaderboard':
        return '/leaderboard';
      case 'contact':
        return '/contact';
      case 'community':
        return '/community';
      case 'events':
        return '/events';
      case 'terms':
        return '/terms';
      case 'download':
        return '/download';
      case 'login':
        return '/login';
      case 'register':
        return '/register';
      case 'map':
        return '/map';
      case 'onboarding':
        return '/onboarding';
      case 'home':
      default:
        return '/';
    }
  };

  const normalizedPathname = location.pathname !== '/'
    ? location.pathname.replace(/\/$/, '')
    : location.pathname;
  const currentPage = pathToPage(normalizedPathname);

  // Simulare autentificare (va fi înlocuită cu auth real)
  useEffect(() => {
    const savedUser = localStorage.getItem('speedrecord_user');
    if (savedUser) {
      try {
        setLegacyUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('speedrecord_user');
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!authUser) {
      setOauthProfile({});
      setCarDraft('');
      setCarPromptError('');
      return;
    }

    const profileKey = `speedrecord_profile_${authUser.id}`;
    const savedProfile = localStorage.getItem(profileKey);
    if (!savedProfile) {
      setOauthProfile({});
      return;
    }

    try {
      setOauthProfile(JSON.parse(savedProfile));
    } catch (error) {
      console.error('Error parsing OAuth profile:', error);
      localStorage.removeItem(profileKey);
      setOauthProfile({});
    }
  }, [authUser]);

  const handleLogin = (userData) => {
    setLegacyUser(userData);
    localStorage.setItem('speedrecord_user', JSON.stringify(userData));
    navigateTo('dashboard');
  };

  const handleRegister = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      avatar: userData.name?.charAt(0)?.toUpperCase() || '👤',
    };
    setLegacyUser(newUser);
    localStorage.setItem('speedrecord_user', JSON.stringify(newUser));
    navigateTo('dashboard');
  };

  const handleLogout = async () => {
    if (authUser) {
      await signOut();
    }
    setOauthProfile({});
    setCarDraft('');
    setCarPromptError('');
    setLegacyUser(null);
    localStorage.removeItem('speedrecord_user');
    navigateTo('home');
  };

  const oauthCar =
    (authUser && (oauthProfile?.car || authUser.user_metadata?.car || '').trim()) || '';

  const needsCarPrompt = Boolean(authUser && !oauthCar);

  const handleSaveCar = (event) => {
    event.preventDefault();
    if (!authUser) return;

    const trimmedCar = carDraft.trim();
    if (!trimmedCar) {
      setCarPromptError('Completează mașina ta pentru a continua.');
      return;
    }

    const profileKey = `speedrecord_profile_${authUser.id}`;
    const updatedProfile = { ...oauthProfile, car: trimmedCar };
    localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
    setOauthProfile(updatedProfile);
    setCarDraft('');
    setCarPromptError('');
  };

  const user = authUser
    ? {
        id: authUser.id,
        name:
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          authUser.email?.split('@')[0] ||
          'Pilot',
        email: authUser.email,
        avatar: authUser.user_metadata?.avatar_url || authUser.email?.charAt(0)?.toUpperCase() || '👤',
        avatarUrl: authUser.user_metadata?.avatar_url || '',
        car: oauthCar,
      }
    : legacyUser
      ? {
          ...legacyUser,
          avatarUrl: '',
          car: legacyUser.car || '',
        }
      : null;

  const navigateTo = (page) => {
    setIsLoading(true);
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
    navigate(pageToPath(page));
    // Simulare loading pentru tranziție smooth
    loadingTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      loadingTimerRef.current = null;
    }, 300);
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="app__loading">
          <div className="app__loading-spinner"></div>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} user={user} />;
      
      case 'dashboard':
        return <DashboardPage user={user} onNavigate={navigateTo} />;
      
      case 'leaderboard':
        return <LeaderboardPage user={user} onNavigate={navigateTo} />;

      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={navigateTo} />;

      case 'register':
        return <RegisterPage onRegister={handleRegister} onNavigate={navigateTo} />;

      case 'onboarding':
        return (
          <RequireOnboarding>
            <OnboardingPage />
          </RequireOnboarding>
        );

      case 'map':
        return <MapPage onNavigate={navigateTo} />;

      case 'community':
        return <CommunityPage user={user} onNavigate={navigateTo} />;

      case 'events':
        return <EventsPage onNavigate={navigateTo} />;

      case 'contact':
        return <ContactPage onNavigate={navigateTo} />;

      case 'terms':
        return <TermsPage onNavigate={navigateTo} />;

      case 'download':
        return isWebApp()
          ? <DownloadPage onNavigate={navigateTo} />
          : <HomePage onNavigate={navigateTo} user={user} />;

      default:
        return (
          <div className="app__error">
            <div className="app__error-icon">🏎️</div>
            <h2 className="app__error-title">Pagina nu a fost găsită</h2>
            <p className="app__error-message">
              Se pare că ai ieșit de pe traseu. Hai să revenim pe circuit!
            </p>
            <button 
              className="app__error-retry"
              onClick={() => navigateTo('home')}
            >
              Înapoi la Start
            </button>
          </div>
        );
    }
  };

  return (
    <div className="app">
      <Header 
        currentPage={currentPage}
        onNavigate={navigateTo}
        user={user}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />
      
      <main className="app__main">
        <div className="app__content app__content--fade" key={currentPage}>
          {renderPage()}
        </div>
      </main>

      <Footer onNavigate={navigateTo} />

      {needsCarPrompt && (
        <div className="app__modal-backdrop">
          <form className="app__modal" onSubmit={handleSaveCar}>
            <h3 className="app__modal-title">🚗 Completează mașina ta</h3>
            <p className="app__modal-subtitle">
              Pentru contul conectat trebuie să completezi ce mașină conduci.
            </p>
            <input
              className="app__modal-input"
              type="text"
              value={carDraft}
              onChange={(event) => {
                setCarDraft(event.target.value);
                if (carPromptError) setCarPromptError('');
              }}
              placeholder="Ex: BMW M4"
              autoFocus
            />
            {carPromptError && <p className="app__modal-error">⚠️ {carPromptError}</p>}
            <button type="submit" className="app__modal-submit">
              Salvează
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
