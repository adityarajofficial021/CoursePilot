/* Global Search Modal Controller */

import { StorageService } from '../services/storage.js';
import { Modal } from '../utils/modal.js';

export const SearchModule = {
  init(onNavigateToView) {
    const headerSearchTrigger = document.getElementById('header-search-trigger');
    const searchModal = document.getElementById('global-search-modal');
    const searchInput = document.getElementById('global-search-input');
    const resultsContainer = document.getElementById('global-search-results');

    // Trigger on Header Search Bar Click
    if (headerSearchTrigger) {
      headerSearchTrigger.addEventListener('click', () => {
        Modal.open('global-search-modal');
        setTimeout(() => searchInput?.focus(), 100);
      });
    }

    // Keyboard Shortcut (Cmd/Ctrl + K)
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        Modal.open('global-search-modal');
        setTimeout(() => searchInput?.focus(), 100);
      }
    });

    // Live Search Input Handler
    if (searchInput && resultsContainer) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
          resultsContainer.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
              Type to search across courses, assignments, grades, and certificates...
            </div>
          `;
          return;
        }

        const state = StorageService.getState();
        const courses = state.courses.filter(c => c.title.toLowerCase().includes(query) || c.category.toLowerCase().includes(query));
        const assignments = state.assignments.filter(a => a.title.toLowerCase().includes(query) || a.course.toLowerCase().includes(query));
        const grades = state.grades.filter(g => g.courseName.toLowerCase().includes(query));
        const certs = state.certificates.filter(c => c.title.toLowerCase().includes(query));

        let html = '';

        if (courses.length > 0) {
          html += `<div class="search-result-group-title">Courses (${courses.length})</div>`;
          courses.forEach(c => {
            html += `
              <div class="search-result-item" data-view="courses" data-id="${c.id}">
                <i class="fa-solid fa-graduation-cap text-primary-color"></i>
                <div style="flex: 1;">
                  <div style="font-weight: 600; font-size: 0.9rem;">${c.title}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${c.category} • ${c.progressPct}% Completed</div>
                </div>
              </div>
            `;
          });
        }

        if (assignments.length > 0) {
          html += `<div class="search-result-group-title">Assignments (${assignments.length})</div>`;
          assignments.forEach(a => {
            html += `
              <div class="search-result-item" data-view="assignments" data-id="${a.id}">
                <i class="fa-solid fa-file-signature text-warning"></i>
                <div style="flex: 1;">
                  <div style="font-weight: 600; font-size: 0.9rem;">${a.title}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${a.course} • Due: ${a.deadline}</div>
                </div>
              </div>
            `;
          });
        }

        if (grades.length > 0) {
          html += `<div class="search-result-group-title">Grades (${grades.length})</div>`;
          grades.forEach(g => {
            html += `
              <div class="search-result-item" data-view="grades" data-id="${g.id}">
                <i class="fa-solid fa-chart-simple text-success"></i>
                <div style="flex: 1;">
                  <div style="font-weight: 600; font-size: 0.9rem;">${g.courseName}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Grade: ${g.gradeBadge} (${g.overallPct}%)</div>
                </div>
              </div>
            `;
          });
        }

        if (certs.length > 0) {
          html += `<div class="search-result-group-title">Certificates (${certs.length})</div>`;
          certs.forEach(c => {
            html += `
              <div class="search-result-item" data-view="certificates" data-id="${c.id}">
                <i class="fa-solid fa-award text-warning"></i>
                <div style="flex: 1;">
                  <div style="font-weight: 600; font-size: 0.9rem;">${c.title}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Issued: ${c.issueDate}</div>
                </div>
              </div>
            `;
          });
        }

        if (!html) {
          html = `
            <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
              No matching records found for "${query}"
            </div>
          `;
        }

        resultsContainer.innerHTML = html;

        // Result Item Click Event
        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
          item.addEventListener('click', () => {
            const targetView = item.getAttribute('data-view');
            Modal.close('global-search-modal');
            if (onNavigateToView) onNavigateToView(targetView);
          });
        });
      });
    }
  }
};
