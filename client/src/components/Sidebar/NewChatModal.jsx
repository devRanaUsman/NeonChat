import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';

const NewChatModal = ({ isOpen, onClose, onStartChat }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (query.trim().length > 0) {
      setLoading(true);
      setError('');
      timeoutId = setTimeout(async () => {
        try {
          const { data } = await api.get(`/auth/users/search?q=${query}`);
          setResults(data.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to search users');
        } finally {
          setLoading(false);
        }
      }, 500);
    } else {
      setResults([]);
      setError('');
    }

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleStartChat = async (userId) => {
    setStarting(true);
    try {
      const { data } = await api.post('/conversations', { userId });
      onStartChat(data.data);
      onClose();
      setQuery('');
      setResults([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start conversation');
    } finally {
      setStarting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="w-full max-w-md bg-[#111827] border border-[#00C2FF]/30 rounded-2xl shadow-2xl relative z-10 modal-animate flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-[#00C2FF]/20 flex justify-between items-center bg-[#0A0F1E]/50 rounded-t-2xl">
          <h2 className="text-[#F0F4F8] font-semibold text-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-[#00C2FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            New Conversation
          </h2>
          <button onClick={onClose} className="p-1 text-[#F0F4F8]/50 hover:text-[#00FFD1] hover:bg-[#00FFD1]/10 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 border-b border-[#00C2FF]/10">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00C2FF]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              autoFocus
              placeholder="Search users by name or @username..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#0A0F1E] border border-[#00C2FF]/20 rounded-xl py-3 pl-10 pr-4 text-sm text-[#F0F4F8] placeholder-[#F0F4F8]/30 focus:outline-none focus:border-[#00C2FF]/60 focus:ring-1 focus:ring-[#00C2FF]/40 transition-all font-sans"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
          {error && <div className="p-3 text-red-400 bg-red-400/10 text-center text-sm m-2 rounded-lg">{error}</div>}
          
          {loading ? (
             <div className="flex justify-center p-8">
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C2FF] to-[#00FFD1] animate-pulse"></div>
             </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map(user => (
                <div 
                  key={user._id} 
                  onClick={() => !starting && handleStartChat(user._id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-[#00C2FF]/10 transition-colors ${starting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.avatarGradient || 'from-purple-500 to-pink-500'} flex items-center justify-center text-white font-semibold flex-shrink-0`}>
                      {user.initials}
                    </div>
                    <div>
                      <h3 className="text-[#F0F4F8] font-medium text-sm md:text-base">{user.displayName}</h3>
                      <p className="text-[#F0F4F8]/50 text-xs">@{user.username}</p>
                    </div>
                  </div>
                  <button className="text-[#00C2FF] hover:text-[#00FFD1] bg-[#00C2FF]/10 p-2 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : query.trim().length > 0 ? (
            <div className="text-center p-8 text-[#F0F4F8]/40 text-sm">
              No users found matching "{query}"
            </div>
          ) : (
            <div className="text-center p-8 flex flex-col items-center">
              <svg className="w-12 h-12 text-[#00C2FF]/20 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-[#F0F4F8]/50 text-sm">Search for someone to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
