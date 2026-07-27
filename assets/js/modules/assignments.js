/* Assignments View Controller Module */

import { StorageService } from '../services/storage.js';
import { Toast } from '../utils/toast.js';
import { Modal } from '../utils/modal.js';

export const AssignmentsModule = {
  currentTab: 'all',

  init() {
    const searchInput = document.getElementById('assignments-search-input');
    const prioritySelect = document.getElementById('assignments-priority-filter');
    const addBtn = document.getElementById('add-assignment-btn');
    const addForm = document.getElementById('add-assignment-form');
    const tabBtns = document.querySelectorAll('.assignment-tab-btn');

    if (searchInput) searchInput.addEventListener('input', () => this.render());
    if (prioritySelect) prioritySelect.addEventListener('change', () => this.render());

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('btn-primary', 'active'));
        tabBtns.forEach(b => b.classList.add('btn-secondary'));
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary', 'active');
        this.currentTab = btn.getAttribute('data-tab');
        this.render();
      });
    });

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        Modal.open('add-assignment-modal');
      });
    }

    if (addForm) {
      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('new-assign-title').value.trim();
        const course = document.getElementById('new-assign-course').value;
        const deadline = document.getElementById('new-assign-deadline').value;
        const priority = document.getElementById('new-assign-priority').value;
        const description = document.getElementById('new-assign-desc').value.trim();

        if (!title || !deadline) {
          Toast.error('Please enter a title and deadline');
          return;
        }

        const state = StorageService.getState();
        const newAssignment = {
          id: `ASN-${Date.now()}`,
          title,
          course,
          deadline,
          priority,
          status: 'Pending',
          description
        };

        state.assignments.unshift(newAssignment);
        StorageService.saveState(state);
        Toast.success('New assignment added!');
        Modal.close('add-assignment-modal');
        addForm.reset();
        this.render();
      });
    }
  },

  render() {
    const state = StorageService.getState();
    let assignments = state.assignments || [];

    const searchVal = document.getElementById('assignments-search-input')?.value.toLowerCase().trim() || '';
    const priorityVal = document.getElementById('assignments-priority-filter')?.value || 'all';

    // Filter
    if (searchVal) {
      assignments = assignments.filter(a => a.title.toLowerCase().includes(searchVal) || a.course.toLowerCase().includes(searchVal));
    }

    if (priorityVal !== 'all') {
      assignments = assignments.filter(a => a.priority.toLowerCase() === priorityVal.toLowerCase());
    }

    if (this.currentTab !== 'all') {
      assignments = assignments.filter(a => a.status.toLowerCase() === this.currentTab.toLowerCase());
    }

    const container = document.getElementById('assignments-list-container');
    if (!container) return;

    if (assignments.length === 0) {
      container.innerHTML = `
        <div style="padding: 3rem; text-align: center; color: var(--text-muted);">
          <i class="fa-solid fa-list-check" style="font-size: 3rem; margin-bottom: 1rem;"></i>
          <h3>No assignments found</h3>
          <p>You have no matching tasks in this category.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = assignments.map(a => {
      let priorityClass = 'badge-primary';
      if (a.priority === 'High') priorityClass = 'badge-danger';
      if (a.priority === 'Medium') priorityClass = 'badge-warning';

      let statusClass = 'badge-warning';
      if (a.status === 'Submitted') statusClass = 'badge-primary';
      if (a.status === 'Graded') statusClass = 'badge-success';

      return `
        <div class="card flex flex-col justify-between gap-3" style="padding: 1.25rem;">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="flex items-center gap-2" style="margin-bottom: 0.35rem;">
                <span class="badge ${priorityClass}">${a.priority} Priority</span>
                <span class="badge ${statusClass}">${a.status}</span>
              </div>
              <h3 style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary);">${a.title}</h3>
              <p class="text-xs text-secondary" style="margin-top: 0.25rem;">
                <i class="fa-solid fa-book"></i> ${a.course}
              </p>
            </div>
            <div class="text-xs font-semibold text-muted" style="white-space: nowrap;">
              <i class="fa-regular fa-calendar"></i> Due: ${a.deadline}
            </div>
          </div>

          <p class="text-xs text-secondary" style="line-height: 1.5;">${a.description || 'No additional instructions provided.'}</p>

          <div class="flex items-center justify-between" style="border-top: 1px solid var(--border-color); padding-top: 0.75rem; margin-top: 0.5rem;">
            <div>
              ${a.status === 'Pending' ? `
                <button class="btn btn-primary btn-sm submit-assign-btn" data-id="${a.id}">
                  <i class="fa-solid fa-check"></i> Mark Submitted
                </button>
              ` : `
                <span class="text-xs text-success font-semibold"><i class="fa-solid fa-circle-check"></i> Submitted</span>
              `}
            </div>
            <div class="flex items-center gap-2">
              <button class="btn-icon delete-assign-btn" data-id="${a.id}" title="Delete Assignment">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    this.bindEvents(container);
  },

  bindEvents(container) {
    container.querySelectorAll('.submit-assign-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const state = StorageService.getState();
        const assign = state.assignments.find(a => a.id === id);
        if (assign) {
          assign.status = 'Submitted';
          StorageService.saveState(state);
          Toast.success(`'${assign.title}' submitted!`);
          this.render();
        }
      });
    });

    container.querySelectorAll('.delete-assign-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this assignment?')) {
          const state = StorageService.getState();
          state.assignments = state.assignments.filter(a => a.id !== id);
          StorageService.saveState(state);
          Toast.info('Assignment deleted');
          this.render();
        }
      });
    });
  }
};
