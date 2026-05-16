import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from "../services/supabaseClient";
import { useAuth } from '../context/AuthContext';
import './CommunityPage.css';

// Lista completă a județelor + Ineu
const ALL_COMMUNITIES = [
  // Județe
  { id: 'arad', name: 'Arad', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 1200, online: 34 },
  { id: 'timis', name: 'Timișoara', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 980, online: 28 },
  { id: 'vaslui', name: 'Vaslui', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 340, online: 5 },
  { id: 'oradea', name: 'Oradea', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 870, online: 21 },
  { id: 'constanta', name: 'Constanța', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 1100, online: 42 },
  { id: 'pitesti', name: 'Pitești', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 760, online: 15 },
  { id: 'bucuresti', name: 'București', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 2500, online: 89 },
  { id: 'craiova', name: 'Craiova', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 920, online: 27 },
  { id: 'mehedinti', name: 'Mehedinți', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 210, online: 3 },
  { id: 'cluj', name: 'Cluj', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 1450, online: 56 },
  { id: 'brasov', name: 'Brașov', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 1300, online: 48 },
  { id: 'iasi', name: 'Iași', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 1100, online: 38 },
  { id: 'sibiu', name: 'Sibiu', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 870, online: 25 },
  { id: 'alba', name: 'Alba', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 450, online: 10 },
  { id: 'arges', name: 'Argeș', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 630, online: 14 },
  { id: 'bacau', name: 'Bacău', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 580, online: 12 },
  { id: 'bihor', name: 'Bihor', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 720, online: 19 },
  { id: 'bistrita', name: 'Bistrița-Năsăud', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 380, online: 7 },
  { id: 'botosani', name: 'Botoșani', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 410, online: 9 },
  { id: 'braila', name: 'Brăila', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 320, online: 6 },
  { id: 'buzau', name: 'Buzău', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 470, online: 11 },
  { id: 'caras-severin', name: 'Caraș-Severin', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 290, online: 4 },
  { id: 'calarasi', name: 'Călărași', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 250, online: 5 },
  { id: 'covasna', name: 'Covasna', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 190, online: 2 },
  { id: 'dambovita', name: 'Dâmbovița', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 510, online: 13 },
  { id: 'dolj', name: 'Dolj', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 680, online: 17 },
  { id: 'galati', name: 'Galați', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 540, online: 14 },
  { id: 'giurgiu', name: 'Giurgiu', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 270, online: 4 },
  { id: 'gorj', name: 'Gorj', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 350, online: 8 },
  { id: 'harghita', name: 'Harghita', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 310, online: 6 },
  { id: 'hunedoara', name: 'Hunedoara', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 420, online: 10 },
  { id: 'ialomita', name: 'Ialomița', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 230, online: 3 },
  { id: 'maramures', name: 'Maramureș', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 500, online: 16 },
  { id: 'mures', name: 'Mureș', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 590, online: 18 },
  { id: 'neamt', name: 'Neamț', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 460, online: 11 },
  { id: 'olt', name: 'Olt', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 380, online: 9 },
  { id: 'prahova', name: 'Prahova', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 760, online: 22 },
  { id: 'satu-mare', name: 'Satu Mare', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 340, online: 7 },
  { id: 'salaj', name: 'Sălaj', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 210, online: 4 },
  { id: 'suceava', name: 'Suceava', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 640, online: 16 },
  { id: 'teleorman', name: 'Teleorman', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 350, online: 8 },
  { id: 'tulcea', name: 'Tulcea', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 280, online: 5 },
  { id: 'valcea', name: 'Vâlcea', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 390, online: 9 },
  { id: 'vrancea', name: 'Vrancea', type: 'county', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 310, online: 6 },
  // Oraș special
  { id: 'ineu', name: 'Ineu, jud. Arad', type: 'town', cover: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=200', members: 420, online: 11 },
];

const CommunityPage = () => {
  const { user } = useAuth();
  const [communities] = useState(ALL_COMMUNITIES);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMsg, setNewMsg] = useState('');
  const [joinedCommunities, setJoinedCommunities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const chatEndRef = useRef(null);
  const channelRef = useRef(null);

  const selectedCommunity = communities.find(c => c.id === selectedId);

  // Filtrare comunități după search
  const filteredCommunities = useMemo(() => {
    if (!searchTerm.trim()) return communities;
    const lower = searchTerm.toLowerCase();
    return communities.filter(c => c.name.toLowerCase().includes(lower));
  }, [communities, searchTerm]);

  // Grupare pe tip (județe vs orașe) pentru afișare
  const groupedCommunities = useMemo(() => {
    const groups = { county: [], town: [] };
    filteredCommunities.forEach(c => groups[c.type]?.push(c));
    return groups;
  }, [filteredCommunities]);

  // Încărcare mesaje + abonare real-time
  useEffect(() => {
    if (!selectedId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('community_messages')
        .select('*')
        .eq('community_id', selectedId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (!error && data) {
        setMessages(prev => ({ ...prev, [selectedId]: data }));
      }
    };

    fetchMessages();

    channelRef.current = supabase
      .channel(`community-${selectedId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'community_messages', filter: `community_id=eq.${selectedId}` },
        (payload) => {
          setMessages(prev => ({
            ...prev,
            [selectedId]: [...(prev[selectedId] || []), payload.new],
          }));
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [selectedId]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedId]);

  const toggleJoin = (id) => {
    setJoinedCommunities(prev => ({ ...prev, [id]: !prev[id] }));
    if (!selectedId) setSelectedId(id);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedId || !user) return;

    const newMessage = {
      community_id: selectedId,
      user_id: user.id,
      username: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilizator',
      avatar_url: user.user_metadata?.avatar_url || null,
      message: newMsg.trim(),
    };

    const { error } = await supabase.from('community_messages').insert(newMessage);
    if (!error) setNewMsg('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="community-page">
      <header className="community-header">
        <h1 className="community-title">Comunități</h1>
        <p>Alege județul sau orașul tău și intră în conversație</p>
        <div className="community-search">
          <input
            type="text"
            placeholder="🔍 Caută județul sau orașul..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="community-layout">
        {/* Sidebar */}
        <aside className="community-list">
          {groupedCommunities.county.length > 0 && (
            <div className="community-group">
              <h3 className="group-title">Județe</h3>
              {groupedCommunities.county.map(comm => (
                <div
                  key={comm.id}
                  className={`community-list-item ${selectedId === comm.id ? 'active' : ''}`}
                  onClick={() => setSelectedId(comm.id)}
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
                    className={`comm-join-btn ${joinedCommunities[comm.id] ? 'joined' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleJoin(comm.id); }}
                  >
                    {joinedCommunities[comm.id] ? '✓ Membru' : 'Alătură-te'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {groupedCommunities.town.length > 0 && (
            <div className="community-group">
              <h3 className="group-title">Orașe</h3>
              {groupedCommunities.town.map(comm => (
                <div
                  key={comm.id}
                  className={`community-list-item ${selectedId === comm.id ? 'active' : ''}`}
                  onClick={() => setSelectedId(comm.id)}
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
                    className={`comm-join-btn ${joinedCommunities[comm.id] ? 'joined' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleJoin(comm.id); }}
                  >
                    {joinedCommunities[comm.id] ? '✓ Membru' : 'Alătură-te'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {filteredCommunities.length === 0 && (
            <div className="no-results">Nicio comunitate găsită</div>
          )}
        </aside>

        {/* Chat area */}
        <main className="chat-area">
          {!selectedId ? (
            <div className="chat-placeholder">
              <span>📡 Selectează o comunitate pentru a vedea conversația</span>
            </div>
          ) : !user ? (
            <div className="chat-placeholder">
              <span>🔐 Trebuie să te autentifici pentru a vedea mesajele</span>
            </div>
          ) : (
            <>
              {selectedCommunity && (
                <div className="chat-header">
                  <img src={selectedCommunity.cover} alt="" className="chat-avatar-small" />
                  <div>
                    <h3>{selectedCommunity.name}</h3>
                    <p className="chat-desc">{selectedCommunity.members} membri</p>
                  </div>
                  <span className="chat-online-count">
                    <span className="online-dot" /> {selectedCommunity.online} online
                  </span>
                </div>
              )}

              <div className="chat-messages">
                {(messages[selectedId] || []).length === 0 && (
                  <div className="chat-empty">
                    <p>Niciun mesaj încă. Fii primul care scrie!</p>
                  </div>
                )}
                {(messages[selectedId] || []).map(msg => (
                  <div
                    key={msg.id}
                    className={`message ${msg.user_id === user?.id ? 'message-own' : ''}`}
                  >
                    {msg.user_id !== user?.id && (
                      <div className="message-avatar">
                        {msg.avatar_url ? (
                          <img src={msg.avatar_url} alt={msg.username} />
                        ) : (
                          <div className="avatar-placeholder">
                            {msg.username?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="message-content">
                      {msg.user_id !== user?.id && (
                        <div className="message-user">{msg.username}</div>
                      )}
                      <div className="message-bubble">{msg.message}</div>
                      <span className="message-time">{formatTime(msg.created_at)}</span>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form className="chat-input-area" onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder="Scrie un mesaj..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  maxLength={500}
                />
                <button type="submit" disabled={!newMsg.trim()}>Trimite</button>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CommunityPage;
