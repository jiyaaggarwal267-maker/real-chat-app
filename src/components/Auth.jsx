import React, { useState } from 'react';
import { Rocket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StarField from './StarField';

const Auth = () => {
  const { login, signup } = useAuth();
  const [authMode, setAuthMode] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    avatar: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (authMode === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        result = await signup(formData);
      }

      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black flex items-center justify-center relative overflow-hidden">
      <StarField />
      
      <div className="relative z-10 glass border border-purple-500/30 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-purple-500/20 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4 animate-bounce">
            <Rocket className="w-12 h-12 text-black" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Cosmic Chat
          </h1>
          <p className="text-purple-300/60 text-sm">Connect Across the Universe</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              authMode === 'login'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-black'
                : 'bg-white/5 text-purple-300 hover:bg-white/10'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              authMode === 'signup'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-black'
                : 'bg-white/5 text-purple-300 hover:bg-white/10'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {authMode === 'signup' && (
            <>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 glass border border-purple-500/30 rounded-lg text-black placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                name="avatar"
                placeholder="Avatar Emoji (e.g., 🚀)"
                value={formData.avatar}
                onChange={handleChange}
                className="w-full px-4 py-3 glass border border-purple-500/30 rounded-lg text-black placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 glass border border-purple-500/30 rounded-lg text-black placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 glass border border-purple-500/30 rounded-lg text-black placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-black font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (authMode === 'login' ? 'Launch Mission' : 'Join the Cosmos')}
          </button>
        </div>

        {authMode === 'login' && (
          <p className="text-center text-purple-300/60 text-sm mt-4">
            Demo: Create an account to get started
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;