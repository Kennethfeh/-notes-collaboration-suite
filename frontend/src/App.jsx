import { useEffect, useState } from 'react';

function App () {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('connecting...');

  const fetchNotes = async () => {
    const response = await fetch('/api/notes');
    const data = await response.json();
    setNotes(data);
    setStatus('connected');
  };

  useEffect(() => {
    fetch('/api/health').then((res) => res.json()).then((data) => setStatus(data.status));
    fetchNotes();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    setText('');
    fetchNotes();
  };

  return (
    <main>
      <h1>Notes Collaboration Suite</h1>
      <p>Backend status: {status}</p>
      <form onSubmit={submit}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add note" />
        <button type="submit">Save</button>
      </form>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.text}</li>
        ))}
      </ul>
    </main>
  );
}

export default App;
