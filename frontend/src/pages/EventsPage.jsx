import React, { useState } from 'react';
import './EventsPage.css';

const eventsData = [
  {
    id: 1,
    title: 'Drift Night – Urban Showdown',
    type: 'Drift',
    date: '2026-07-12',
    time: '20:00',
    location: 'Arena Parc Industrial, București',
    image: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=600&auto=format',
    description: 'Cei mai tari piloți de drift din țară își dau întâlnire pentru o noapte de fum și adrenalină. Eveniment deschis publicului.',
  },
  {
    id: 2,
    title: 'Drag Racing – Quarter Mile Battle',
    type: 'Drag Racing',
    date: '2026-08-03',
    time: '10:00',
    location: 'Aerodromul Tuzla',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c40c589?w=600&auto=format',
    description: 'Competiție oficială de drag racing pe 402 m. Categorii Street, Pro și Super Pro. Premii totale de 5000€.',
  },
  {
    id: 3,
    title: 'Street Racing – Midnight Run',
    type: 'Street Racing',
    date: '2026-06-21',
    time: '23:00',
    location: 'Șoseaua de Centură, km 23',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format',
    description: 'Întâlnire privată pentru pasionații de viteză. Locația exactă se va transmite doar participanților confirmați.',
  },
  {
    id: 4,
    title: 'Auto Expo 2026 – Luxury & JDM Show',
    type: 'Expoziție Auto',
    date: '2026-09-15',
    time: '12:00',
    location: 'Romexpo, Pavilion C',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&auto=format',
    description: 'Expoziție dedicată mașinilor exotice și JDM. Prezentări, concursuri și sesiuni foto cu modele rare.',
  },
  {
    id: 5,
    title: 'Drift Matsuri – Open Track Day',
    type: 'Drift',
    date: '2026-10-05',
    time: '09:00',
    location: 'Complex MotorPark Adâncata',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format',
    description: 'Zi de drift liber pe circuit tehnic. Fără competiție, doar distracție și antrenament. Taxă de participare 150 lei.',
  },
  {
    id: 6,
    title: 'Vintage & Classic Rally',
    type: 'Expoziție Auto',
    date: '2026-05-30',
    time: '11:00',
    location: 'Palatul Mogoșoaia',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format',
    description: 'Expoziție și paradă a mașinilor istorice. Concurs de eleganță și tur ghidat.',
  }
];

const typeIcons = {
  'Drift': '🏎️',
  'Drag Racing': '⚡',
  'Street Racing': '🌃',
  'Expoziție Auto': '🏁'
};

const EventCard = ({ event }) => {
  const [interested, setInterested] = useState(false);

  return (
    <div className="event-card">
      <div className="event-card__image">
        <img src={event.image} alt={event.title} />
        <span className="event-card__type">
          {typeIcons[event.type]} {event.type}
        </span>
      </div>
      <div className="event-card__content">
        <h3 className="event-card__title">{event.title}</h3>
        <div className="event-card__meta">
          <span className="meta-date">📅 {event.date} – {event.time}</span>
          <span className="meta-location">📍 {event.location}</span>
        </div>
        <p className="event-card__description">{event.description}</p>
        <button
          className={`btn-interested ${interested ? 'active' : ''}`}
          onClick={() => setInterested(!interested)}
        >
          {interested ? '✅ Particip' : '⚡ Mă interesează'}
        </button>
      </div>
    </div>
  );
};

const EventsPage = () => {
  const [filter, setFilter] = useState('Toate');

  const filteredEvents = filter === 'Toate'
    ? eventsData
    : eventsData.filter(e => e.type === filter);

  return (
    <div className="events-page">
      <header className="events-header">
        <h1 className="page-title">Evenimente Auto</h1>
        <p className="page-subtitle">Drift, drag, street racing și expoziții</p>
      </header>

      <div className="events-filter">
        {['Toate', 'Drift', 'Drag Racing', 'Street Racing', 'Expoziție Auto'].map(cat => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'Toate' ? '🏎️ Toate' : typeIcons[cat] + ' ' + cat}
          </button>
        ))}
      </div>

      <div className="events-grid">
        {filteredEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;