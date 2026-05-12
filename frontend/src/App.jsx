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
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [legacyUser, setLegacyUser] = useState(null);
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
    setLegacyUser(null);
    localStorage.removeItem('speedrecord_user');
    navigateTo('home');
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
      }
    : legacyUser;

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

      case 'map':
        return <MapPage onNavigate={navigateTo} />;

      case 'community':
        return <CommunityPage onNavigate={navigateTo} />;

      case 'events':
        return <EventsPage onNavigate={navigateTo} />;

      case 'contact':
        return <ContactPage onNavigate={navigateTo} />;

      case 'terms':
        return <TermsPage onNavigate={navigateTo} />;

      case 'download':
        return <DownloadPage onNavigate={navigateTo} />;

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
