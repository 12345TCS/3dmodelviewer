/**
 * Converts raw error messages from Three.js / fetch into structured,
 * user-friendly error objects.
 * Add new patterns here as new error types are encountered.
 */
export function parseModelError(rawMessage = '') {
  const msg = rawMessage.toLowerCase();

  if (
    msg.includes('failed to fetch') ||
    msg.includes('networkerror') ||
    msg.includes('cors') ||
    msg.includes('cross-origin') ||
    msg.includes('load failed')
  ) {
    return {
      type: 'cors',
      icon: '🚫',
      title: 'CORS / Network Error',
      detail:
        'The browser blocked this request because the server did not allow cross-origin access. ' +
        'This is the most common reason a model from an external host fails to load.',
      fix: 'The server hosting the file must return this HTTP header:\n  Access-Control-Allow-Origin: *',
      tips: [
        'In DigitalOcean Spaces: Settings → CORS → add your domain (or * for public)',
        'In AWS S3: Bucket → Permissions → CORS configuration',
        'Use GitHub raw URLs (raw.githubusercontent.com) – CORS is enabled there',
        'Test your URL in this tab first — if it downloads, CORS is the issue',
      ],
    };
  }

  if (msg.includes('404') || msg.includes('not found')) {
    return {
      type: 'notfound',
      icon: '🔍',
      title: 'File Not Found (404)',
      detail: 'The server is reachable but no file exists at this URL.',
      fix: 'Double-check the full URL and confirm the file has been uploaded.',
      tips: [
        'Check for typos in the path or filename',
        'Confirm the file extension is correct (.glb / .gltf / .obj)',
        'Make sure the file is in the expected folder on your server',
      ],
    };
  }

  if (msg.includes('403') || msg.includes('forbidden') || msg.includes('access denied')) {
    return {
      type: 'forbidden',
      icon: '🔒',
      title: 'Access Denied (403)',
      detail: 'The server rejected the request — the file is likely private.',
      fix: 'Set the file or bucket to public read access.',
      tips: [
        'In DigitalOcean Spaces: right-click file → Make Public',
        'In AWS S3: disable Block Public Access, then set the object ACL to public-read',
      ],
    };
  }

  if (
    msg.includes('unexpected token') ||
    msg.includes('json') ||
    msg.includes('parse error') ||
    msg.includes('invalid typed array')
  ) {
    return {
      type: 'parse',
      icon: '📄',
      title: 'Invalid or Corrupt File',
      detail: 'The URL was reachable but the file could not be parsed as a 3D model.',
      fix: 'Make sure the file is a valid, complete GLB/GLTF file.',
      tips: [
        'Re-export the model from Blender / Maya / Cinema 4D',
        'Open the file locally in another viewer to verify it works',
        'Ensure the upload was not interrupted (partial file)',
      ],
    };
  }

  return {
    type: 'unknown',
    icon: '⚠️',
    title: 'Could Not Load Model',
    detail: rawMessage || 'An unexpected error occurred while loading the model.',
    fix: 'Check the URL is correct and the server is reachable.',
    tips: [
      'Try one of the sample models to confirm the viewer works',
      'Open the URL directly in a browser tab to see what the server returns',
    ],
  };
}

/**
 * Probes a URL before passing it to Three.js.
 * Returns { ok: true } on success, { ok: false, error: ParsedError } otherwise.
 *
 * Uses HEAD first, falls back gracefully if HEAD is not allowed (405).
 */
export async function preCheckUrl(url) {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      mode: 'cors',
      cache: 'no-store',
    });

    // 405 = HEAD not supported by the server → fall through to load attempt
    if (res.status === 405) return { ok: true };

    if (!res.ok) {
      const raw = `${res.status} ${res.statusText}`;
      return { ok: false, error: parseModelError(raw) };
    }

    return { ok: true };
  } catch (err) {
    // TypeError: Failed to fetch → CORS or offline
    return { ok: false, error: parseModelError(err?.message || 'Failed to fetch') };
  }
}
