import React, { useEffect, useState } from 'react';

function Calendar({ events, onDayClick }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function getEventsForDay(day) {
    const d = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(ev => ev.date === d);
  }

  return (
    <table className="table is-bordered is-narrow is-fullwidth has-background-white-ter" style={{ fontSize: 14 }}>
      <thead>
        <tr>
          <th colSpan={7} className="has-background-link has-text-white has-text-centered">
            {today.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
          </th>
        </tr>
        <tr>
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(j => <th key={j} className="has-text-centered">{j}</th>)}
        </tr>
      </thead>
      <tbody>
        {(() => {
          const firstDay = new Date(year, month, 1).getDay() || 7;
          const rows = [];
          let cells = [];
          let dayNum = 1;
          for (let i = 1; i < firstDay; i++) cells.push(<td key={`empty-${i}`}></td>);
          for (let i = firstDay; i <= 7; i++) {
            if (dayNum <= daysInMonth) {
              const dayEvents = getEventsForDay(dayNum);
              cells.push(
                <td
                  key={dayNum}
                  style={{
                    background: dayEvents.length ? '#eaf6ff' : undefined,
                    fontWeight: dayEvents.length ? 700 : 400,
                    cursor: dayEvents.length ? 'pointer' : undefined
                  }}
                  onClick={() => dayEvents.length && onDayClick(dayEvents)}
                >
                  {dayNum}
                  {dayEvents.map(ev => (
                    <div key={ev.id} style={{ fontSize: 10, color: '#1277c6' }}>{ev.titre}</div>
                  ))}
                </td>
              );
              dayNum++;
            }
          }
          rows.push(<tr key="row-1">{cells}</tr>);
          while (dayNum <= daysInMonth) {
            cells = [];
            for (let i = 0; i < 7; i++) {
              if (dayNum <= daysInMonth) {
                const dayEvents = getEventsForDay(dayNum);
                cells.push(
                  <td
                    key={dayNum}
                    style={{
                      background: dayEvents.length ? '#eaf6ff' : undefined,
                      fontWeight: dayEvents.length ? 700 : 400,
                      cursor: dayEvents.length ? 'pointer' : undefined
                    }}
                    onClick={() => dayEvents.length && onDayClick(dayEvents)}
                  >
                    {dayNum}
                    {dayEvents.map(ev => (
                      <div key={ev.id} style={{ fontSize: 10, color: '#1277c6' }}>{ev.titre}</div>
                    ))}
                  </td>
                );
                dayNum++;
              } else {
                cells.push(<td key={`empty-${dayNum + i}`}></td>);
              }
            }
            rows.push(<tr key={`row-${dayNum}`}>{cells}</tr>);
          }
          return rows;
        })()}
      </tbody>
    </table>
  );
}

export default function EvenementAdmin() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ titre: '', date: '', description: '', lieu: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/evenements')
      .then(res => res.json())
      .then(setEvents);
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/evenements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ titre: '', date: '', description: '', lieu: '' });
    const updated = await fetch('/api/evenements').then(res => res.json());
    setEvents(updated);
    setLoading(false);
  };

  const handleDelete = async id => {
    setLoading(true);
    await fetch('/api/evenements', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const updated = await fetch('/api/evenements').then(res => res.json());
    setEvents(updated);
    setLoading(false);
  };

  const handleDayClick = dayEvents => {
    alert(`Événements pour ce jour:\n${dayEvents.map(ev => ev.titre).join('\n')}`);
  };

  return (
    <div className="box" style={{ borderRadius: 12 }}>
      <h2 className="title is-5">Gestion du calendrier</h2>
      <form onSubmit={handleAdd} className="mb-4">
        <div className="field">
          <label className="label">Titre</label>
          <input className="input" name="titre" value={form.titre} onChange={handleChange} required />
        </div>
        <div className="field">
          <label className="label">Date</label>
          <input className="input" type="date" name="date" value={form.date} onChange={handleChange} required />
        </div>
        <div className="field">
          <label className="label">Description</label>
          <input className="input" name="description" value={form.description} onChange={handleChange} />
        </div>
        <div className="field">
          <label className="label">Lieu</label>
          <input className="input" name="lieu" value={form.lieu} onChange={handleChange} />
        </div>
        <button className={`button is-link mt-2${loading ? ' is-loading' : ''}`} type="submit" disabled={loading}>Ajouter</button>
      </form>
      <Calendar events={events} onDayClick={handleDayClick} />
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Date</th>
            <th>Titre</th>
            <th>Description</th>
            <th>Lieu</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev.id}>
              <td>{ev.date}</td>
              <td>{ev.titre}</td>
              <td>{ev.description}</td>
              <td>{ev.lieu}</td>
              <td>
                <button className="button is-small is-danger" onClick={() => handleDelete(ev.id)} disabled={loading}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}