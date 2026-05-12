import RegisterForm from '../components/RegisterForm';
import './AuthPage.css';

function RegisterPage({ onRegister, onNavigate }) {
  return (
    <div className="auth-page container">
      <RegisterForm
        onRegister={onRegister}
        onSwitchToLogin={() => onNavigate('login')}
      />
    </div>
  );
}

export default RegisterPage;

