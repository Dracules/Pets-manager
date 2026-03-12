import { useState } from 'react';
import DogsPage from './domains/dog/ui/DogPage';
import CatsPage from './domains/cat/ui/CatPage';

function ucFirst(str: String) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dogs' | 'cats'>('dogs');

  return (
    <div style={{ padding: 20 }}>
      <h1>{ucFirst(activeTab)}</h1>
      <div style={{ margin: 20 }}>
        <button onClick={() => setActiveTab('dogs')}>Dogs</button>
        <button onClick={() => setActiveTab('cats')}>Cats</button>
        <div style={{ margin: 20 }}>
          {activeTab === 'dogs' && <DogsPage />}
          {activeTab === 'cats' && <CatsPage />}
        </div>
      </div>
    </div>
  );
}
