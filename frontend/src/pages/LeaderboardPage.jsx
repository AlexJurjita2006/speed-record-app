import { useState, useEffect } from 'react';
import Leaderboard from '../components/Leaderboard';
import './LeaderboardPage.css';

function LeaderboardPage({ onNavigate }) {
  const [selectedCounty, setSelectedCounty] = useState('all');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [entries, setEntries] = useState([]);

  const counties = ['Toate județele', 'Arad', 'Timiș', 'București', 'Cluj', 'Brașov', 'Sibiu', 'Argeș', 'Gorj'];
  const routes = ['Toate rutele', 'Ineu → Timișoara', 'București → Brașov', 'Cluj → Sibiu', 'Transfăgărășan', 'Transalpina'];

  // Simulare date complete
  useEffect(() => {
    const allEntries = [
      { id: 1, rank: 1, userName: 'AlexM', fullName: 'Alexandru M.', avatar: 'AM', time: '1:23:45', speed: '127', vehicle: 'BMW M4', date: '2026-04-28', trend: 'up', county: 'Arad', route: 'Ineu → Timișoara' },
      { id: 2, rank: 2, userName: 'SpeedKing', fullName: 'Mihai V.', avatar: 'SV', time: '1:24:12', speed: '125', vehicle: 'Porsche 911', date: '2026-04-30', trend: 'down', county: 'Timiș', route: 'Ineu → Timișoara' },
      { id: 3, rank: 3, userName: 'TurboGirl', fullName: 'Elena D.', avatar: 'TG', time: '1:25:03', speed: '123', vehicle: 'Audi RS6', date: '2026-05-01', trend: 'up', county: 'București', route: 'București → Brașov' },
      { id: 4, rank: 4, userName: 'NightRider', fullName: 'Andrei P.', avatar: 'NR', time: '1:25:45', speed: '121', vehicle: 'Tesla Model S', date: '2026-05-02', trend: 'same', county: 'Cluj', route: 'Cluj → Sibiu' },
      { id: 5, rank: 5, userName: 'VitezaMax', fullName: 'Cristian B.', avatar: 'VM', time: '1:26:20', speed: '120', vehicle: 'Mercedes AMG', date: '2026-05-03', trend: 'up', county: 'Brașov', route: 'București → Brașov' },
      { id: 6, rank: 6, userName: 'RoADKing', fullName: 'George I.', avatar: 'RK', time: '1:27:10', speed: '118', vehicle: 'Subaru WRX', date: '2026-04-29', trend: 'down', county: 'Argeș', route: 'Transfăgărășan' },
      { id: 7, rank: 7, userName: 'SpeedHunter', fullName: 'Ioana M.', avatar: 'SH', time: '1:28:05', speed: '116', vehicle: 'Ford Focus RS', date: '2026-05-01', trend: 'up', county: 'Gorj', route: 'Transalpina' },
    ];

    let filtered = allEntries;
    if (selectedCounty !== 'all') {
      filtered = filtered.filter(e => e.county === selectedCounty);
    }
    if (selectedRoute !== 'all') {
      filtered = filtered.filter(e => e.route === selectedRoute);
    }

    setEntries(filtered.map((e, idx) => ({ ...e, rank: idx + 1 })));
  }, [selectedCounty, selectedRoute]);

  return (
    <div className="leaderboard-page container">
      <div className="leaderboard-page__header">
        <h1 className="leaderboard-page__title">🏆 Clasament Național</h1>
        <p className="leaderboard-page__subtitle">
          Cei mai rapizi piloți din România, pe județe și rute
        </p>
      </div>

      {/* Filtre */}
      <div className="leaderboard-page__filters">
        <select 
          className="leaderboard-page__filter-select"
          value={selectedCounty}
          onChange={(e) => setSelectedCounty(e.target.value)}
        >
          {counties.map(c => (
            <option key={c} value={c === 'Toate județele' ? 'all' : c}>{c}</option>
          ))}
        </select>

        <select 
          className="leaderboard-page__filter-select"
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
        >
          {routes.map(r => (
            <option key={r} value={r === 'Toate rutele' ? 'all' : r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Clasament */}
      <Leaderboard 
        entries={entries}
        route={selectedRoute !== 'all' ? { origin: selectedRoute.split(' → ')[0], destination: selectedRoute.split(' → ')[1] } : null}
        onEntryClick={(entry) => console.log('Detalii pilot:', entry)}
      />
    </div>
  );
}

export default LeaderboardPage;