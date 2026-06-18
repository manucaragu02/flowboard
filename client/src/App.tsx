import {useEffect, useState} from 'react';

function App() {
  const [status, setStatus] = useState<string>('Comprobando...');

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('Error al conectar con el servidor'));
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Flowboard</h1>
      <p>Estado del servidor: {status}</p>
    </div>
  )
}

export default App;