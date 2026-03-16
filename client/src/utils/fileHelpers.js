export const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes'
    
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const fileValidationLimits = {
  maxSize: 25 * 1024 * 1024,  // 25MB
  allowedTypes: [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'video/mp4', 'video/webm',
    'audio/mpeg', 'audio/wav', 'audio/ogg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/zip',
    'text/plain', 'application/json',
    'text/javascript', 'text/x-python', 'application/javascript', 'text/x-js'
  ]
};

export const getFileTypeCategory = (mimeType) => {
  if (!mimeType) return 'file';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType === 'application/pdf') return 'pdf';
  if (
    mimeType.includes('javascript') || 
    mimeType.includes('python') || 
    mimeType.includes('json') || 
    mimeType === 'text/plain'
  ) return 'code';
  return 'file';
};
