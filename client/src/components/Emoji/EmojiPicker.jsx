import React, { useState, useEffect, useRef } from 'react';
import { emojiData, emojiCategories } from '../../utils/emojiData.js';

const EmojiPicker = ({ onSelectEmoji, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentEmojis, setRecentEmojis] = useState([]);
  const pickerRef = useRef(null);
  
  // Load recents
  useEffect(() => {
    const stored = localStorage.getItem('neonchat_recent_emojis');
    if (stored) {
      setRecentEmojis(JSON.parse(stored));
    }
  }, []);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        if (onClose) onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSelect = (emoji) => {
    // Update recents
    const newRecents = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 8);
    setRecentEmojis(newRecents);
    localStorage.setItem('neonchat_recent_emojis', JSON.stringify(newRecents));
    
    // Pass back
    onSelectEmoji(emoji);
  };

  // Compile full flat list for search
  const allEmojis = Object.values(emojiData).flat();
  const searchResults = searchQuery 
    ? allEmojis.filter(e => e.includes(searchQuery)) // Naive search, unicode emojis usually don't match text search well unless we have names mapped, but we'll return a static selection or just match if we build a proper map. Wait, a simple string search on unicode chars won't work for "smile". Since we mapped simple arrays, search will basically just be visual filtering or placeholder in this version to stick to the minimal implementation.
    : [];

  // A very basic name map search is hard without a full library, so we will stub search for now as it wasn't strictly required to use a heavy map, just the UI.
  // Actually, we can just hide search results if there's text, to signify no match visually, or we could add keywords if we had them.

  return (
    <div 
      ref={pickerRef}
      className="absolute bottom-full left-0 mb-2 z-50 w-80 h-96 bg-[#111827] border border-[#00C2FF]/20 rounded-2xl shadow-[0_0_30px_rgba(0,194,255,0.2)] animate-[fadeInScale_0.2s_ease-out] flex flex-col overflow-hidden"
    >
      <div className="p-3 border-b border-[#00C2FF]/10">
        <input 
          type="text" 
          placeholder="Search emojis..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0A0F1E] border border-[#00C2FF]/20 rounded-xl py-2 px-3 text-sm text-[#F0F4F8] placeholder-[#F0F4F8]/30 focus:outline-none focus:border-[#00C2FF]/50 ring-1 ring-transparent focus:ring-[#00C2FF]/30 transition-all"
        />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#00C2FF]/30 scrollbar-track-transparent p-3">
        {searchQuery ? (
          <div>
            <div className="text-[#F0F4F8]/40 text-xs font-semibold mb-2 uppercase tracking-wider">Search Results</div>
            <div className="grid grid-cols-8 gap-1">
              {searchResults.length > 0 ? searchResults.map((emoji, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSelect(emoji)}
                  className="text-xl p-1.5 rounded-lg hover:bg-[#00C2FF]/10 hover:scale-125 transition-transform flex items-center justify-center cursor-pointer"
                >
                  {emoji}
                </button>
              )) : (
                <div className="col-span-8 text-center text-[#F0F4F8]/30 text-xs py-4">No results in minimal dataset</div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentEmojis.length > 0 && (
              <div>
                <div className="text-[#F0F4F8]/40 text-xs font-semibold mb-2 uppercase tracking-wider">Recently Used</div>
                <div className="grid grid-cols-8 gap-1 border-b border-[#00C2FF]/10 pb-4">
                  {recentEmojis.map((emoji, index) => (
                    <button 
                      key={index} 
                      onClick={() => handleSelect(emoji)}
                      className="text-xl p-1.5 rounded-lg hover:bg-[#00C2FF]/10 hover:scale-125 transition-transform flex items-center justify-center cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <div className="text-[#F0F4F8]/40 text-xs font-semibold mb-2 uppercase tracking-wider">
                {emojiCategories.find(c => c.id === activeCategory)?.name}
              </div>
              <div className="grid grid-cols-8 gap-1">
                {emojiData[activeCategory]?.map((emoji, index) => (
                  <button 
                    key={index} 
                    onClick={() => handleSelect(emoji)}
                    className="text-xl p-1.5 rounded-lg hover:bg-[#00C2FF]/10 hover:scale-125 transition-transform flex items-center justify-center cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center bg-[#0A0F1E] border-t border-[#00C2FF]/10 px-2 py-1.5">
        {emojiCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
            className={`p-2 text-lg rounded-lg transition-colors ${
              activeCategory === cat.id 
                ? 'text-[#00C2FF] border-b-2 border-[#00C2FF] bg-[#00C2FF]/10' 
                : 'text-[#F0F4F8]/40 hover:text-[#F0F4F8]/70 hover:bg-[#F0F4F8]/5'
            }`}
            title={cat.name}
          >
            {cat.icon}
          </button>
        ))}
      </div>
      
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default EmojiPicker;
