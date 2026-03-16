import React, { useState, useRef } from 'react';

const ReactionBar = ({ reactions, currentUserId, onToggleReaction }) => {
  if (!reactions || reactions.length === 0) return null;

  // Group reactions by emoji
  const groupedReactions = reactions.reduce((acc, curr) => {
    if (!acc[curr.emoji]) {
      acc[curr.emoji] = { count: 0, users: [] };
    }
    acc[curr.emoji].count++;
    acc[curr.emoji].users.push(curr.user);
    return acc;
  }, {});

  return (
    <div className="flex flex-wrap gap-1 mt-1 z-10 relative">
      {Object.entries(groupedReactions).map(([emoji, data]) => {
        const hasReacted = data.users.some(u => u._id === currentUserId || u === currentUserId);
        
        return (
          <div key={emoji} className="relative group">
            <button
              onClick={() => onToggleReaction(emoji)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-medium transition-colors ${
                hasReacted 
                  ? 'bg-[#00C2FF]/20 border-[#00C2FF]/40 text-[#00C2FF]' 
                  : 'bg-[#111827]/80 border-[#F0F4F8]/10 text-[#F0F4F8]/70 hover:bg-[#111827] hover:border-[#00C2FF]/30'
              }`}
            >
              <span>{emoji}</span>
              <span>{data.count}</span>
            </button>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-50 pointer-events-none">
              <div className="bg-[#0A0F1E] border border-[#00C2FF]/20 text-[#F0F4F8] text-[10px] py-1 px-2 rounded-lg whitespace-nowrap shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
                {data.users.map(u => u.username || 'Someone').join(', ')}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReactionBar;
