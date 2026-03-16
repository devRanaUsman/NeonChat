import React, { useState, useRef, useEffect } from 'react';

const AudioMessage = ({ audio, isSent }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const updateProgress = () => {
      setProgress((audioEl.currentTime / audioEl.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      if (audioEl.duration && audioEl.duration !== Infinity) {
        setDuration(audioEl.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audioEl.addEventListener('timeupdate', updateProgress);
    audioEl.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioEl.addEventListener('ended', handleEnded);

    return () => {
      audioEl.removeEventListener('timeupdate', updateProgress);
      audioEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioEl.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Pseudo-waveform static bars for UI consistency (real waveform requires analyzing array buffer which is heavy)
  const bars = Array.from({ length: 15 });

  return (
    <div className={`p-3 rounded-xl border flex items-center gap-3 ${isSent ? 'bg-[#0088B3]/50 border-white/20 ml-auto' : 'bg-[#0A0F1E]/50 border-[#00C2FF]/20 mr-auto'} max-w-[280px]`}>
      <button 
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${
          isSent ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-[#00C2FF]/20 hover:bg-[#00C2FF]/30 text-[#00C2FF]'
        }`}
      >
        {isPlaying ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z" /></svg>
        ) : (
          <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>

      <div className="flex-1 flex flex-col gap-1 min-w-[120px]">
        {/* Waveform representation */}
        <div className="flex items-center gap-[2px] h-6 w-full relative">
          <div className="absolute inset-0 flex items-center gap-[2px] opacity-30">
            {bars.map((_, i) => (
              <div key={i} className={`flex-1 rounded-full ${isSent ? 'bg-[#0A0F1E]' : 'bg-[#00C2FF]'}`} style={{ height: `${20 + Math.random() * 80}%` }}></div>
            ))}
          </div>
          {/* Progress Overlay */}
          <div className="absolute inset-y-0 left-0 flex items-center gap-[2px] overflow-hidden" style={{ width: `${progress}%` }}>
            <div className="flex w-[120px] items-center gap-[2px] h-full absolute left-0" style={{ minWidth: '100%' }}>
              {bars.map((_, i) => (
                <div key={`fill-${i}`} className={`flex-1 rounded-full ${isSent ? 'bg-[#0A0F1E]' : 'bg-[#00FFD1]'}`} style={{ height: `${20 + Math.random() * 80}%` }}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center px-1">
          <span className={`text-[10px] font-mono ${isSent ? 'text-[#0A0F1E]/70' : 'text-[#F0F4F8]/60'}`}>
            {formatTime(audioRef.current?.currentTime || 0)}
          </span>
          <span className={`text-[10px] font-mono ${isSent ? 'text-[#0A0F1E]/70' : 'text-[#F0F4F8]/60'}`}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <audio ref={audioRef} src={audio?.url} preload="metadata" className="hidden" />
    </div>
  );
};

export default AudioMessage;
