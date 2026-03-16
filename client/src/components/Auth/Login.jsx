import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-[#0A0F1E] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111827] rounded-2xl border border-[#00C2FF]/20 p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect back */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#00C2FF] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00C2FF] to-[#00FFD1] flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-[#0A0F1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-[#F0F4F8] font-semibold text-2xl">NeonChat</h1>
          <p className="text-[#00FFD1] text-xs font-mono mt-1">End-to-End Encrypted</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-[#F0F4F8]/70 text-sm font-medium mb-1.5 ml-1">Email</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00C2FF]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0A0F1E] border border-[#00C2FF]/20 rounded-lg py-3 pl-10 pr-4 text-[#F0F4F8] placeholder-[#F0F4F8]/30 focus:outline-none focus:border-[#00C2FF]/50 focus:ring-1 focus:ring-[#00C2FF]/30 transition-all font-sans"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-[#F0F4F8]/70 text-sm font-medium mb-1.5 ml-1">Password</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00C2FF]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0A0F1E] border border-[#00C2FF]/20 rounded-lg py-3 pl-10 pr-4 text-[#F0F4F8] placeholder-[#F0F4F8]/30 focus:outline-none focus:border-[#00C2FF]/50 focus:ring-1 focus:ring-[#00C2FF]/30 transition-all font-sans"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 py-3 bg-gradient-to-r from-[#00C2FF] to-[#00FFD1] text-[#0A0F1E] rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00C2FF]/30 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-[#0A0F1E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#F0F4F8]/50">
          Don't have an account? <Link to="/signup" className="text-[#00FFD1] hover:underline font-medium ml-1">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
