import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const gradients = [
  'from-purple-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-emerald-500',
  'from-violet-500 to-purple-500',
  'from-yellow-400 to-orange-500'
];

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatarGradient: gradients[0]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length > 7) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await signup({
        username: formData.username,
        displayName: formData.displayName,
        email: formData.email,
        password: formData.password,
        avatarGradient: formData.avatarGradient
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center p-4 py-8 overflow-y-auto scrollbar-thin">
      <div className="w-full max-w-md bg-[#111827] rounded-2xl border border-[#00C2FF]/20 p-8 shadow-2xl relative">
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00C2FF] to-[#00FFD1] flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-[#0A0F1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-[#F0F4F8] font-semibold text-2xl">Create Account</h1>
          <p className="text-[#00FFD1] text-xs font-mono mt-1">Join NeonChat today</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#F0F4F8]/70 text-xs font-medium mb-1.5 pl-1">Display Name</label>
              <input 
                name="displayName"
                required
                value={formData.displayName}
                onChange={handleChange}
                className="w-full bg-[#0A0F1E] border border-[#00C2FF]/20 rounded-lg py-2.5 px-3 text-sm text-[#F0F4F8] placeholder-[#F0F4F8]/30 focus:outline-none focus:border-[#00C2FF]/50 focus:ring-1 focus:ring-[#00C2FF]/30 transition-all font-sans"
                placeholder="Alex Kim"
              />
            </div>
            <div>
              <label className="block text-[#F0F4F8]/70 text-xs font-medium mb-1.5 pl-1">Username</label>
              <input 
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-[#0A0F1E] border border-[#00C2FF]/20 rounded-lg py-2.5 px-3 text-sm text-[#F0F4F8] placeholder-[#F0F4F8]/30 focus:outline-none focus:border-[#00C2FF]/50 focus:ring-1 focus:ring-[#00C2FF]/30 transition-all font-sans"
                placeholder="@alexkim"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#F0F4F8]/70 text-xs font-medium mb-1.5 pl-1">Email</label>
            <input 
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#0A0F1E] border border-[#00C2FF]/20 rounded-lg py-2.5 px-3 text-sm text-[#F0F4F8] placeholder-[#F0F4F8]/30 focus:outline-none focus:border-[#00C2FF]/50 focus:ring-1 focus:ring-[#00C2FF]/30 transition-all font-sans"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-[#F0F4F8]/70 text-xs font-medium mb-1.5 pl-1">Password</label>
            <input 
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#0A0F1E] border border-[#00C2FF]/20 rounded-lg py-2.5 px-3 text-sm text-[#F0F4F8] placeholder-[#F0F4F8]/30 focus:outline-none focus:border-[#00C2FF]/50 focus:ring-1 focus:ring-[#00C2FF]/30 transition-all font-sans"
              placeholder="••••••••"
            />
            {formData.password && (
              <div className="flex gap-1 mt-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i < strength ? 'bg-[#00FFD1]' : 'bg-[#0A0F1E] border border-[#00C2FF]/20'}`}></div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[#F0F4F8]/70 text-xs font-medium mb-1.5 pl-1">Confirm Password</label>
            <input 
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-[#0A0F1E] border border-[#00C2FF]/20 rounded-lg py-2.5 px-3 text-sm text-[#F0F4F8] placeholder-[#F0F4F8]/30 focus:outline-none focus:border-[#00C2FF]/50 focus:ring-1 focus:ring-[#00C2FF]/30 transition-all font-sans"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-[#F0F4F8]/70 text-xs font-medium mb-2 pl-1">Select Avatar Gradient</label>
            <div className="flex justify-between items-center px-1">
              {gradients.map((grad, i) => (
                <div 
                  key={i} 
                  onClick={() => setFormData({...formData, avatarGradient: grad})}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad} cursor-pointer transition-transform ${formData.avatarGradient === grad ? 'ring-2 ring-offset-2 ring-offset-[#111827] ring-[#00FFD1] scale-110' : 'hover:scale-110'}`}
                />
              ))}
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-8 py-3 bg-gradient-to-r from-[#00C2FF] to-[#00FFD1] text-[#0A0F1E] rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00C2FF]/30 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-[#0A0F1E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#F0F4F8]/50">
          Already have an account? <Link to="/login" className="text-[#00FFD1] hover:underline font-medium ml-1">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
