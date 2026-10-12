/**
 * Utility formatters for Anchor Solution
 */

export function formatPrice(amount, currency = 'ETB') {
  if (amount === 0 || amount === '0') return 'Free';
  const num = Number(amount);
  return `${num.toLocaleString()} ${currency}`;
}

export function formatDuration(weeks, hours) {
  return `${weeks} weeks (${hours} hrs)`;
}

export function formatVideoTime(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
