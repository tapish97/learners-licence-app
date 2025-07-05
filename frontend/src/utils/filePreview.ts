// src/utils/filePreview.ts

import api from '../services/api';

/**
 * Get MIME type from filename extension
 */
export const getMimeType = (filename: string): string => {
  const lowered = filename.toLowerCase();
  if (lowered.endsWith('.pdf')) return 'application/pdf';
  if (lowered.endsWith('.jpg') || lowered.endsWith('.jpeg')) return 'image/jpeg';
  if (lowered.endsWith('.png')) return 'image/png';
  return 'application/octet-stream'; // fallback
};

/**
 * Get preview URL for a file — either blob URL (PDF) or data URI (image)
 */
export const getFilePreviewURL = async (filename: string): Promise<string | null> => {
  try {
    const mimeType = getMimeType(filename);
    const res = await api.get(`/files/${filename}`, {
      responseType: 'blob',
    });

    if (mimeType.startsWith('image/')) {
      // Convert to base64 data URL for <img /> usage
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(res.data);
      });
    }

    // For PDFs or others: return blob URL
    const blob = new Blob([res.data], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('❌ Failed to load file preview:', err);
    return null;
  }
};

/**
 * Open a protected file (e.g. PDF) in new tab
 */
export const openProtectedFile = async (filename: string) => {
  try {
    console.log('📂 API call to view document:', filename);
    const mimeType = getMimeType(filename);
    const res = await api.get(`/files/${filename}`, {
      responseType: 'blob',
    });

    const blob = new Blob([res.data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  } catch (err) {
    console.error('❌ File open failed:', err);
    alert('Unable to open file.');
  }
};
