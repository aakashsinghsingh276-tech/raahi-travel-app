import React from 'react';
import { Home, Bookmark, MessageSquare } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'saved', label: 'Itinerary', icon: Bookmark },
    { id: 'chat', label: 'Direct Chat', icon: MessageSquare },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 py-2.5 px-6 flex justify-around items-center z-50 max-w-md mx-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              isActive ? 'text-teal-400 scale-110 font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
