import React, { useState } from 'react';
import './ContactPage.css';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path
      fill="currentColor"
      d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 1.8A4 4 0 0 0 3.8 7.8v8.4a4 4 0 0 0 4 4h8.4a4 4 0 0 0 4-4V7.8a4 4 0 0 0-4-4H7.8Zm9.1 1.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path
      fill="currentColor"
      d="M6.94 8.5v10H3.62v-10h3.32ZM5.28 3a1.92 1.92 0 1 1 0 3.84 1.92 1.92 0 0 1 0-3.84ZM20.38 12.84v5.66h-3.31v-5.3c0-1.33-.48-2.24-1.67-2.24-.91 0-1.45.61-1.69 1.2-.09.2-.11.48-.11.76v5.58h-3.31s.04-9.06 0-10h3.31v1.42c.44-.68 1.22-1.64 2.97-1.64 2.16 0 3.81 1.42 3.81 4.46Z"
    />
  </svg>
);

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const socialLinks = {
    instagram: 'https://www.instagram.com/alexandru.j1/',
    email: 'alexandru.jurjita2006@gmail.com',
    linkedin: 'https://www.linkedin.com/in/alexandru-daniel-jurji%C8%9Ba-a255863b2/',
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // aici conectezi API-ul tău
    console.log('Formular trimis:', form);
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <h1 className="contact-title">Contactează-ne</h1>
        <p>Ai o întrebare, o sugestie sau vrei să colaborezi? Scrie-ne și te contactăm în cel mai scurt timp.</p>
      </header>

      <div className="contact-content">
        {/* Brand & Social */}
          <aside className="contact-brand">
            <div className="brand-logo-area">
              <h2>SPEED RECORD</h2>
              <p className="brand-tagline">Comunitatea vitezomanilor pasionați</p>
            </div>

          <div className="social-links">
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-btn instagram">
              <span className="social-icon"><InstagramIcon /></span> Instagram
            </a>
            <a href={`mailto:${socialLinks.email}`} className="social-btn email">
              <span className="social-icon">✉️</span> {socialLinks.email}
            </a>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-btn linkedin">
              <span className="social-icon"><LinkedInIcon /></span> LinkedIn
            </a>
          </div>
        </aside>

        {/* Formular */}
        <div className="contact-form-container">
          {submitted ? (
            <div className="success-message">
              <h3>✅ Mesaj trimis cu succes!</h3>
              <p>Îți vom răspunde în cel mult 24 de ore.</p>
              <button onClick={() => setSubmitted(false)}>Trimite alt mesaj</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="input-group">
                <label htmlFor="name">Nume</label>
                <input
                  type="text" id="name" name="name"
                  value={form.name} onChange={handleChange}
                  placeholder="ex: Ion Popescu"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email" id="email" name="email"
                  value={form.email} onChange={handleChange}
                  placeholder="ex: ion@email.com"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="subject">Subiect</label>
                <input
                  type="text" id="subject" name="subject"
                  value={form.subject} onChange={handleChange}
                  placeholder="Despre ce e vorba?"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="message">Mesaj</label>
                <textarea
                  id="message" name="message" rows="6"
                  value={form.message} onChange={handleChange}
                  placeholder="Scrie mesajul tău aici..."
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                🏁 Trimite mesajul
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
