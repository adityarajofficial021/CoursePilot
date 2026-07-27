/* LocalStorage Multi-User Data Manager & Data Isolation Engine */

import { INITIAL_MOCK_DATA } from '../data/mockData.js';

const STORAGE_KEYS = {
  AUTH: 'student_saas_auth',
  USERS: 'student_saas_users',
  DATA_PREFIX: 'student_saas_data_',
  THEME: 'student_saas_theme',
  ACCENT: 'student_saas_accent'
};

export const StorageService = {
  activeUserId: null,

  /**
   * Initializes users table and default account seed
   */
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    }
  },

  /**
   * Gets list of registered user accounts
   */
  getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Saves updated users table
   */
  saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  /**
   * Finds a user account by email address
   */
  findUserByEmail(email) {
    if (!email) return null;
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  },

  /**
   * Registers a new user account entry
   */
  addUserAccount(account) {
    const users = this.getUsers();
    users.push(account);
    this.saveUsers(users);

    // Initialize clean student dataset for new user
    const newUserDataset = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
    newUserDataset.student.id = account.id;
    newUserDataset.student.name = account.name;
    newUserDataset.student.email = account.email;
    newUserDataset.student.phone = account.mobile || '';
    newUserDataset.assignments = [];
    newUserDataset.certificates = [];
    newUserDataset.activityFeed = [{
      id: "ACT-WELCOME",
      title: "Account Created",
      description: "Successfully registered CoursePilot account.",
      timestamp: "Just now",
      icon: "fa-user-check",
      iconColor: "var(--success)"
    }];

    this.saveUserData(account.id, newUserDataset);
  },

  /**
   * Sets the current active logged-in user ID
   */
  setActiveUserId(userId) {
    this.activeUserId = userId;
  },

  /**
   * Retrieves isolated student dataset for active user
   */
  getState() {
    const auth = this.getAuth();
    const userId = this.activeUserId || (auth && auth.user ? auth.user.id : 'STU-DEFAULT');

    try {
      const key = STORAGE_KEYS.DATA_PREFIX + userId;
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      } else {
        // Fallback: Clone initial mock dataset for user
        const defaultData = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
        if (auth && auth.user) {
          defaultData.student.id = auth.user.id;
          defaultData.student.name = auth.user.name;
          defaultData.student.email = auth.user.email;
        }
        this.saveUserData(userId, defaultData);
        return defaultData;
      }
    } catch (e) {
      return INITIAL_MOCK_DATA;
    }
  },

  /**
   * Saves updated state for active user
   */
  saveState(state) {
    const auth = this.getAuth();
    const userId = this.activeUserId || (auth && auth.user ? auth.user.id : 'STU-DEFAULT');
    this.saveUserData(userId, state);
  },

  /**
   * Saves user-specific data sandbox
   */
  saveUserData(userId, data) {
    try {
      const key = STORAGE_KEYS.DATA_PREFIX + userId;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to write user isolated data:', e);
    }
  },

  /**
   * Reset data for active user
   */
  resetState() {
    const auth = this.getAuth();
    const userId = this.activeUserId || (auth && auth.user ? auth.user.id : 'STU-DEFAULT');
    const freshData = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
    if (auth && auth.user) {
      freshData.student.id = auth.user.id;
      freshData.student.name = auth.user.name;
      freshData.student.email = auth.user.email;
    }
    this.saveUserData(userId, freshData);
    return freshData;
  },

  /**
   * Authentication State Helpers
   */
  getAuth() {
    try {
      const local = localStorage.getItem(STORAGE_KEYS.AUTH);
      const session = sessionStorage.getItem(STORAGE_KEYS.AUTH);
      return local ? JSON.parse(local) : (session ? JSON.parse(session) : null);
    } catch (e) {
      return null;
    }
  },

  setAuth(user, remember = true) {
    const authData = {
      isLoggedIn: true,
      user,
      loginTimestamp: new Date().toISOString()
    };
    this.setActiveUserId(user.id);
    if (remember) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
    } else {
      sessionStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
    }
  },

  clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    this.activeUserId = null;
  },

  isLoggedIn() {
    const auth = this.getAuth();
    return !!(auth && auth.isLoggedIn);
  }
};
