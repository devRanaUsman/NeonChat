import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { isToday, isYesterday, format } from 'date-fns';

const MessageList = ({ messages, user, activeConversation, isTyping, onDeleteMessage }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!activeConversation) return null;
  const contact = activeConversation.participants.find(p => p._id !== user._id) || activeConversation.participants[0];

  let lastDateStr = null;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6 space-y-4 bg-[#0A0F1E]">
      {messages.map((msg, index) => {
        const msgDateObj = new Date(msg.createdAt);
        let currentGroupKey = '';
        let dateLabel = '';

        if (isToday(msgDateObj)) {
          currentGroupKey = 'today';
          dateLabel = 'Today';
        } else if (isYesterday(msgDateObj)) {
          currentGroupKey = 'yesterday';
          dateLabel = 'Yesterday';
        } else {
          currentGroupKey = format(msgDateObj, 'MM/dd/yyyy');
          dateLabel = format(msgDateObj, 'MMMM d, yyyy');
        }

        const showDateDivider = lastDateStr !== currentGroupKey;
        lastDateStr = currentGroupKey;

        return (
          <React.Fragment key={msg._id}>
            {showDateDivider && (
              <div className="flex items-center justify-center pt-2 pb-1">
                <span className="px-4 py-1 bg-[#111827] rounded-full text-[#F0F4F8]/40 text-xs font-medium">
                  {dateLabel}
                </span>
              </div>
            )}
            <MessageBubble 
              message={msg} 
              isSent={msg.senderId?._id === user._id || msg.senderId === user._id} 
              user={user} 
              contact={contact} 
              onDeleteMessage={onDeleteMessage}
            />
          </React.Fragment>
        );
      })}
      
      {isTyping && (
        <TypingIndicator contact={contact} />
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
