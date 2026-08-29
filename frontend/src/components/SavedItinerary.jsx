import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = 'https://raahi-backend.onrender.com';

export default function SavedItinerary({ user }) {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get(`${BACKEND_URL}/api/posts/saved/${user.id}`).then((res) => setSaved(res.data));
    }
  }, [user]);

  if (!user) {
    return <div className="text-center text-xs text-slate-400 py-10">Apni Itinerary dekhne ke liye login karein.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-200">Saved Travel Spots</h2>
      {saved.length === 0 ? (
        <p className="text-xs text-slate-500">Koi spot save nahi kiya hai.</p>
      ) : (
        <div className="columns-2 gap-3 space-y-3">
          {saved.map((item) => (
            <div key={item.id} className="relative rounded-xl overflow-hidden group border border-slate-800 break-inside-avoid">
              <img src={item.image_url} alt="" className="w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent p-2.5 flex items-end">
                <span className="text-[11px] font-medium text-slate-200">{item.location}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
