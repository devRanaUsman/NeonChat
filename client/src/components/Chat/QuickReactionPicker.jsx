import React, { useRef, useEffect } from 'react';
import EmojiPicker from '../Emoji/EmojiPicker';

const QUICK_EMOJIS = ['❤️', '👍', '😂', '🔥', '😢', '🙏'];

const QuickReactionPicker = ({ onSelect, onClose }) => {
  const [showFullPicker, setShowFullPicker] = React.useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      ref={pickerRef}
      className={`absolute z-50 bg-[#111827] border border-[#00C2FF]/20 rounded-full shadow-[0_0_20px_rgba(0,194,255,0.15)] p-1 flex items-center gap-1 animate-[fadeInScale_0.2s_ease-out] top-1/2 -translate-y-1/2 left-full ml-2`}
    >
      {QUICK_EMOJIS.map(emoji => (
        <button
          key={emoji}
          onClick={() => {
            onSelect(emoji);
            onClose();
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-[#00C2FF]/20 hover:scale-125 transition-all text-[#F0F4F8]"
        >
          {emoji}
        </button>
      ))}
      <div className="w-[1px] h-5 bg-[#00C2FF]/20 mx-1"></div>
      <div className="relative">
        <button
          onClick={() => setShowFullPicker(!showFullPicker)}
          className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#00C2FF]/20 transition-all ${showFullPicker ? 'bg-[#00C2FF]/20 text-[#00C2FF]' : 'text-[#F0F4F8]/50 hover:text-[#00C2FF]'}`}
          title="More Emojis"
        >
          <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </button>
        {showFullPicker && (
          <div className="absolute bottom-full right-0 mb-2">
             <EmojiPicker 
               onSelectEmoji={(emoji) => {
                 onSelect(emoji);
                 onClose();
               }} 
               onClose={() => setShowFullPicker(false)} 
             />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickReactionPicker;
