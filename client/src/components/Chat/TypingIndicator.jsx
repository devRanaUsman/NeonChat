import React from 'react';

const TypingIndicator = ({ contact }) => {
  return (
    <div className="flex items-end gap-2 max-w-[85%] md:max-w-[70%]">
      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${contact?.avatarGradient || 'from-purple-500 to-pink-500'} flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold`}>
        {contact?.initials || '??'}
      </div>
      <div className="message-bubble-received rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="typing-dot w-2 h-2 bg-[#00FFD1] rounded-full"></span> 
          <span className="typing-dot w-2 h-2 bg-[#00FFD1] rounded-full"></span> 
          <span className="typing-dot w-2 h-2 bg-[#00FFD1] rounded-full"></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
