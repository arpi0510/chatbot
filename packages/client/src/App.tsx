import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';

function App() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <>
      <p className="font-bold p-4 text-5xl">{message}</p>;
      <Button color="cyan">Click me!</Button>
    </>
  );
}

export default App;
