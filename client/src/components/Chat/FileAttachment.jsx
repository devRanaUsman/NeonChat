import React from 'react';
import { formatBytes } from '../../utils/fileHelpers';

const FileAttachment = ({ file, isSent, content }) => {
  return (
    <div>
      <div className={`flex items-center gap-3 p-3 rounded-xl border ${isSent ? 'bg-[#0088B3]/50 border-white/20' : 'bg-[#0A0F1E]/50 border-[#00C2FF]/20'}`}>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSent ? 'bg-white/20' : 'bg-gradient-to-br from-[#00C2FF] to-[#00FFD1]'}`}>
          <svg className={`w-5 h-5 ${isSent ? 'text-white' : 'text-[#0A0F1E]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`${isSent ? 'text-[#0A0F1E]' : 'text-[#F0F4F8]'} text-sm font-medium truncate`}>{file?.name}</p>
          <p className={`${isSent ? 'text-[#0A0F1E]/70' : 'text-[#F0F4F8]/40'} text-xs`}>{formatBytes(file?.size)} • {file?.mimeType?.split('/')[1]?.toUpperCase() || 'File'}</p>
        </div>
        <a href={file?.url} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg transition-colors ${isSent ? 'hover:bg-black/10' : 'hover:bg-[#00C2FF]/20'}`}>
          <svg className={`w-5 h-5 ${isSent ? 'text-[#0A0F1E]' : 'text-[#00C2FF]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>
      </div>
      {content && <p className={`${isSent ? 'text-[#0A0F1E] font-medium' : 'text-[#F0F4F8]'} text-sm mt-2`}>{content}</p>}
    </div>
  );
};

export default FileAttachment;
