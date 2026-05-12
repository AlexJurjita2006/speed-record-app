import React, { useState, useRef, useEffect } from 'react';
import './CommunityPage.css';

const initialCommunities = [
  {
    id: 1,
    name: 'Street Racers',
    description: 'Totul despre curse de stradă, locații secrete și întâlniri nocturne.',
    cover: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&auto=format',
    members: 842,
    online: 24,
    joined: false,
  },
  {
    id: 2,
    name: 'Drift Kings',
    description: 'Comunitatea iubitorilor de drift. Tehnică, evenimente și sesiuni foto.',
    cover: 'https://images.unsplash.com/photo-1558618666-fcd25c40c589?w=400&auto=format',
    members: 567,
    online: 13,
    joined: false,
  },
  {
    id: 3,
    name: 'Drag Enthusiasts',
    description: 'Pasiune pentru accelerare, quarter mile și modificări extreme.',
    cover: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=400&auto=format',
    members: 1210,
    online: 31,
    joined: false,
  },
  {
    id: 4,
    name: 'Car Expo Lovers',
    description: 'Expoziții, cluburi auto, întâlniri de eleganță și povești de colecție.',
    cover: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&auto=format',
    members: 690,
    online: 9,
    joined: false,
  },
];

const initialMessages = {
  1: [
    { id: 1, user: 'TurboDan', text: 'Care e starea șoselei de centură în seara asta?', time: '21:12' },
    { id: 2, user: 'NitroB', text: 'Am auzit că e liberă de la km 24.', time: '21:13' },
  ],
  2: [
    { id: 1, user: 'Smokey', text: 'Cine vine la Adâncata weekendul viitor?', time: '18:05' },
    { id: 2, user: 'AngelDrift', text: 'Eu + 2, luăm un set nou de cauciucuri 😁', time: '18:09' },
  ],
  3: [
    { id: 1, user: 'QuarterMike', text: 'Am scos 11.2 aseară!', time: '11:45' },
  ],
  4: [
    { id: 1, user: 'ClassicCarFan', text: 'Fotografii de la Retroparada sunt încărcate.', time: '15:30' },
    { id: 2, user: 'Elegance99', text: 'Superbe! Mercedes-ul acela verde...', time: '15:35' },
  ],
};

const CommunityPage = () => {
  const [communities, setCommunities] = useState(initialCommunities);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [newMsg, setNewMsg] = useState('');
  const chatEndRef = useRef(null);

  const selectedCommunity = communities.find(c => c.id === selectedId);

  const toggleJoin = (id) => {
    setCommunities(prev =>
      prev.map(c => (c.id === id ? { ...c, joined: !c.joined } : c))
    );
    // If joining for first time, initialize messages if not present
    setMessages(prev => {
      if (!prev[id]) {
        return { ...prev, [id]: [] };
      }
      return prev;
    });
    if (!selectedId) setSelectedId(id);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedId) return;

    const newMessageObj = {
      id: Date.now(),
      user: 'You',
      text: newMsg.trim(),
      time: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMessageObj],
    }));
    setNewMsg('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedId]);

  return (
    <div className="community-page">
      <header className="community-header">
        <h1 className="community-title">Comunități</h1>
        <p>Alege-ți grupul și intră în conversație</p>
      </header>

      <div className="community-layout">
        {/* Sidebar list */}
        <aside className="community-list">
          {communities.map(comm => (
            <div
              key={comm.id}
              className={`community-list-item ${selectedId === comm.id ? 'active' : ''}`}
              onClick={() => selectedId !== comm.id && setSelectedId(comm.id)}
            >
              <img src={comm.cover} alt={comm.name} className="comm-avatar" />
              <div className="comm-info">
                <div className="comm-name">{comm.name}</div>
                <div className="comm-meta">
                  <span>{comm.members} membri</span>
                  <span className="online-dot" /> {comm.online} online
                </div>
              </div>
              <button
                className={`comm-join-btn ${comm.joined ? 'joined' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleJoin(comm.id);
                }}
              >
                {comm.joined ? '✓ Membru' : 'Alătură-te'}
              </button>
            </div>
          ))}
        </aside>

        {/* Chat area */}
        <main className="chat-area">
          {!selectedId ? (
            <div className="chat-placeholder">
              <span>📡 Selectează o comunitate pentru a vedea conversația</span>
            </div>
          ) : (
            <>
              {selectedCommunity && (
                <div className="chat-header">
                  <img src={selectedCommunity.cover} alt="" className="chat-avatar-small" />
                  <div>
                    <h3>{selectedCommunity.name}</h3>
                    <p className="chat-desc">{selectedCommunity.description}</p>
                  </div>
                </div>
              )}

              <div className="chat-messages">
                {selectedCommunity && !selectedCommunity.joined ? (
                  <div className="join-prompt">
                    <p>Trebuie să faci parte din comunitate pentru a vedea și trimite mesaje.</p>
                    <button
                      className="comm-join-btn join-prompt-btn"
                      onClick={() => toggleJoin(selectedId)}
                    >
                      Alătură-te acum
                    </button>
                  </div>
                ) : (
                  (messages[selectedId] || []).map(msg => (
                    <div
                      key={msg.id}
                      className={`message ${msg.user === 'You' ? 'message-own' : ''}`}
                    >
                      <div className="message-user">{msg.user}</div>
                      <div className="message-bubble">{msg.text}</div>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {selectedCommunity?.joined && (
                <form className="chat-input-area" onSubmit={handleSend}>
                  <input
                    type="text"
                    placeholder="Scrie un mesaj..."
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                  />
                  <button type="submit">Trimite</button>
                </form>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CommunityPage;