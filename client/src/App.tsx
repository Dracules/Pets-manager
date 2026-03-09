import { useState } from 'react';
import DogsPage from './DogPage';
import CatsPage from './CatPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dogs' | 'cats'>('dogs');

  return (
    <div style={{ padding: 20 }}>
      <h1>activeTab</h1>
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
