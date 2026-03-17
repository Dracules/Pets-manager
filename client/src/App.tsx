import { useState } from 'react';
import DogsPage from './domains/dog/ui/DogPage';
import CatsPage from './domains/cat/ui/CatPage';
import LoginPage from './domains/login/ui/LoginPage';

function ucFirst(str: String) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dogs' | 'cats' | 'login'>('dogs');

  return (
    <div style={{ padding: 20 }}>
      <h1>{ucFirst(activeTab)}</h1>
      <div style={{ margin: 20 }}>
        <button onClick={() => setActiveTab('dogs')}>Dogs</button>
        <button onClick={() => setActiveTab('cats')}>Cats</button>
        <button onClick={() => setActiveTab('login')}>Login</button>
        <div style={{ margin: 20 }}>
          {activeTab === 'dogs' && <DogsPage />}
          {activeTab === 'cats' && <CatsPage />}
          {activeTab === 'login' && <LoginPage />}
        </div>
      </div>
    </div>
  );
}
