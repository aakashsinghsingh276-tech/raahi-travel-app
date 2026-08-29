import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TravelFeed from './components/TravelFeed';
import SavedItinerary from './components/SavedItinerary';
import DirectChat from './components/DirectChat';
import AuthModal from './components/AuthModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('raahi_user')) || null);
  const [showAuth, setShowAuth] = useState(!user);

  const handleLogout = () => {
    localStorage.removeItem('raahi_user');
    localStorage.removeItem('raahi_token');
    setUser(null);
    setShowAuth(true);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-20 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex justify-between items-center max-w-md mx-auto">
        <h1 className="text-xl font-black tracking-wider bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">
          RAAHI
        </h1>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300">@{user.username}</span>
            <button
              onClick={handleLogout}
              className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full font-medium"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="text-xs bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-1.5 rounded-full"
          >
            Login / Signup
          </button>
        )}
      </header>

      {/* Main Screen Views */}
      <main className="max-w-md mx-auto p-4">
        {activeTab === 'feed' && <TravelFeed user={user} />}
        {activeTab === 'saved' && <SavedItinerary user={user} />}
        {activeTab === 'chat' && <DirectChat user={user} />}
      </main>

      {/* Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Auth Modal */}
      {showAuth && <AuthModal setUser={setUser} closeModal={() => setShowAuth(false)} />}
    </div>
  );
}
