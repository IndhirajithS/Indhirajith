/**
 * Utility functions for formatting dates and LocalDateTime DTO strings.
 */

/**
 * Format LocalDateTime string or timestamp into human-readable string.
 * e.g., "2026-08-19T08:38:54" -> "Aug 19, 2026 08:38 AM"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return String(dateStr);

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch (e) {
    return String(dateStr);
  }
};

/**
 * Returns a relative time string (e.g. "5 mins ago", "2 hours ago").
 */
export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return 'Just now';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Just now';

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return `${mins} min${mins > 1 ? 's' : ''} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    const days = Math.floor(diffInSeconds / 86400);
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return formatDate(dateStr);
  } catch {
    return 'Recently';
  }
};
