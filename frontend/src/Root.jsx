import App from './App';
import { useAuth } from './context/AuthContext';

const Root = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Se încarcă...</div>;
  }

  return <App />;
};

export default Root;
