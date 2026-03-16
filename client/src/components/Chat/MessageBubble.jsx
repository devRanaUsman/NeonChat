import React from 'react';
import { formatMessageTime } from '../../utils/formatTime';
import FileAttachment from './FileAttachment';
import ImageMessage from '../FileUpload/ImageMessage';
import VideoMessage from '../FileUpload/VideoMessage';
import AudioMessage from '../FileUpload/AudioMessage';
import CodeFileMessage from '../FileUpload/CodeFileMessage';
import { getFileTypeCategory } from '../../utils/fileHelpers';
import api from '../../utils/axiosInstance';

const MessageBubble = ({ message, isSent, user, contact, onDeleteMessage }) => {
  const avatarGradient = isSent ? (user?.avatarGradient || 'from-[#00C2FF] to-[#00FFD1]') : (contact?.avatarGradient || 'from-purple-500 to-pink-500');
  const initials = isSent ? user?.initials : contact?.initials;
  
  const isRead = message.readBy?.some(r => r.userId !== message.senderId?._id);
  
  // handleReact is removed as handleToggleReaction is now the primary reaction handler

  return (
    <div className={`flex flex-col mb-4 ${isSent ? 'items-end' : 'items-start'} relative group`}>
      <div className={`flex items-end gap-2 max-w-[85%] ${isSent ? 'flex-row-reverse' : 'flex-row'} relative`}>
      {!isSent && (
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient} flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold`}>
          {initials}
        </div>
      )}
      
      <div className="space-y-1">
        <div 
          className={`relative px-4 py-2.5 rounded-2xl ${
            isSent 
              ? 'bg-gradient-to-br from-[#00C2FF] to-[#00FFD1] text-[#0A0F1E] rounded-br-sm shadow-[0_4px_15px_rgba(0,194,255,0.2)]' 
              : 'bg-[#111827] text-[#F0F4F8] rounded-bl-sm border border-[#00C2FF]/20 shadow-lg'
          }`}
        >
          {message.isDeleted ? (
            <p className="text-[#0A0F1E]/60 italic text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
              This message was deleted
            </p>
          ) : (
            <>
              {/* Delete Button (Hover) */}
              {isSent && onDeleteMessage && (
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-full -left-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button 
                    onClick={() => onDeleteMessage(message._id)}
                    className="p-1.5 bg-[#111827] border border-red-500/30 rounded-full text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors shadow-lg"
                    title="Delete Message"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              )}
              {message.type === 'text' && (
                <p className={`${isSent ? 'text-[#0A0F1E] font-medium' : 'text-[#F0F4F8]'} text-sm leading-relaxed whitespace-pre-wrap word-break`}>
                  {message.content}
                </p>
              )}

              {message.type === 'image' && (
                <ImageMessage image={message.attachment} isSent={isSent} content={message.content} />
              )}

              {message.type === 'video' && (
                <VideoMessage video={message.attachment} isSent={isSent} content={message.content} />
              )}

              {message.type === 'audio' && (
                <AudioMessage audio={message.attachment} isSent={isSent} />
              )}
              
              {message.type === 'file' && getFileTypeCategory(message.attachment?.mimeType) === 'code' && (
                <CodeFileMessage file={message.attachment} isSent={isSent} content={message.content} />
              )}

              {message.type === 'file' && getFileTypeCategory(message.attachment?.mimeType) !== 'code' && (
                <FileAttachment file={message.attachment} isSent={isSent} content={message.content} />
              )}
            </>
          )}
        </div>
        <div className={`flex items-center gap-2 px-1 mt-1 ${isSent ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[#F0F4F8]/30 text-xs">
            {formatMessageTime(message.createdAt)}
          </span>
          
          {isSent && (
            <svg className={`w-4 h-4 ${isRead ? 'text-[#00FFD1]' : 'text-[#F0F4F8]/30'}`} fill="currentColor" viewBox="0 0 24 24">
              {isRead ? (
                <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
              ) : (
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              )}
            </svg>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default MessageBubble;
