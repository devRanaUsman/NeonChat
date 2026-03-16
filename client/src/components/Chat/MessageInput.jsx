import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from '../Emoji/EmojiPicker';
import FileUploadButton from '../FileUpload/FileUploadButton';
import FilePreviewBar from '../FileUpload/FilePreviewBar';
import ErrorToast from '../Notifications/ErrorToast';
import api from '../../utils/axiosInstance';

const MessageInput = ({ onSendMessage, onTypingStart, onTypingStop }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojiBtnRef = useRef(null);

  const handleInput = (e) => {
    const val = e.target.value;
    setMessage(val);
    
    // Auto resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }

    // Handle typing events
    if (onTypingStart) {
      onTypingStart();
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        if (onTypingStop) onTypingStop();
      }, 2000);
    }
  };

  const handleEmojiSelect = (emoji) => {
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      const textBefore = message.substring(0, cursorPosition);
      const textAfter = message.substring(cursorPosition);
      
      setMessage(textBefore + emoji + textAfter);
      
      // Move cursor after the inserted emoji
      setTimeout(() => {
        textareaRef.current.selectionStart = cursorPosition + emoji.length;
        textareaRef.current.selectionEnd = cursorPosition + emoji.length;
        textareaRef.current.focus();
      }, 10);
    } else {
      setMessage(prev => prev + emoji);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;
    if (isUploading) return;

    let attachment = null;
    let type = 'text';

    if (selectedFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const res = await api.post('/upload', formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        });

        attachment = res.data.data;
        if (attachment.mimeType.startsWith('image/')) type = 'image';
        else if (attachment.mimeType.startsWith('video/')) type = 'video';
        else if (attachment.mimeType.startsWith('audio/')) type = 'audio';
        else type = 'file';
        
      } catch (err) {
        console.error('File upload failed', err);
        setIsUploading(false);
        return; // Early return on error, could show toast
      }
    }

    onSendMessage(message.trim(), type, attachment);
    setMessage('');
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    if (onTypingStop) {
      clearTimeout(typingTimeoutRef.current);
      onTypingStop();
    }
  };

  return (
    <div className="bg-[#111827]/80 border-t border-[#00C2FF]/20 backdrop-blur-sm relative flex flex-col">
      {selectedFile && (
        <FilePreviewBar 
          file={selectedFile} 
          uploadProgress={uploadProgress} 
          onCancel={() => {
            if (!isUploading) { 
              setSelectedFile(null); 
              setUploadProgress(0);
            }
          }} 
        />
      )}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-3 w-full">
          <div className="flex gap-2">
            <FileUploadButton 
              onFileSelect={setSelectedFile} 
              onError={(msg) => setValidationError(msg)} 
            />
          </div>
          <div className="relative hidden md:block" ref={emojiBtnRef}>
            <button 
              type="button" 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2.5 rounded-xl transition-all ${showEmojiPicker ? 'bg-[#00C2FF]/20 text-[#00C2FF]' : 'hover:bg-[#00C2FF]/10 text-[#F0F4F8]/50 hover:text-[#00C2FF]'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            {showEmojiPicker && (
              <EmojiPicker 
                onSelectEmoji={handleEmojiSelect} 
                onClose={() => setShowEmojiPicker(false)} 
              />
            )}
          </div>
        
        <div className="flex-1 relative">
          <textarea 
            ref={textareaRef}
            rows="1" 
            placeholder="Type a message..." 
            value={message}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="w-full bg-[#0A0F1E] border border-[#00C2FF]/20 rounded-2xl py-3 px-4 pr-12 text-sm text-[#F0F4F8] placeholder-[#F0F4F8]/30 focus:outline-none focus:border-[#00C2FF]/50 focus:ring-1 focus:ring-[#00C2FF]/30 resize-none transition-all scrollbar-thin overflow-y-auto"
            style={{ maxHeight: '120px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={(!message.trim() && !selectedFile) || isUploading}
          className="p-3 bg-gradient-to-r from-[#00C2FF] to-[#00FFD1] rounded-xl hover:shadow-lg hover:shadow-[#00C2FF]/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex-shrink-0"
        >
          {isUploading ? (
            <div className="w-5 h-5 rounded-full border-2 border-[#0A0F1E] border-t-transparent animate-spin"></div>
          ) : (
            <svg className="w-5 h-5 text-[#0A0F1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>
      </div>
      <ErrorToast message={validationError} onClose={() => setValidationError('')} />
    </div>
  );
};

export default MessageInput;
