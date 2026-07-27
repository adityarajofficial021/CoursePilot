/* Settings Controller Module */

import { StorageService } from '../services/storage.js';
import { Toast } from '../utils/toast.js';
import { AnalyticsCharts } from '../components/charts.js';

export const SettingsModule = {
  init() {
    const themeToggle = document.getElementById('settings-theme-toggle');
    const headerThemeBtn = document.getElementById('header-theme-toggle-btn');
    const accentBtns = document.querySelectorAll('.color-option-btn');
    const settingsForm = document.getElementById('settings-form');
    const resetDataBtn = document.getElementById('reset-demo-data-btn');

    // Restore Theme & Accent attributes on page load
    const savedTheme = localStorage.getItem('student_saas_theme') || 'light';
    const savedAccent = localStorage.getItem('student_saas_accent') || 'indigo';

    this.applyTheme(savedTheme);
    this.applyAccent(savedAccent);

    // Header Quick Theme Button
    if (headerThemeBtn) {
      headerThemeBtn.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('student_saas_theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        Toast.info(`Theme set to ${newTheme} mode`);
      });
    }

    // Settings Toggle Switch
    if (themeToggle) {
      themeToggle.checked = savedTheme === 'dark';
      themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        this.applyTheme(newTheme);
        Toast.info(`Theme set to ${newTheme} mode`);
      });
    }

    // Accent Color Chooser
    accentBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const accent = btn.getAttribute('data-accent');
        this.applyAccent(accent);
        accentBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Toast.info(`Accent color updated`);
      });
    });

    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const state = StorageService.getState();
        state.settings = {
          ...state.settings,
          autoLogoutMinutes: parseInt(document.getElementById('setting-auto-logout').value),
          emailNotifications: document.getElementById('setting-email-notif').checked,
          assignmentReminders: document.getElementById('setting-assign-remind').checked,
          lowAttendanceAlerts: document.getElementById('setting-att-alert').checked,
          privacyProfilePublic: document.getElementById('setting-privacy-public').checked
        };
        StorageService.saveState(state);
        Toast.success('Settings saved successfully!');
      });
    }

    // Reset Demo Data
    if (resetDataBtn) {
      resetDataBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all data back to original defaults?')) {
          StorageService.resetState();
          Toast.warning('Demo data reset! Reloading...');
          setTimeout(() => window.location.reload(), 600);
        }
      });
    }
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('student_saas_theme', theme);

    // Header Sun/Moon icon sync
    const themeIcon = document.getElementById('header-theme-icon');
    if (themeIcon) {
      themeIcon.className = `fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`;
    }

    // Settings checkbox sync
    const themeToggle = document.getElementById('settings-theme-toggle');
    if (themeToggle) {
      themeToggle.checked = (theme === 'dark');
    }

    // Re-render analytics charts to update dark/light grid and text colors
    const state = StorageService.getState();
    if (state && state.grades && state.attendance) {
      AnalyticsCharts.init(state.grades, state.attendance);
    }
  },

  applyAccent(accent) {
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem('student_saas_accent', accent);
  },

  render() {
    const state = StorageService.getState();
    const settings = state.settings || {};

    const autoLogoutSel = document.getElementById('setting-auto-logout');
    const emailNotifChk = document.getElementById('setting-email-notif');
    const assignRemindChk = document.getElementById('setting-assign-remind');
    const attAlertChk = document.getElementById('setting-att-alert');
    const privacyChk = document.getElementById('setting-privacy-public');

    if (autoLogoutSel) autoLogoutSel.value = settings.autoLogoutMinutes || 30;
    if (emailNotifChk) emailNotifChk.checked = !!settings.emailNotifications;
    if (assignRemindChk) assignRemindChk.checked = !!settings.assignmentReminders;
    if (attAlertChk) attAlertChk.checked = !!settings.lowAttendanceAlerts;
    if (privacyChk) privacyChk.checked = !!settings.privacyProfilePublic;

    // Highlight active accent button
    const currentAccent = localStorage.getItem('student_saas_accent') || 'indigo';
    document.querySelectorAll('.color-option-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-accent') === currentAccent);
    });
  }
};
