/**
 * Converts a month abbreviation (e.g., "Jan") to its numerical index (0-11).
 * @param {string} month - The three-letter abbreviation of the month (e.g., "Jan", "Feb").
 * @returns {number} The numerical index of the month (0-based), or -1 if invalid.
 */

export const getMonthIndex = (month) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.indexOf(month);
  };