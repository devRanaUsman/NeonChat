import React from 'react';
import NotificationBell from '../Notifications/NotificationBell';

const ChatHeader = ({ conversation, user, onMobileMenu, onVideoCall, notifications, unreadCount, markAsRead, markAllAsRead, onNotificationClick }) => {
  if (!conversation) return null;
  
  const contact = conversation.participants.find(p => p._id !== user._id) || conversation.participants[0];
  const isOnline = contact?.status === 'online';

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-[#111827]/80 border-b border-[#00C2FF]/20 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button onClick={onMobileMenu} className="md:hidden p-2 hover:bg-[#00C2FF]/10 rounded-lg transition-colors">
          <svg className="w-6 h-6 text-[#F0F4F8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${contact?.avatarGradient || 'from-purple-500 to-pink-500'} flex items-center justify-center text-white font-semibold`}>
          {contact?.initials || '??'}
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[#F0F4F8] font-semibold">{contact?.displayName}</h2>
            <svg className="w-4 h-4 text-[#00FFD1]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
          </div>
          <p className="text-[#00FFD1] text-xs flex items-center gap-1">
            {isOnline ? (
              <><span className="w-2 h-2 bg-[#00FFD1] rounded-full pulse-online"></span> Online</>
            ) : (
              <span className="text-[#F0F4F8]/50">Offline</span>
            )}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button onClick={onVideoCall} className="p-2.5 bg-[#00C2FF]/10 hover:bg-[#00C2FF]/20 rounded-xl transition-all neon-border">
          <svg className="w-5 h-5 text-[#00C2FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <NotificationBell 
          notifications={notifications || []} 
          unreadCount={unreadCount || 0}
          markAsRead={markAsRead}
          markAllAsRead={markAllAsRead}
          onNotificationClick={onNotificationClick}
        />
        <button className="p-2.5 hover:bg-[#00C2FF]/10 rounded-xl transition-all">
          <svg className="w-5 h-5 text-[#F0F4F8]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
