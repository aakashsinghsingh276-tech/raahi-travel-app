import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = 'https://raahi-backend.onrender.com'; // Deploy ke baad yahan apna URL daalein

export default function AuthModal({ setUser, closeModal }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const endpoint = isSignup ? `${BACKEND_URL}/api/auth/register` : `${BACKEND_URL}/api/auth/login`;

    try {
      const res = await axios.post(endpoint, form);
      localStorage.setItem('raahi_token', res.data.token);
      localStorage.setItem('raahi_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-100 mb-1">{isSignup ? 'RAAHI Join Karein' : 'Welcome Back'}</h2>
        <p className="text-xs text-slate-400 mb-5">Phone number ki koi zaroorat nahi hai (Only Email)</p>

        {error && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-2.5 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignup && (
            <input
              type="text"
              placeholder="Username"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-teal-500"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-teal-500"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-teal-500"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 rounded-xl transition-all text-xs"
          >
            {loading ? 'Processing...' : isSignup ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4">
          {isSignup ? 'Pehle se account hai?' : "Naya account banana hai?"}{' '}
          <button onClick={() => setIsSignup(!isSignup)} className="text-teal-400 font-semibold underline">
            {isSignup ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
