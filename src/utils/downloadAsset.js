function filenameFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const filename = decodeURIComponent(pathname.split('/').filter(Boolean).pop() || 'asset');
    return filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
  } catch {
    return 'asset';
  }
}

function filenameFromDisposition(disposition) {
  if (!disposition) return null;
  const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (encoded) {
    try { return decodeURIComponent(encoded); } catch { return encoded; }
  }
  return disposition.match(/filename="?([^";]+)"?/i)?.[1] ?? null;
}

function clickDownload(href, filename, newTab = false) {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  if (newTab) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function downloadAsset(url) {
  const fallbackFilename = filenameFromUrl(url);
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`Download failed (${response.status})`);

    const blob = await response.blob();
    const filename = filenameFromDisposition(response.headers.get('content-disposition'))
      || fallbackFilename;
    const objectUrl = URL.createObjectURL(blob);
    clickDownload(objectUrl, filename);
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    return { downloaded: true };
  } catch (error) {
    // Navigation can still work when a cross-origin host blocks JavaScript fetches.
    clickDownload(url, fallbackFilename, true);
    return { downloaded: false, error };
  }
}
