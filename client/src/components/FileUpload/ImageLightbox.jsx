import React, { useEffect } from 'react';

const ImageLightbox = ({ image, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0A0F1E]/95 backdrop-blur-md flex items-center justify-center animate-[fadeInScale_0.2s_ease-out]">
      <div className="absolute top-6 right-6 flex gap-4">
        <a 
          href={image.url} 
          download={image.name || 'download'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-3 bg-[#00C2FF]/20 hover:bg-[#00C2FF]/40 rounded-full transition-colors text-[#00C2FF]"
          title="Download Image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        </a>
        <button 
          onClick={onClose}
          className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-colors text-red-500"
          title="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <img 
        src={image.url} 
        alt={image.name || 'Fullscreen Image'} 
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-[0_0_50px_rgba(0,194,255,0.1)]"
      />

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ImageLightbox;
