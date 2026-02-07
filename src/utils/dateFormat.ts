/**
 * Convert UTC datetime string to Indian Standard Time (IST)
 * IST is UTC+5:30
 * @param utcDateString - ISO datetime string from database (e.g., "2026-02-07 14:30:45")
 * @returns Formatted IST datetime string
 */
export const convertToIST = (utcDateString: string | null | undefined): string => {
  if (!utcDateString) return '';

  try {
    // Parse the UTC datetime (format: "YYYY-MM-DD HH:MM:SS")
    const utcDate = new Date(utcDateString + 'Z'); // Add Z to ensure it's treated as UTC

    // Convert to IST (UTC+5:30)
    const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);

    // Format as readable string
    return istDate.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata' // Explicit IST timezone for reliability
    });
  } catch (err) {
    console.error('Error converting date to IST:', err);
    return utcDateString;
  }
};

/**
 * Format a date as "Jan 7, 2026 at 8:00 PM IST"
 * @param utcDateString - ISO datetime string from database
 * @returns Formatted string with IST label
 */
export const formatDateWithIST = (utcDateString: string | null | undefined): string => {
  const formatted = convertToIST(utcDateString);
  return formatted ? `${formatted} IST` : '';
};
