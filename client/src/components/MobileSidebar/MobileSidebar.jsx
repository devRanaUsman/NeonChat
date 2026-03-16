import React from 'react';
import ConversationItem from '../Sidebar/ConversationItem';

const MobileSidebar = ({ isOpen, onClose, conversations, activeConversation, onSelect, onSearch, searchQuery, onNewChat }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Drawer */}
      <aside className="absolute left-0 top-0 bottom-0 w-80 bg-[#111827] border-r border-[#00C2FF]/20 transform transition-transform modal-animate overflow-y-auto flex flex-col">
        {/* Header */}
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
            <div className="flex items-center gap-2">
              <button onClick={() => { onNewChat(); onClose(); }} className="p-2 bg-[#00C2FF]/10 text-[#00C2FF] hover:bg-[#00C2FF]/20 rounded-lg transition-colors border border-[#00C2FF]/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button onClick={onClose} className="p-2 hover:bg-[#00C2FF]/10 rounded-lg transition-colors text-[#F0F4F8]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00C2FF]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-[#0A0F1E] border border-[#00C2FF]/20 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#F0F4F8] placeholder-[#F0F4F8]/30 focus:outline-none focus:border-[#00C2FF]/50"
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
                onClick={() => {
                  onSelect(conv);
                  onClose();
                }}
              />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MobileSidebar;
