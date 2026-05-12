import './TermsPage.css';

function TermsPage() {
  return (
    <div className="terms-page container">
      <header className="terms-page__header">
        <h1 className="terms-page__title">📄 Termeni și condiții</h1>
        <p className="terms-page__subtitle">
          Utilizarea platformei implică acceptarea condițiilor de mai jos.
        </p>
      </header>

      <section className="terms-page__content">
        <article>
          <h2>1. Cont utilizator</h2>
          <p>Utilizatorul este responsabil de datele furnizate și de securitatea contului propriu.</p>
        </article>

        <article>
          <h2>2. Date și clasamente</h2>
          <p>Recordurile publicate trebuie să fie reale. Datele neconforme pot fi eliminate.</p>
        </article>

        <article>
          <h2>3. Conduită</h2>
          <p>Respectă legislația rutieră și ceilalți membri ai comunității în toate interacțiunile.</p>
        </article>
      </section>
    </div>
  );
}

export default TermsPage;
