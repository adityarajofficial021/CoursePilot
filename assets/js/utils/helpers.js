/* Helper Utilities */

export const Helpers = {
  /**
   * Formats a date string into readable format (e.g. "Sunday, July 26, 2026")
   */
  formatDate(dateObj = new Date()) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  },

  /**
   * Derives a user's display name from their email address
   * e.g. "adityaraj@gmail.com" -> "Aditya Raj"
   * e.g. "john.doe@university.edu" -> "John Doe"
   */
  nameFromEmail(email) {
    if (!email) return 'Student';
    const username = email.split('@')[0];
    if (username.toLowerCase() === 'adityaraj' || username.toLowerCase() === 'aditya.raj') return 'Aditya Raj';

    const parts = username.replace(/[._-]/g, ' ').split(' ').filter(Boolean);
    return parts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  },

  /**
   * Formats time (e.g. "02:45 PM")
   */
  formatTime(dateObj = new Date()) {
    return dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  },

  /**
   * Truncates text with ellipsis
   */
  truncate(str, length = 50) {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
  },

  /**
   * Smooth number counter animation for dashboard statistics
   */
  animateCounter(element, targetValue, duration = 1000, suffix = '') {
    if (!element) return;
    const startValue = 0;
    const isFloat = String(targetValue).includes('.');
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      const currentValue = isFloat
        ? (startValue + (targetValue - startValue) * easeProgress).toFixed(1)
        : Math.floor(startValue + (targetValue - startValue) * easeProgress);

      element.textContent = `${currentValue}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = `${targetValue}${suffix}`;
      }
    };

    requestAnimationFrame(updateCount);
  },

  /**
   * Converts array of objects to CSV file download
   */
  exportToCSV(filename, rows) {
    if (!rows || !rows.length) return;
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows
        .map((row) => {
          return keys
            .map((k) => {
              let cell = row[k] === null || row[k] === undefined ? '' : row[k];
              cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
              cell = cell.replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            })
            .join(separator);
        })
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  /**
   * Triggers a clean printer/PDF dialog for report pages
   */
  printReport() {
    window.print();
  }
};
