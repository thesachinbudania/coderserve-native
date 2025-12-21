export function formatDateTime(isoString: string) {
  const date = new Date(isoString);

  // Format the date (e.g., 20 Jan 2025)
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Format the time (e.g., 10:30 am)
  const formattedTime = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return `${formattedDate}, ${formattedTime}`;
}
export function formatDateShort(isoString: string) {
  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return `${formattedDate}`;
}

export function formatMonthYear(isoString: string) {
  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric'
  });

  return `${formattedDate}`;
}

export function formatDate(isoString: string) {
  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return `${formattedDate}`;
}

export function formatTime(isoString: string) {
  const date = new Date(isoString);

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase(); // makes 'AM/PM' lowercase if you prefer
}
