import { useState, useEffect, useRef } from 'react';
import './RecordForm.css';

function RecordForm({ route = {}, onSubmit }) {
  const [timeInput, setTimeInput] = useState('');
  const [speed, setSpeed] = useState('');
  const [car, setCar] = useState('');
  const [recordType, setRecordType] = useState('manual'); // manual / live
  const [isRunning, setIsRunning] = useState(false);
  const [liveTime, setLiveTime] = useState(0);
  const intervalRef = useRef(null);

  const cars = [
    { name: 'BMW M4', emoji: '🏎️' },
    { name: 'Porsche 911', emoji: '🚗' },
    { name: 'Audi RS6', emoji: '🚙' },
    { name: 'Tesla Model S', emoji: '⚡' },
    { name: 'Altă mașină', emoji: '🔧' }
  ];

  // Cronometru live
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setLiveTime(prev => prev + 10);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      // Setează timpul în input
      setTimeInput(formatTime(liveTime));
    } else {
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setLiveTime(0);
    setTimeInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!timeInput || !car) return;
    
    onSubmit({
      time: recordType === 'manual' ? timeInput : formatTime(liveTime),
      speed: speed || '0',
      car,
      route,
      date: new Date().toISOString()
    });
    
    // Reset form
    setTimeInput('');
    setSpeed('');
    setCar('');
    setLiveTime(0);
    setIsRunning(false);
  };

  return (
    <form className="record-form" onSubmit={handleSubmit}>
      <div className="record-form__title">
        🏁 Înregistrează Record
      </div>
      <div className="record-form__subtitle">
        {route?.origin} → {route?.destination}
      </div>

      {/* Tip înregistrare */}
      <div className="record-form__group">
        <label className="record-form__label">Metodă de cronometrare</label>
        <div className="record-form__radio-group">
          <div className="record-form__radio">
            <input 
              type="radio" 
              id="manual" 
              name="recordType" 
              value="manual"
              checked={recordType === 'manual'}
              onChange={() => setRecordType('manual')}
            />
            <label htmlFor="manual" className="record-form__radio-label">
              <span className="record-form__radio-icon">⌨️</span>
              <span>Manual</span>
            </label>
          </div>
          <div className="record-form__radio">
            <input 
              type="radio" 
              id="live" 
              name="recordType" 
              value="live"
              checked={recordType === 'live'}
              onChange={() => setRecordType('live')}
            />
            <label htmlFor="live" className="record-form__radio-label">
              <span className="record-form__radio-icon">⏱️</span>
              <span>Cronometru Live</span>
            </label>
          </div>
        </div>
      </div>

      {/* Cronometru live (dacă e activ) */}
      {recordType === 'live' && (
        <div className="record-form__stopwatch">
          <div className="record-form__stopwatch-time">
            {formatTime(liveTime)}
          </div>
          <div className="record-form__stopwatch-controls">
            <button 
              type="button" 
              className={`record-form__stopwatch-btn ${isRunning ? 'record-form__stopwatch-btn--stop' : 'record-form__stopwatch-btn--start'}`}
              onClick={handleStartStop}
            >
              {isRunning ? '⏹️ STOP' : '▶️ START'}
            </button>
            <button 
              type="button" 
              className="record-form__stopwatch-btn record-form__stopwatch-btn--reset"
              onClick={handleReset}
            >
              🔄 Reset
            </button>
          </div>
        </div>
      )}

      {/* Input manual */}
      {recordType === 'manual' && (
        <div className="record-form__group">
          <label className="record-form__label">
            ⏱️ Timp realizat (mm:ss.sute)
          </label>
          <input
            className="record-form__input record-form__input--time"
            type="text"
            placeholder="00:00.00"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            pattern="\d{2}:\d{2}\.\d{2}"
          />
        </div>
      )}

      {/* Viteza medie */}
      <div className="record-form__group">
        <label className="record-form__label">
          ⚡ Viteza medie (km/h)
        </label>
        <input
          className="record-form__input"
          type="number"
          placeholder="120"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
        />
      </div>

      {/* Selectare mașină */}
      <div className="record-form__group">
        <label className="record-form__label">
          🏎️ Mașina folosită
        </label>
        <div className="record-form__car-select">
          {cars.map((c) => (
            <div
              key={c.name}
              className={`record-form__car-option ${car === c.name ? 'record-form__car-option--selected' : ''}`}
              onClick={() => setCar(c.name)}
            >
              <span>{c.emoji}</span>
              <span>{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="record-form__submit">
        🚀 Salvează Recordul
      </button>
    </form>
  );
}

export default RecordForm;