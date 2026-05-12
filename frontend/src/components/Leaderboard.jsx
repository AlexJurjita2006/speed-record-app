import { useState, useEffect } from 'react';
import './Leaderboard.css';

function Leaderboard({ route = null, entries = [], onEntryClick }) {
  const [activeTab, setActiveTab] = useState('all');
  const [highlightedUserId, setHighlightedUserId] = useState(null);

  // Simulare date pentru exemplu
  const defaultEntries = [
    {
      id: 1,
      rank: 1,
      userName: 'AlexM',
      fullName: 'Alexandru M.',
      avatar: 'AM',
      time: '1:23:45',
      speed: '127',
      vehicle: 'BMW M4',
      date: '2026-04-28',
      trend: 'up',
    },
    {
      id: 2,
      rank: 2,
      userName: 'SpeedKing',
      fullName: 'Mihai V.',
      avatar: 'SV',
      time: '1:24:12',
      speed: '125',
      vehicle: 'Porsche 911',
      date: '2026-04-30',
      trend: 'down',
    },
    {
      id: 3,
      rank: 3,
      userName: 'TurboGirl',
      fullName: 'Elena D.',
      avatar: 'TG',
      time: '1:25:03',
      speed: '123',
      vehicle: 'Audi RS6',
      date: '2026-05-01',
      trend: 'up',
    },
    {
      id: 4,
      rank: 4,
      userName: 'NightRider',
      fullName: 'Andrei P.',
      avatar: 'NR',
      time: '1:25:45',
      speed: '121',
      vehicle: 'Tesla Model S',
      date: '2026-05-02',
      trend: 'same',
    },
    {
      id: 5,
      rank: 5,
      userName: 'VitezaMax',
      fullName: 'Cristian B.',
      avatar: 'VM',
      time: '1:26:20',
      speed: '120',
      vehicle: 'Mercedes AMG',
      date: '2026-05-03',
      trend: 'up',
    },
    {
      id: 6,
      rank: 6,
      userName: 'RoADKing',
      fullName: 'George I.',
      avatar: 'RK',
      time: '1:27:10',
      speed: '118',
      vehicle: 'Subaru WRX',
      date: '2026-04-29',
      trend: 'down',
    },
    {
      id: 7,
      rank: 7,
      userName: 'SpeedHunter',
      fullName: 'Ioana M.',
      avatar: 'SH',
      time: '1:28:05',
      speed: '116',
      vehicle: 'Ford Focus RS',
      date: '2026-05-01',
      trend: 'up',
    },
  ];

  const displayEntries = entries.length > 0 ? entries : defaultEntries;

  // Separăm top 3 pentru podium
  const topThree = displayEntries.slice(0, 3);
  const restEntries = displayEntries.slice(3);

  const getPodiumClass = (rank) => {
    switch (rank) {
      case 1: return 'leaderboard__podium-card--gold';
      case 2: return 'leaderboard__podium-card--silver';
      case 3: return 'leaderboard__podium-card--bronze';
      default: return '';
    }
  };

  const getRankBadgeClass = (rank) => {
    switch (rank) {
      case 1: return 'leaderboard__rank-badge--gold';
      case 2: return 'leaderboard__rank-badge--silver';
      case 3: return 'leaderboard__rank-badge--bronze';
      default: return '';
    }
  };

  const getRankDisplay = (rank) => {
    switch (rank) {
      case 1: return { icon: '👑', text: '1' };
      case 2: return { icon: '🥈', text: '2' };
      case 3: return { icon: '🥉', text: '3' };
      default: return { icon: '', text: rank.toString() };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getTrendDisplay = (trend) => {
    switch (trend) {
      case 'up': return { icon: '▲', class: 'leaderboard__trend--up' };
      case 'down': return { icon: '▼', class: 'leaderboard__trend--down' };
      default: return { icon: '●', class: '' };
    }
  };

  return (
    <div className="leaderboard">
      {/* Header */}
      <div className="leaderboard__header">
        <h2 className="leaderboard__title">
          🏆 Clasament Recorduri
        </h2>
        <p className="leaderboard__subtitle">
          {route 
            ? `Ruta: ${route.origin} → ${route.destination}`
            : 'Cei mai rapizi piloți din România'
          }
        </p>
      </div>

      {/* Top 3 Podium */}
      {topThree.length >= 3 && (
        <div className="leaderboard__podium">
          {/* Locul 2 - Silver */}
          {topThree[1] && (
            <div className={`leaderboard__podium-card ${getPodiumClass(2)}`}>
              <div className="leaderboard__rank-badge leaderboard__rank-badge--silver">
                🥈
              </div>
              <div className="leaderboard__podium-avatar">
                {topThree[1].avatar}
              </div>
              <div className="leaderboard__podium-name">
                {topThree[1].userName}
              </div>
              <div className="leaderboard__podium-time">
                {topThree[1].time}
              </div>
              <div className="leaderboard__podium-details">
                <div className="leaderboard__podium-stat">
                  <span>🚗</span>
                  {topThree[1].vehicle}
                </div>
                <div className="leaderboard__podium-stat">
                  <span>⚡</span>
                  {topThree[1].speed} km/h
                </div>
              </div>
            </div>
          )}

          {/* Locul 1 - Gold */}
          {topThree[0] && (
            <div className={`leaderboard__podium-card ${getPodiumClass(1)}`}>
              <div className="leaderboard__crown">👑</div>
              <div className="leaderboard__rank-badge leaderboard__rank-badge--gold">
                🥇
              </div>
              <div className="leaderboard__podium-avatar">
                {topThree[0].avatar}
              </div>
              <div className="leaderboard__podium-name">
                {topThree[0].userName}
              </div>
              <div className="leaderboard__podium-time">
                {topThree[0].time}
              </div>
              <div className="leaderboard__podium-details">
                <div className="leaderboard__podium-stat">
                  <span>🚗</span>
                  {topThree[0].vehicle}
                </div>
                <div className="leaderboard__podium-stat">
                  <span>⚡</span>
                  {topThree[0].speed} km/h
                </div>
              </div>
            </div>
          )}

          {/* Locul 3 - Bronze */}
          {topThree[2] && (
            <div className={`leaderboard__podium-card ${getPodiumClass(3)}`}>
              <div className="leaderboard__rank-badge leaderboard__rank-badge--bronze">
                🥉
              </div>
              <div className="leaderboard__podium-avatar">
                {topThree[2].avatar}
              </div>
              <div className="leaderboard__podium-name">
                {topThree[2].userName}
              </div>
              <div className="leaderboard__podium-time">
                {topThree[2].time}
              </div>
              <div className="leaderboard__podium-details">
                <div className="leaderboard__podium-stat">
                  <span>🚗</span>
                  {topThree[2].vehicle}
                </div>
                <div className="leaderboard__podium-stat">
                  <span>⚡</span>
                  {topThree[2].speed} km/h
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lista completă */}
      <div className="leaderboard__list">
        {/* Table Header - vizibil doar pe desktop */}
        <div className="leaderboard__table-header">
          <div>Loc</div>
          <div>Pilot</div>
          <div>Timp</div>
          <div>Viteză</div>
          <div>Data</div>
        </div>

        {displayEntries.map((entry) => {
          const rankDisplay = getRankDisplay(entry.rank);
          const trendDisplay = getTrendDisplay(entry.trend);
          const isTopThree = entry.rank <= 3;
          
          return (
            <div
              key={entry.id}
              className={`leaderboard__row ${
                isTopThree ? 'leaderboard__row--top-three' : ''
              } ${
                highlightedUserId === entry.id ? 'leaderboard__row--highlighted' : ''
              }`}
              onClick={() => {
                setHighlightedUserId(entry.id);
                if (onEntryClick) onEntryClick(entry);
              }}
              onMouseEnter={() => setHighlightedUserId(entry.id)}
              onMouseLeave={() => setHighlightedUserId(null)}
            >
              {/* Rank */}
              <div className={`leaderboard__rank ${
                isTopThree ? 'leaderboard__rank--top' : ''
              }`}>
                {isTopThree ? (
                  <span className="leaderboard__rank-icon">
                    {rankDisplay.icon}
                  </span>
                ) : (
                  rankDisplay.text
                )}
              </div>

              {/* User Info */}
              <div className="leaderboard__user">
                <div className="leaderboard__user-avatar">
                  {entry.avatar}
                </div>
                <div className="leaderboard__user-info">
                  <div className="leaderboard__user-name">
                    {entry.userName}
                    {entry.trend && entry.trend !== 'same' && (
                      <span className={`leaderboard__trend ${trendDisplay.class}`}>
                        {trendDisplay.icon}
                      </span>
                    )}
                  </div>
                  <div className="leaderboard__user-vehicle">
                    <span>🚗</span>
                    {entry.vehicle}
                  </div>
                </div>
              </div>

              {/* Time */}
              <div className={`leaderboard__time ${
                entry.rank === 1 ? 'leaderboard__time--best' : ''
              }`}>
                {entry.time}
                {entry.rank === 1 && ' ⚡'}
              </div>

              {/* Speed */}
              <div className="leaderboard__speed">
                {entry.speed}
                <span className="leaderboard__speed-unit"> km/h</span>
              </div>

              {/* Date */}
              <div className="leaderboard__date">
                {formatDate(entry.date)}
              </div>
            </div>
          );
        })}

        {displayEntries.length === 0 && (
          <div className="leaderboard__empty">
            <div className="leaderboard__empty-icon">🏎️</div>
            <div className="leaderboard__empty-title">
              Niciun record încă
            </div>
            <div className="leaderboard__empty-text">
              Fii primul care înregistrează un timp pe această rută!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;