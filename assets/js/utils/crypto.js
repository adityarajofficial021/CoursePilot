/* Cryptographic & Password Security Utilities */

export const CryptoUtils = {
  /**
   * Generates a cryptographically secure random salt hex string
   */
  generateSalt(length = 16) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Hashes a plain-text password with a salt using Web Crypto SHA-256
   */
  async hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Evaluates password strength and returns score, label, and color
   */
  checkPasswordStrength(password) {
    if (!password) return { score: 0, label: 'Empty', color: 'var(--text-muted)' };
    if (password.length < 8) return { score: 1, label: 'Too Short (Min 8 chars)', color: 'var(--danger)' };

    let score = 1;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score === 1 || score === 2) return { score: 2, label: 'Weak', color: 'var(--danger)' };
    if (score === 3) return { score: 3, label: 'Medium', color: 'var(--warning)' };
    return { score: 4, label: 'Strong', color: 'var(--success)' };
  },

  /**
   * Basic XSS sanitization helper
   */
  sanitize(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>"']/g, (m) => {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#039;';
        default: return m;
      }
    });
  }
};
