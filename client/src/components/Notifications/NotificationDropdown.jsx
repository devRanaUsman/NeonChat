import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ notification, markAsRead, onClick }) => {
  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    onClick(notification);
  };

  return (
    <div 
      onClick={handleClick}
      className={`flex items-start gap-3 p-3 cursor-pointer transition-all hover:bg-[#00C2FF]/10 ${
        !notification.isRead ? 'border-l-2 border-[#00C2FF] bg-[#00C2FF]/5' : ''
      }`}
    >
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br flex-shrink-0 ${notification.senderId?.avatarGradient || notification.senderGradient || 'from-purple-500 to-pink-500'} flex items-center justify-center text-white font-semibold text-sm`}>
        {notification.senderId?.initials || notification.senderInitials || '??'}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <span className={`text-sm truncate ${!notification.isRead ? 'font-bold text-[#F0F4F8]' : 'font-medium text-[#F0F4F8]/80'}`}>
            {notification.senderId?.displayName || notification.senderName}
          </span>
          <span className="text-xs text-[#00FFD1]/60 whitespace-nowrap ml-2">
            {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : ''}
          </span>
        </div>
        <p className={`text-xs truncate ${!notification.isRead ? 'text-[#F0F4F8]/90' : 'text-[#F0F4F8]/60'}`}>
          {notification.messagePreview}
        </p>
      </div>
    </div>
  );
};

const NotificationDropdown = ({ notifications, markAsRead, markAllAsRead, onNotificationClick }) => {
  const unreadExist = notifications.some(n => !n.isRead);

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-[#111827] border border-[#00C2FF]/20 rounded-2xl shadow-[0_0_30px_rgba(0,194,255,0.15)] z-50 overflow-hidden origin-top-right animate-[fadeInScale_0.2s_ease-out]">
      <div className="p-3 border-b border-[#00C2FF]/10 flex justify-between items-center bg-[#111827] sticky top-0 z-10">
        <h3 className="text-[#F0F4F8] font-semibold">Notifications</h3>
        {unreadExist && (
          <button 
            onClick={markAllAsRead}
            className="text-[#00C2FF] text-xs hover:text-[#00FFD1] transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#00C2FF]/30 scrollbar-track-transparent">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <NotificationItem 
              key={notif._id} 
              notification={notif} 
              markAsRead={markAsRead}
              onClick={onNotificationClick}
            />
          ))
        ) : (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#00C2FF]/10 flex items-center justify-center mb-3 text-[#00C2FF]/50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-[#F0F4F8]/40 mb-1">No notifications yet</p>
            <p className="text-[#F0F4F8]/20 text-xs">Messages will appear here</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default NotificationDropdown;
