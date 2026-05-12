import { useState } from 'react';
import RecordForm from '../components/RecordForm';
import Leaderboard from '../components/Leaderboard';
import './DashboardPage.css';

function DashboardPage({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('records');
  const [showForm, setShowForm] = useState(false);
  
  // Date simulate pentru istoric
  const [myRecords, setMyRecords] = useState([
    { id: 1, route: 'Ineu → Timișoara', time: '1:23:45', speed: '127', date: '2026-04-28', car: 'BMW M4' },
    { id: 2, route: 'București → Brașov', time: '2:05:30', speed: '118', date: '2026-04-15', car: 'Porsche 911' },
    { id: 3, route: 'Cluj → Sibiu', time: '1:55:12', speed: '122', date: '2026-03-30', car: 'Audi RS6' },
  ]);

  const handleNewRecord = (record) => {
    setMyRecords(prev => [
      {
        id: Date.now(),
        route: `${record.route?.origin || '?'} → ${record.route?.destination || '?'}`,
        time: record.time,
        speed: record.speed,
        date: new Date().toLocaleDateString('ro-RO'),
        car: record.car
      },
      ...prev
    ]);
    setShowForm(false);
  };

  return (
    <div className="dashboard container">
      {/* Header personal */}
      <div className="dashboard__header">
        <div className="dashboard__welcome">
          <div className="dashboard__avatar">
            {user?.name?.charAt(0)?.toUpperCase() || '👤'}
          </div>
          <div>
            <div className="dashboard__greeting">Bine ai revenit,</div>
            <div className="dashboard__username">{user?.name || 'Pilot'}</div>
          </div>
        </div>
        <button 
          className="dashboard__quick-action"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Închide' : '🏁 Record Nou'}
        </button>
      </div>

      {/* Formular înregistrare (expandabil) */}
      {showForm && (
        <div className="dashboard__card dashboard__card--full" style={{ marginBottom: 'var(--spacing-6)' }}>
          <RecordForm 
            route={{ origin: 'Ineu', destination: 'Timișoara' }} 
            onSubmit={handleNewRecord} 
          />
        </div>
      )}

      {/* Grid Dashboard */}
      <div className="dashboard__grid">
        {/* Statistici generale */}
        <div className="dashboard__card dashboard__card--full">
          <div className="dashboard__card-header">
            <h3 className="dashboard__card-title">📊 Statistici Pilot</h3>
          </div>
          <div className="dashboard__mini-stats">
            <div className="dashboard__mini-stat">
              <div className="dashboard__mini-stat-value">{myRecords.length}</div>
              <div className="dashboard__mini-stat-label">Recorduri</div>
            </div>
            <div className="dashboard__mini-stat">
              <div className="dashboard__mini-stat-value">
                {myRecords.length > 0 ? myRecords[0].time : '--'}
              </div>
              <div className="dashboard__mini-stat-label">Cel mai bun timp</div>
            </div>
            <div className="dashboard__mini-stat">
              <div className="dashboard__mini-stat-value">
                {myRecords.length > 0 ? Math.max(...myRecords.map(r => parseInt(r.speed) || 0)) : '--'} km/h
              </div>
              <div className="dashboard__mini-stat-label">Viteză maximă</div>
            </div>
            <div className="dashboard__mini-stat">
              <div className="dashboard__mini-stat-value">
                {new Set(myRecords.map(r => r.car)).size}
              </div>
              <div className="dashboard__mini-stat-label">Mașini folosite</div>
            </div>
          </div>
          
          {/* Grafic evoluție (placeholder) */}
          <div className="dashboard__chart-placeholder">
            📈 Graficul evoluției timpilor va apărea aici
          </div>
        </div>

        {/* Recordurile mele */}
        <div className="dashboard__card">
          <div className="dashboard__card-header">
            <h3 className="dashboard__card-title">🏎️ Recordurile Mele</h3>
          </div>
          <div className="dashboard__record-list">
            {myRecords.slice(0, 5).map(record => (
              <div key={record.id} className="dashboard__record-item">
                <div>
                  <div className="dashboard__record-route">{record.route}</div>
                  <div className="dashboard__record-date">{record.date} · {record.car}</div>
                </div>
                <div className="dashboard__record-time">{record.time}</div>
              </div>
            ))}
            {myRecords.length === 0 && (
              <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                Niciun record încă. Apasă "Record Nou" pentru a începe!
              </p>
            )}
          </div>
        </div>

        {/* Clasament rapid */}
        <div className="dashboard__card">
          <div className="dashboard__card-header">
            <h3 className="dashboard__card-title">🏆 Top pe Ruta Ta</h3>
          </div>
          <Leaderboard 
            entries={myRecords.map((r, idx) => ({
              ...r,
              rank: idx + 1,
              userName: user?.name || 'Tu',
              avatar: user?.name?.charAt(0) || '👤',
              vehicle: r.car,
              date: r.date
            }))}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;