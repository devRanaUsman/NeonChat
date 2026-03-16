import React, { useState } from 'react';
import ImageLightbox from './ImageLightbox';

const ImageMessage = ({ image, content, isSent }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!image || !image.url) return null;

  return (
    <>
      <div className="flex flex-col gap-2">
        <div 
          onClick={() => setIsOpen(true)}
          className={`w-fit max-w-[200px] max-h-[200px] rounded-xl overflow-hidden border border-[#00FFD1]/30 cursor-zoom-in group relative ${isSent ? 'ml-auto' : 'mr-auto'}`}
        >
          <img 
            src={image.thumbnail || image.url} 
            alt={image.name || 'Image attachment'} 
            className="w-full h-full object-cover group-hover:brightness-110 transition-all"
            loading="lazy"
          />
        </div>
        {content && (
          <p className={`${isSent ? 'text-[#0A0F1E] font-medium text-right' : 'text-[#F0F4F8] text-left'} text-sm leading-relaxed whitespace-pre-wrap word-break`}>
            {content}
          </p>
        )}
      </div>

      {isOpen && <ImageLightbox image={image} onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ImageMessage;
