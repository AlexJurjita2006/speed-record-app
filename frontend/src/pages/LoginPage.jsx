import LoginForm from '../components/LoginForm';
import './AuthPage.css';

function LoginPage({ onLogin, onNavigate }) {
  return (
    <div className="auth-page container">
      <LoginForm
        onLogin={onLogin}
        onSwitchToRegister={() => onNavigate('register')}
      />
    </div>
  );
}

export default LoginPage;

