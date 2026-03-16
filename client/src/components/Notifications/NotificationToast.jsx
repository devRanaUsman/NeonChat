import React, { useEffect, useState } from 'react';

const NotificationToast = ({ notification, onClose, onClick }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(onClose, 300); // Wait for animation
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  if (!notification) return null;

  return (
    <div 
      onClick={() => onClick(notification)}
      className={`fixed top-4 right-4 z-[9999] w-80 bg-[#111827] border border-[#00C2FF]/30 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 ease-out shadow-[0_0_20px_rgba(0,194,255,0.2)] ${
        isClosing ? 'translate-x-[120%] opacity-0' : 'translate-x-0 opacity-100 flex-col animate-[slideInRight_0.3s_ease-out]'
      }`}
    >
      <div className="p-4 flex gap-3 relative">
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-[#F0F4F8]/40 hover:text-[#F0F4F8] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className={`w-10 h-10 rounded-full bg-gradient-to-br flex-shrink-0 ${notification.senderGradient || 'from-purple-500 to-pink-500'} flex items-center justify-center text-white text-sm font-semibold`}>
          {notification.senderInitials || '??'}
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-[#F0F4F8] font-semibold text-sm truncate">{notification.senderName}</h4>
            <span className="text-[#00C2FF] text-[10px] font-mono whitespace-nowrap px-1.5 py-0.5 bg-[#00C2FF]/10 rounded border border-[#00C2FF]/20">💬 NEW</span>
          </div>
          <p className="text-[#F0F4F8]/60 text-sm truncate mb-1">{notification.messagePreview}</p>
          <span className="text-[#00FFD1] text-xs">Just now</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-0.5 w-full bg-[#111827]">
        <div className="h-full bg-gradient-to-r from-[#00C2FF] to-[#00FFD1] w-full animate-[shrinkX_4s_linear_forwards] origin-left"></div>
      </div>
      
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes shrinkX {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;
