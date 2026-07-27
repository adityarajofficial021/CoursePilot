/* Sidebar Collapse, Mobile Drawer & Active Link Navigation */

export const SidebarComponent = {
  isBound: false,

  init() {
    if (!this.isBound) {
      this.isBound = true;

      const toggleBtn = document.getElementById('sidebar-toggle-btn');
      const mobileMenuBtn = document.getElementById('mobile-menu-btn');
      const mobileOverlay = document.getElementById('mobile-sidebar-overlay');

      // Sidebar Collapse Toggle (Desktop)
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          document.body.classList.toggle('sidebar-collapsed');
          const isCollapsed = document.body.classList.contains('sidebar-collapsed');
          localStorage.setItem('student_saas_sidebar_collapsed', isCollapsed ? 'true' : 'false');
        });
      }

      // Mobile Drawer Toggle
      if (mobileMenuBtn && mobileOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
          document.body.classList.toggle('mobile-sidebar-open');
        });

        mobileOverlay.addEventListener('click', () => {
          document.body.classList.remove('mobile-sidebar-open');
        });
      }
    }

    // Restore collapse preference
    if (localStorage.getItem('student_saas_sidebar_collapsed') === 'true') {
      document.body.classList.add('sidebar-collapsed');
    }
  },

  setActiveView(viewId) {
    const navItems = document.querySelectorAll('.nav-item[data-view]');
    navItems.forEach(item => {
      if (item.getAttribute('data-view') === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Close mobile drawer on link click
    document.body.classList.remove('mobile-sidebar-open');
  }
};
