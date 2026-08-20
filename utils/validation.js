function isValidUrl(value) {
  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(trimmed);
  } catch {
    return false;
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return false;
  }

  if (!parsedUrl.hostname || parsedUrl.hostname.includes(' ')) {
    return false;
  }

  return true;
}

function isValidEmail(value) {
  if (typeof value !== "string") {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

module.exports = {
  isValidUrl,
  isValidEmail,
};
