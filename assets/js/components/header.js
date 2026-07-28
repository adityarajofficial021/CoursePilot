/* Header Bar interactions & Real-time Date Ticker */

import { Helpers } from '../utils/helpers.js';

export const HeaderComponent = {
  isBound: false,
  clockInterval: null,

  init(user) {
    this.updateClock();
    if (!this.clockInterval) {
      this.clockInterval = setInterval(() => this.updateClock(), 1000);
    }

    if (!this.isBound) {
      this.isBound = true;
      this.bindEvents();
    }

    // Render User Header Pill Data
    if (user) {
      this.updateUserPill(user);
    }
  },

  bindEvents() {
    document.addEventListener('click', (e) => {
      const userBtn = e.target.closest('#header-user-btn');
      const bellBtn = e.target.closest('#notification-bell-btn');
      const userDropdown = document.getElementById('user-menu-dropdown');
      const notifDropdown = document.getElementById('notification-dropdown');

      if (userBtn) {
        e.stopPropagation();
        if (notifDropdown) notifDropdown.classList.remove('active');
        if (userDropdown) userDropdown.classList.toggle('active');
        return;
      }

      if (bellBtn) {
        e.stopPropagation();
        if (userDropdown) userDropdown.classList.remove('active');
        if (notifDropdown) notifDropdown.classList.toggle('active');
        return;
      }

      // Click outside -> Close active popover dropdowns
      if (userDropdown && !userDropdown.contains(e.target) && !e.target.closest('#header-user-btn')) {
        userDropdown.classList.remove('active');
      }
      if (notifDropdown && !notifDropdown.contains(e.target) && !e.target.closest('#notification-bell-btn')) {
        notifDropdown.classList.remove('active');
      }
    });
  },

  updateClock() {
    const clockEl = document.getElementById('header-date-ticker');
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = `${Helpers.formatDate(now)} • ${Helpers.formatTime(now)}`;
    }
  },

  updateUserPill(user) {
    const name = user.name || 'Aditya Raj';
    const initials = Helpers.getInitials(name);
    const initialsEls = document.querySelectorAll('.header-user-initials, .profile-user-initials');
    const nameEls = document.querySelectorAll('.header-user-name');
    const emailEls = document.querySelectorAll('.header-user-email');

    initialsEls.forEach(el => { el.textContent = initials; });
    nameEls.forEach(el => { el.textContent = name; });
    emailEls.forEach(el => { el.textContent = user.email || 'adityaraj@gmail.com'; });
  }
};
