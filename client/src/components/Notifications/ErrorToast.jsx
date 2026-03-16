import React, { useEffect, useState } from 'react';

const ErrorToast = ({ message, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!message) return;
    
    setIsClosing(false);
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(onClose, 300); // Wait for animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  if (!message) return null;

  return (
    <div 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-80 bg-[#111827] border border-red-500/30 border-l-4 border-l-red-500 rounded-2xl overflow-hidden transition-all duration-300 ease-out shadow-[0_0_20px_rgba(239,68,68,0.2)] flex flex-col ${
        isClosing ? '-translate-y-[150%] opacity-0' : 'translate-y-0 opacity-100 animate-[slideDown_0.3s_ease-out]'
      }`}
    >
      <div className="p-4 flex gap-3 relative items-center">
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-[#F0F4F8]/40 hover:text-[#F0F4F8] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="w-8 h-8 rounded-full bg-red-500/20 flex-shrink-0 flex items-center justify-center text-red-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <p className="text-[#F0F4F8] text-sm font-medium">{message}</p>
        </div>
      </div>
      
      <style>{`
        @keyframes slideDown {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ErrorToast;
