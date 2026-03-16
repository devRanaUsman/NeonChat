import React, { useState, useEffect } from 'react';
import { formatBytes } from '../../utils/fileHelpers';

const CodeFileMessage = ({ file, isSent, content }) => {
  const [codePreview, setCodePreview] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch first few lines of the code file if possible
    fetch(file.url)
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n');
        setCodePreview(lines.slice(0, 5).join('\n') + (lines.length > 5 ? '\n...' : ''));
        setLoading(false);
      })
      .catch(() => {
        setCodePreview('// Preview unavailable');
        setLoading(false);
      });
  }, [file.url]);

  return (
    <div className={`flex flex-col gap-2 max-w-[280px] w-full ${isSent ? 'ml-auto' : 'mr-auto'}`}>
      <div className="bg-[#0A0F1E] border border-[#00C2FF]/20 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,194,255,0.05)]">
        <div className="bg-[#111827] border-b border-[#00C2FF]/10 px-3 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2 min-w-0">
            <svg className="w-4 h-4 text-[#00FFD1] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            <span className="text-[#F0F4F8] text-xs font-medium truncate">{file.name}</span>
          </div>
          <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-[#00C2FF] hover:text-[#00FFD1] p-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </a>
        </div>
        
        <div className="p-3 overflow-x-auto scrollbar-thin scrollbar-thumb-[#00C2FF]/30">
          {loading ? (
             <div className="text-[#F0F4F8]/30 text-xs font-mono animate-pulse">Loading preview...</div>
          ) : (
             <pre className="text-[#00FFD1] text-[11px] font-mono leading-relaxed m-0 p-0 bg-transparent">
               <code>{codePreview}</code>
             </pre>
          )}
        </div>
        
        <div className="px-3 py-2 border-t border-[#00C2FF]/10 text-[#F0F4F8]/40 text-[10px] flex justify-between items-center">
          <a href={file.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#00C2FF] transition-colors uppercase font-semibold">View full file</a>
          <span>{formatBytes(file.size)}</span>
        </div>
      </div>
      
      {content && (
        <p className={`${isSent ? 'text-[#0A0F1E] font-medium text-right' : 'text-[#F0F4F8] text-left'} text-sm leading-relaxed whitespace-pre-wrap word-break`}>
          {content}
        </p>
      )}
    </div>
  );
};

export default CodeFileMessage;
