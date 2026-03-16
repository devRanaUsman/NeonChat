import React from 'react';
import ConversationItem from './ConversationItem';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ conversations, activeConversation, onSelect, onSearch, searchQuery, onNewChat }) => {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-80 bg-[#111827] border-r border-[#00C2FF]/20">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#00C2FF]/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C2FF] to-[#00FFD1] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#0A0F1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-[#F0F4F8] font-semibold text-lg">NeonChat</h1>
              <p className="text-[#00FFD1] text-xs font-mono">End-to-End Encrypted</p>
            </div>
          </div>
          <button onClick={onNewChat} className="p-2 bg-[#00C2FF]/10 text-[#00C2FF] hover:bg-[#00C2FF]/20 hover:text-[#00FFD1] rounded-lg transition-colors border border-[#00C2FF]/30" title="New Chat">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        {/* Search Bar */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00C2FF]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search conversations..." 
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-[#0A0F1E] border border-[#00C2FF]/20 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#F0F4F8] placeholder-[#F0F4F8]/30 focus:outline-none focus:border-[#00C2FF]/50 focus:ring-1 focus:ring-[#00C2FF]/30 transition-all font-sans"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        <p className="text-[#F0F4F8]/40 text-xs font-medium uppercase tracking-wider px-3 py-2">Messages</p>
        <div className="space-y-1">
          {conversations.map((conv) => (
            <ConversationItem 
              key={conv._id} 
              conversation={conv} 
              isActive={activeConversation?._id === conv._id}
              onClick={() => onSelect(conv)}
            />
          ))}
          {conversations.length === 0 && (
             <div className="px-3 py-4 text-center text-[#F0F4F8]/50 text-sm">No conversations found</div>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-[#00C2FF]/20 bg-[#0A0F1E]/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${user?.avatarGradient || 'from-[#00C2FF] to-[#00FFD1]'} flex items-center justify-center text-white font-bold text-sm`}>
              {user?.initials || 'YO'}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00FFD1] rounded-full border-2 border-[#111827]"></span>
          </div>
          <div className="flex-1">
            <p className="text-[#F0F4F8] font-medium text-sm">{user?.displayName || 'You'}</p>
            <p className="text-[#00FFD1] text-xs">Online</p>
          </div>
          <button onClick={logout} className="p-2 hover:bg-[#00C2FF]/10 rounded-lg transition-colors" title="Settings / Logout">
            <svg className="w-5 h-5 text-[#F0F4F8]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
