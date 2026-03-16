import React, { useState, useRef, useEffect } from 'react';
import NotificationDropdown from './NotificationDropdown';

const NotificationBell = ({ notifications, unreadCount, markAsRead, markAllAsRead, onNotificationClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={bellRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2.5 hover:bg-[#00C2FF]/10 rounded-xl transition-all relative"
      >
        <svg className="w-5 h-5 text-[#F0F4F8]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00C2FF] rounded-full text-[#0A0F1E] text-[10px] font-bold flex items-center justify-center animate-bounce shadow-[0_0_10px_rgba(0,194,255,0.5)]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown 
          notifications={notifications} 
          markAsRead={markAsRead}
          markAllAsRead={markAllAsRead}
          onNotificationClick={(notification) => {
            setIsOpen(false);
            onNotificationClick(notification);
          }}
        />
      )}
    </div>
  );
};

export default NotificationBell;
