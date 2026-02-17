/**
 * share.ts — Web Share API file sharing with graceful fallbacks
 */

/**
 * Share a file via Web Share API if supported, otherwise fallback
 * 
 * @param file - File to share
 * @param title - Share dialog title
 * @param text - Share dialog text (optional)
 * @param fallbackDownload - If true and Web Share is not available, download the file instead
 * @returns true if shared/downloaded successfully, false otherwise
 */
export async function shareFileOrFallback(options: {
  file: File;
  title: string;
  text?: string;
  fallbackDownload?: boolean;
}): Promise<boolean> {
  const { file, title, text, fallbackDownload = true } = options;
  
  // Check if Web Share API is available and supports files
  const canShare =
    typeof navigator !== "undefined" &&
    "canShare" in navigator &&
    typeof navigator.canShare === "function" &&
    "share" in navigator &&
    typeof navigator.share === "function";
  
  if (canShare) {
    try {
      // Check if this specific file can be shared
      const shareData: ShareData = {
        files: [file],
        title,
      };
      
      if (text) {
        shareData.text = text;
      }
      
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return true;
      }
    } catch (error) {
      // User cancelled or share failed
      if (error instanceof Error && error.name === "AbortError") {
        // User cancelled, that's ok
        return false;
      }
      
      // Fall through to fallback
      console.warn("Web Share failed:", error);
    }
  }
  
  // Fallback: download the file
  if (fallbackDownload) {
    downloadFile(file);
    return true;
  }
  
  return false;
}

/**
 * Download a file (create a temporary link and click it)
 */
function downloadFile(file: File): void {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.style.display = "none";
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Clean up the URL after a delay
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Convert a Blob to a File with a name
 */
export function blobToFile(blob: Blob, filename: string): File {
  return new File([blob], filename, {
    type: blob.type,
    lastModified: Date.now(),
  });
}
