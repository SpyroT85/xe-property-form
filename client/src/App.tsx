import { useState } from 'react';
import { AdForm } from './components/AdForm';
import { AdList } from './components/AdList';
import './index.css';

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <nav className="navbar">
        <div>
          <div className="navbar__logo">xe.gr</div>
          <div className="navbar__subtitle">Χρυσή Ευκαιρία</div>
        </div>
      </nav>
      <main className="app">
        <div className="app__form">
          <AdForm onSuccess={() => setRefreshKey(prev => prev + 1)} />
        </div>
        <div className="app__list">
          <AdList refreshKey={refreshKey} />
        </div>
      </main>
    </>
  );
}