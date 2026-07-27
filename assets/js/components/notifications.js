/* Notification Panel Renderer & Badge Manager */

import { StorageService } from '../services/storage.js';
import { Toast } from '../utils/toast.js';

export const NotificationsComponent = {
  isBound: false,

  init() {
    if (!this.isBound) {
      this.isBound = true;

      const markAllReadBtn = document.getElementById('mark-all-read-btn');
      const clearAllBtn = document.getElementById('clear-all-notifications-btn');

      if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const state = StorageService.getState();
          state.notifications.forEach(n => n.isUnread = false);
          StorageService.saveState(state);
          this.render();
          Toast.success('All notifications marked as read');
        });
      }

      if (clearAllBtn) {
        clearAllBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const state = StorageService.getState();
          state.notifications = [];
          StorageService.saveState(state);
          this.render();
          Toast.info('Notifications cleared');
        });
      }
    }

    this.render();
  },

  render() {
    const state = StorageService.getState();
    const notifications = state.notifications || [];
    const unreadCount = notifications.filter(n => n.isUnread).length;

    // Update Badge Count
    const badgeEl = document.getElementById('notification-badge');
    if (badgeEl) {
      if (unreadCount > 0) {
        badgeEl.textContent = unreadCount;
        badgeEl.classList.remove('hidden');
      } else {
        badgeEl.classList.add('hidden');
      }
    }

    // Render List Items
    const listEl = document.getElementById('notification-list-body');
    if (!listEl) return;

    if (notifications.length === 0) {
      listEl.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
          <i class="fa-solid fa-bell-slash" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
          <p>No notifications</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = notifications.map(item => {
      let icon = 'fa-bell';
      let iconBg = 'var(--primary-light)';
      let iconColor = 'var(--primary)';

      if (item.type === 'warning') {
        icon = 'fa-triangle-exclamation';
        iconBg = 'var(--warning-light)';
        iconColor = 'var(--warning)';
      } else if (item.type === 'achievement') {
        icon = 'fa-award';
        iconBg = 'var(--success-light)';
        iconColor = 'var(--success)';
      } else if (item.type === 'reminder') {
        icon = 'fa-clock';
        iconBg = 'var(--primary-light)';
        iconColor = 'var(--primary)';
      }

      return `
        <div class="notification-item ${item.isUnread ? 'unread' : ''}" data-id="${item.id}">
          <div class="notification-icon" style="background: ${iconBg}; color: ${iconColor};">
            <i class="fa-solid ${icon}"></i>
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 0.85rem; margin-bottom: 0.15rem; color: var(--text-primary);">${item.title}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.25rem;">${item.message}</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">${item.timestamp}</div>
          </div>
          <button class="btn-icon delete-notif-btn" data-id="${item.id}" title="Delete" style="width: 24px; height: 24px; font-size: 0.75rem;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `;
    }).join('');

    // Attach click listeners to notification items for marking read or deleting
    listEl.querySelectorAll('.notification-item').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.delete-notif-btn')) {
          const id = e.target.closest('.delete-notif-btn').getAttribute('data-id');
          const newState = StorageService.getState();
          newState.notifications = newState.notifications.filter(n => n.id !== id);
          StorageService.saveState(newState);
          this.render();
          return;
        }

        const id = el.getAttribute('data-id');
        const newState = StorageService.getState();
        const target = newState.notifications.find(n => n.id === id);
        if (target) {
          target.isUnread = false;
          StorageService.saveState(newState);
          this.render();
        }
      });
    });
  }
};
