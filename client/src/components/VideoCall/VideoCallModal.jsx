import React, { useState, useEffect } from 'react';

const VideoCallModal = ({ isOpen, onClose, contact, user }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (isOpen) {
      setTimer(0);
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 video-modal-backdrop z-50">
      <div className="w-full h-full flex flex-col modal-animate">
        {/* Video Area */}
        <div className="flex-1 relative p-4 md:p-8">
          
          {/* Main Video (Other Person) */}
          <div className="w-full h-full rounded-3xl bg-gradient-to-br from-[#111827] to-[#0A0F1E] border border-[#00C2FF]/20 flex items-center justify-center overflow-hidden">
            <div className="text-center">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${contact?.avatarGradient || 'from-purple-500 to-pink-500'} flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 neon-glow`}>
                {contact?.initials || '??'}
              </div>
              <p className="text-[#F0F4F8] text-xl font-semibold">{contact?.displayName || 'Unknown'}</p>
              <p className="text-[#00FFD1] text-sm mt-1">Connected • {formatTime(timer)}</p>
            </div>
          </div>

          {/* Self Video (Picture-in-Picture) */}
          <div className="absolute bottom-8 right-8 w-40 h-28 md:w-52 md:h-36 rounded-2xl bg-gradient-to-br from-[#0A0F1E] to-[#111827] border border-[#00FFD1]/30 flex items-center justify-center shadow-2xl overflow-hidden">
            {isCameraOff ? (
              <div className="text-center">
                <svg className="w-8 h-8 text-[#F0F4F8]/30 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            ) : (
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${user?.avatarGradient || 'from-[#00C2FF] to-[#00FFD1]'} flex items-center justify-center text-[#0A0F1E] font-bold mx-auto mb-1`}>
                  {user?.initials || 'YO'}
                </div>
                <p className="text-[#F0F4F8]/70 text-xs">You</p>
              </div>
            )}
          </div>

          {/* Call Info */}
          <div className="absolute top-8 left-8 flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#111827]/90 backdrop-blur-sm px-4 py-2 rounded-full border border-[#00C2FF]/20">
              <svg className="w-4 h-4 text-[#00FFD1]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
              <span className="text-[#F0F4F8] text-sm font-medium">End-to-End Encrypted</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`control-btn w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 border-red-500' : 'bg-[#111827] border border-[#00C2FF]/30 hover:bg-[#00C2FF]/20'}`}
            >
              <svg className="w-6 h-6 text-[#F0F4F8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMuted ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                )}
              </svg>
            </button> 
            
            <button 
              onClick={() => setIsCameraOff(!isCameraOff)}
              className={`control-btn w-14 h-14 rounded-full flex items-center justify-center transition-all ${isCameraOff ? 'bg-red-500 border-red-500' : 'bg-[#111827] border border-[#00C2FF]/30 hover:bg-[#00C2FF]/20'}`}
            >
              <svg className="w-6 h-6 text-[#F0F4F8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isCameraOff ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /> // Keeping same icon for simplicity based on provided HTML
                )}
              </svg>
            </button> 
            
            <button className="control-btn w-14 h-14 rounded-full bg-[#111827] border border-[#00C2FF]/30 flex items-center justify-center hover:bg-[#00C2FF]/20 transition-all hidden md:flex">
              <svg className="w-6 h-6 text-[#F0F4F8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button> 
            
            <button onClick={onClose} className="control-btn end-call-btn w-16 h-16 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-all">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
            </button> 
            
            <button className="control-btn w-14 h-14 rounded-full bg-[#111827] border border-[#00C2FF]/30 flex items-center justify-center hover:bg-[#00C2FF]/20 transition-all hidden md:flex">
              <svg className="w-6 h-6 text-[#F0F4F8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
