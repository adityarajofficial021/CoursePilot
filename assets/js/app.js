/* Application Main Entry Point & Router */

import { StorageService } from './services/storage.js';
import { Modal } from './utils/modal.js';
import { SidebarComponent } from './components/sidebar.js';
import { HeaderComponent } from './components/header.js';
import { NotificationsComponent } from './components/notifications.js';

import { AuthModule } from './modules/auth.js';
import { DashboardModule } from './modules/dashboard.js';
import { CoursesModule } from './modules/courses.js';
import { GradesModule } from './modules/grades.js';
import { AttendanceModule } from './modules/attendance.js';
import { AssignmentsModule } from './modules/assignments.js';
import { CertificatesModule } from './modules/certificates.js';
import { ProfileModule } from './modules/profile.js';
import { SettingsModule } from './modules/settings.js';
import { SearchModule } from './modules/search.js';

class App {
  constructor() {
    this.currentView = 'dashboard';
  }

  init() {
    // 1. Initialize Storage
    StorageService.init();

    // 2. Bind Reusable Modal System
    Modal.bindEvents();

    // 3. Initialize Settings (Theme & Accent restore)
    SettingsModule.init();

    // 4. Initialize Auth Module
    AuthModule.init((user) => {
      this.onAuthenticated(user);
    });
  }

  onAuthenticated(user) {
    // Set Active User ID for Per-Student Data Isolation
    if (user && user.id) {
      StorageService.setActiveUserId(user.id);
    }

    // Initialize Navigation & UI Shell Components
    SidebarComponent.init();
    HeaderComponent.init(user);
    NotificationsComponent.init();

    if (!this.isBound) {
      this.isBound = true;

      // Bind Navigation Link Clicks using Event Delegation
      document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-view]');
        if (link) {
          const viewId = link.getAttribute('data-view');
          if (viewId) {
            e.preventDefault();
            this.navigateTo(viewId);
          }
        }
      });

      // Initialize Page Sub-Modules
      CoursesModule.init();
      GradesModule.init();
      AttendanceModule.init();
      AssignmentsModule.init();
      ProfileModule.init();
      SearchModule.init((targetView) => this.navigateTo(targetView));
    }

    // Render Initial Active View (Dashboard)
    this.navigateTo(this.currentView);
  }

  navigateTo(viewId) {
    // Protected Route Enforcement Guard
    if (!StorageService.isLoggedIn()) {
      AuthModule.showLoginScreen();
      return;
    }

    const targetSection = document.getElementById(`view-${viewId}`);
    if (!targetSection) return;

    // Close any open popover dropdowns
    document.querySelectorAll('.popover-dropdown.active').forEach(p => p.classList.remove('active'));

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('hidden'));

    // Show target section
    targetSection.classList.remove('hidden');
    targetSection.classList.add('animate-fade-in');

    // Update active nav link highlight
    SidebarComponent.setActiveView(viewId);
    this.currentView = viewId;

    // Render View Controller Content
    switch (viewId) {
      case 'dashboard':
        DashboardModule.render();
        break;
      case 'courses':
        CoursesModule.render();
        break;
      case 'grades':
        GradesModule.render();
        break;
      case 'attendance':
        AttendanceModule.render();
        break;
      case 'assignments':
        AssignmentsModule.render();
        break;
      case 'certificates':
        CertificatesModule.render();
        break;
      case 'profile':
        ProfileModule.render();
        break;
      case 'settings':
        SettingsModule.render();
        break;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Bootstrap Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
