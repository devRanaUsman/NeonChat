import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { formatConversationTime } from '../../utils/formatTime';

const ConversationItem = ({ conversation, isActive, onClick }) => {
  const { user } = useAuth();
  
  const contact = conversation.participants.find(p => p._id !== user._id) || conversation.participants[0];
  const lastMsg = conversation.lastMessage;
  
  const isOnline = contact?.status === 'online';
  const unreadCount = conversation.unreadCount?.[user._id] || 0;

  return (
    <div 
      onClick={onClick}
      className={`contact-item flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
        isActive 
          ? 'bg-gradient-to-r from-[#00C2FF]/15 to-transparent border-l-2 border-[#00C2FF]' 
          : 'transition-all'
      }`}
    >
      <div className="relative">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${contact?.avatarGradient || 'from-purple-500 to-pink-500'} flex items-center justify-center text-white font-semibold`}>
          {contact?.initials || '??'}
        </div>
        {isOnline ? (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#00FFD1] rounded-full border-2 border-[#111827] pulse-online"></span>
        ) : contact?.status === 'away' ? (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-yellow-500 rounded-full border-2 border-[#111827]"></span>
        ) : (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#F0F4F8]/30 rounded-full border-2 border-[#111827]"></span>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-[#F0F4F8] font-medium truncate">{contact?.displayName || 'Unknown'}</h3>
          {lastMsg && (
            <span className={`${unreadCount > 0 ? 'text-[#00FFD1]' : 'text-[#F0F4F8]/30'} text-xs`}>
              {formatConversationTime(lastMsg.createdAt)}
            </span>
          )}
        </div>
        <p className={`${unreadCount > 0 ? 'text-[#00C2FF] font-semibold' : 'text-[#F0F4F8]/50'} text-sm truncate`}>
          {lastMsg?.type === 'image' ? '📷 Image' : lastMsg?.type === 'file' ? '📁 File' : (lastMsg?.content || 'Started a conversation')}
        </p>
      </div>
      
      {unreadCount > 0 && (
        <span className="bg-[#00C2FF] text-[#0A0F1E] text-xs font-bold px-2 py-0.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,194,255,0.4)]">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default ConversationItem;
