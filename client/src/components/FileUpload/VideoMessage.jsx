import React from 'react';

const VideoMessage = ({ video, isSent, content }) => {
  if (!video || !video.url) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className={`w-fit max-w-[280px] rounded-xl overflow-hidden border border-[#00FFD1]/30 ${isSent ? 'ml-auto' : 'mr-auto'}`}>
        <video 
          src={video.url}
          controls
          controlsList="nodownload"
          poster={video.thumbnail}
          className="w-full h-auto max-h-[250px] object-contain bg-black/50"
        />
      </div>
      {content && (
        <p className={`${isSent ? 'text-[#0A0F1E] font-medium text-right' : 'text-[#F0F4F8] text-left'} text-sm leading-relaxed whitespace-pre-wrap word-break`}>
          {content}
        </p>
      )}
    </div>
  );
};

export default VideoMessage;
