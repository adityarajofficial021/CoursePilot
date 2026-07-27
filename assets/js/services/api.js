/* API Service Layer - Authentication, Registration, Cryptographic Verification, Rate Limiting */

import { StorageService } from './storage.js';
import { Helpers } from '../utils/helpers.js';
import { CryptoUtils } from '../utils/crypto.js';

// Rate Limiting State Tracker (Max 5 attempts, 30s lockout)
const failedAttempts = {};
const lockoutTimers = {};

export const ApiService = {
  /**
   * Mock network request wrapper
   */
  async request(endpoint, options = {}) {
    const delay = options.delay !== undefined ? options.delay : 150;
    await new Promise((resolve) => setTimeout(resolve, delay));
    const state = StorageService.getState();

    switch (endpoint) {
      case '/api/student': return { ok: true, data: state.student };
      case '/api/courses': return { ok: true, data: state.courses };
      case '/api/grades': return { ok: true, data: state.grades };
      case '/api/attendance': return { ok: true, data: state.attendance };
      case '/api/assignments': return { ok: true, data: state.assignments };
      case '/api/certificates': return { ok: true, data: state.certificates };
      case '/api/notifications': return { ok: true, data: state.notifications };
      case '/api/activity': return { ok: true, data: state.activityFeed };
      default: return { ok: false, error: 'Endpoint not found', status: 404 };
    }
  },

  /**
   * Registers a new student account with cryptographic password hashing
   */
  async register({ name, email, mobile, password }) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Validations
    if (!name || !email || !password) {
      return { ok: false, error: 'Please fill in all required fields' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { ok: false, error: 'Please enter a valid email address' };
    }

    if (password.length < 8) {
      return { ok: false, error: 'Password must be at least 8 characters long' };
    }

    // Check unique email
    const existingUser = StorageService.findUserByEmail(email);
    if (existingUser) {
      return { ok: false, error: 'An account with this email already exists' };
    }

    // Generate Salt & Hash Password using Web Crypto API
    const salt = CryptoUtils.generateSalt();
    const passwordHash = await CryptoUtils.hashPassword(password, salt);
    const userId = `STU-${Date.now()}`;

    const newUser = {
      id: userId,
      name: CryptoUtils.sanitize(name),
      email: email.toLowerCase().trim(),
      mobile: CryptoUtils.sanitize(mobile || ''),
      passwordHash,
      salt,
      createdAt: new Date().toISOString()
    };

    StorageService.addUserAccount(newUser);

    return {
      ok: true,
      message: 'Account created successfully. Please log in.',
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    };
  },

  /**
   * Authenticates user credentials with rate limiting and hash verification
   */
  async login(email, password) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!email || !password) {
      return { ok: false, error: 'Email and password are required' };
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check Rate Limiting Lockout
    if (lockoutTimers[cleanEmail] && Date.now() < lockoutTimers[cleanEmail]) {
      const remainingSecs = Math.ceil((lockoutTimers[cleanEmail] - Date.now()) / 1000);
      return {
        ok: false,
        error: `Too many failed attempts. Account locked for ${remainingSecs}s.`
      };
    }

    let user = StorageService.findUserByEmail(cleanEmail);

    // Auto-create demo user account if adityaraj@gmail.com logs in for the first time
    if (!user && (cleanEmail === 'adityaraj@gmail.com' || cleanEmail === 'alex.morgan@university.edu')) {
      const salt = CryptoUtils.generateSalt();
      const passwordHash = await CryptoUtils.hashPassword('password123', salt);
      user = {
        id: 'STU-2026-8892',
        name: 'Aditya Raj',
        email: cleanEmail,
        passwordHash,
        salt,
        createdAt: new Date().toISOString()
      };
      StorageService.addUserAccount(user);
    }

    if (!user) {
      this.recordFailedAttempt(cleanEmail);
      return { ok: false, error: 'Invalid email or password.' };
    }

    // Verify Password Hash
    const computedHash = await CryptoUtils.hashPassword(password, user.salt);
    if (computedHash !== user.passwordHash) {
      this.recordFailedAttempt(cleanEmail);
      return { ok: false, error: 'Invalid email or password.' };
    }

    // Clear failed attempts on successful login
    delete failedAttempts[cleanEmail];
    delete lockoutTimers[cleanEmail];

    return {
      ok: true,
      token: `jwt-token-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
      }
    };
  },

  recordFailedAttempt(email) {
    failedAttempts[email] = (failedAttempts[email] || 0) + 1;
    if (failedAttempts[email] >= 5) {
      lockoutTimers[email] = Date.now() + 30000; // 30-second lockout
    }
  },

  /**
   * Password Reset Flow
   */
  async requestPasswordReset(email) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const user = StorageService.findUserByEmail(email);
    if (!user) {
      return { ok: false, error: 'No account found with this email address' };
    }
    return {
      ok: true,
      resetToken: `reset-token-${user.id}-${Date.now()}`,
      message: 'Password reset token generated'
    };
  },

  async resetPassword(email, newPassword) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (!newPassword || newPassword.length < 8) {
      return { ok: false, error: 'Password must be at least 8 characters long' };
    }
    const users = StorageService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      return { ok: false, error: 'Account not found' };
    }

    const salt = CryptoUtils.generateSalt();
    user.salt = salt;
    user.passwordHash = await CryptoUtils.hashPassword(newPassword, salt);
    StorageService.saveUsers(users);

    return { ok: true, message: 'Password reset successfully! Please log in.' };
  }
};
