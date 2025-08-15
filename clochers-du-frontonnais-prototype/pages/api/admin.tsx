import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [text, setText] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        setText(data.text || '');
        setImage(data.image || '');
      });
  }, []);

  const saveContent = async () => {
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, image })
    });
    alert('Contenu sauvegardé !');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin - Modifier la page d'accueil</h1>
      <textarea
        rows={5}
        value={text}
        onChange={e => setText(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <input
        type="text"
        placeholder="URL de l'image"
        value={image}
        onChange={e => setImage(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <button onClick={saveContent}>Sauvegarder</button>
    </div>
  );
}
