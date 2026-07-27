/* Courses View Controller Module */

import { StorageService } from '../services/storage.js';
import { Toast } from '../utils/toast.js';
import { Modal } from '../utils/modal.js';

export const CoursesModule = {
  currentViewMode: 'grid', // 'grid' or 'list'
  showFavouritesOnly: false,

  init() {
    const searchInput = document.getElementById('courses-search-input');
    const categorySelect = document.getElementById('courses-category-filter');
    const statusSelect = document.getElementById('courses-status-filter');
    const sortSelect = document.getElementById('courses-sort-filter');
    const gridViewBtn = document.getElementById('courses-grid-view-btn');
    const listViewBtn = document.getElementById('courses-list-view-btn');
    const favOnlyBtn = document.getElementById('courses-fav-only-btn');

    if (searchInput) searchInput.addEventListener('input', () => this.render());
    if (categorySelect) categorySelect.addEventListener('change', () => this.render());
    if (statusSelect) statusSelect.addEventListener('change', () => this.render());
    if (sortSelect) sortSelect.addEventListener('change', () => this.render());

    if (gridViewBtn && listViewBtn) {
      gridViewBtn.addEventListener('click', () => {
        this.currentViewMode = 'grid';
        gridViewBtn.classList.add('btn-primary');
        gridViewBtn.classList.remove('btn-secondary');
        listViewBtn.classList.add('btn-secondary');
        listViewBtn.classList.remove('btn-primary');
        this.render();
      });

      listViewBtn.addEventListener('click', () => {
        this.currentViewMode = 'list';
        listViewBtn.classList.add('btn-primary');
        listViewBtn.classList.remove('btn-secondary');
        gridViewBtn.classList.add('btn-secondary');
        gridViewBtn.classList.remove('btn-primary');
        this.render();
      });
    }

    if (favOnlyBtn) {
      favOnlyBtn.addEventListener('click', () => {
        this.showFavouritesOnly = !this.showFavouritesOnly;
        favOnlyBtn.classList.toggle('active', this.showFavouritesOnly);
        if (this.showFavouritesOnly) {
          favOnlyBtn.classList.add('btn-primary');
          favOnlyBtn.classList.remove('btn-secondary');
        } else {
          favOnlyBtn.classList.add('btn-secondary');
          favOnlyBtn.classList.remove('btn-primary');
        }
        this.render();
      });
    }
  },

  render() {
    const state = StorageService.getState();
    let courses = state.courses || [];

    const searchVal = document.getElementById('courses-search-input')?.value.toLowerCase().trim() || '';
    const catVal = document.getElementById('courses-category-filter')?.value || 'all';
    const statusVal = document.getElementById('courses-status-filter')?.value || 'all';
    const sortVal = document.getElementById('courses-sort-filter')?.value || 'progress-desc';

    // 1. Filter
    if (searchVal) {
      courses = courses.filter(c => c.title.toLowerCase().includes(searchVal) || c.instructor.toLowerCase().includes(searchVal));
    }

    if (catVal !== 'all') {
      courses = courses.filter(c => c.category.toLowerCase() === catVal.toLowerCase());
    }

    if (statusVal !== 'all') {
      courses = courses.filter(c => c.status.toLowerCase().replace(' ', '-') === statusVal.toLowerCase());
    }

    if (this.showFavouritesOnly) {
      courses = courses.filter(c => c.isFavourite);
    }

    // 2. Sort
    if (sortVal === 'progress-desc') {
      courses.sort((a, b) => b.progressPct - a.progressPct);
    } else if (sortVal === 'progress-asc') {
      courses.sort((a, b) => a.progressPct - b.progressPct);
    } else if (sortVal === 'title-asc') {
      courses.sort((a, b) => a.title.localeCompare(b.title));
    }

    // 3. Render Output
    const container = document.getElementById('courses-display-container');
    if (!container) return;

    if (courses.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 3rem; text-align: center; color: var(--text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem;"></i>
          <h3>No courses found</h3>
          <p>Try adjusting your search query or filters.</p>
        </div>
      `;
      return;
    }

    if (this.currentViewMode === 'grid') {
      container.className = 'course-card-grid';
      container.innerHTML = courses.map(c => this.createGridCardHTML(c)).join('');
    } else {
      container.className = 'flex flex-col gap-4';
      container.innerHTML = courses.map(c => this.createListRowHTML(c)).join('');
    }

    this.bindCardEvents(container);
  },

  createGridCardHTML(course) {
    let statusClass = 'badge-primary';
    if (course.status === 'Completed') statusClass = 'badge-success';
    if (course.status === 'Paused') statusClass = 'badge-warning';
    if (course.status === 'Not Started') statusClass = 'badge-secondary';

    return `
      <div class="card course-card">
        <div class="course-thumbnail-container">
          <img src="${course.thumbnail}" alt="${course.title}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600';">
          <button class="favourite-badge-btn ${course.isFavourite ? 'active' : ''}" data-id="${course.id}">
            <i class="fa-${course.isFavourite ? 'solid' : 'regular'} fa-star"></i>
          </button>
        </div>
        <div class="flex items-center justify-between" style="margin-bottom: 0.5rem;">
          <span class="badge badge-secondary">${course.category}</span>
          <span class="badge ${statusClass}">${course.status}</span>
        </div>
        <h3 class="card-title" style="font-size: 1.05rem; margin-bottom: 0.35rem; line-height: 1.3;">${course.title}</h3>
        <p class="text-xs text-secondary" style="margin-bottom: 1rem;">
          <i class="fa-solid fa-user-tie"></i> ${course.instructor} • <span class="text-muted">${course.difficulty}</span>
        </p>

        <div style="margin-top: auto;">
          <div class="flex justify-between text-xs text-secondary" style="margin-bottom: 0.35rem;">
            <span>Progress (${course.modulesCompleted}/${course.totalModules} modules)</span>
            <span class="font-bold text-primary-color">${course.progressPct}%</span>
          </div>
          <div class="progress-bar-bg" style="margin-bottom: 1.25rem;">
            <div class="progress-bar-fill" style="width: ${course.progressPct}%;"></div>
          </div>
          <div class="flex items-center justify-between">
            <button class="btn btn-primary btn-sm open-course-details-btn" data-id="${course.id}">
              <i class="fa-solid fa-book-open"></i> Course Details
            </button>
            <span class="text-xs text-muted">${course.estimatedCompletion}</span>
          </div>
        </div>
      </div>
    `;
  },

  createListRowHTML(course) {
    let statusClass = 'badge-primary';
    if (course.status === 'Completed') statusClass = 'badge-success';
    if (course.status === 'Paused') statusClass = 'badge-warning';
    if (course.status === 'Not Started') statusClass = 'badge-secondary';

    return `
      <div class="card flex items-center justify-between gap-4" style="padding: 1.25rem;">
        <img src="${course.thumbnail}" alt="${course.title}" style="width: 100px; height: 70px; border-radius: var(--radius-md); object-fit: cover; flex-shrink: 0;" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600';">
        <div style="flex: 1; min-width: 200px;">
          <div class="flex items-center gap-2" style="margin-bottom: 0.25rem;">
            <span class="badge ${statusClass}">${course.status}</span>
            <span class="badge badge-secondary">${course.category}</span>
          </div>
          <h3 style="font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">${course.title}</h3>
          <p class="text-xs text-muted"><i class="fa-solid fa-user-tie"></i> ${course.instructor} • ${course.difficulty}</p>
        </div>
        <div style="width: 180px;">
          <div class="flex justify-between text-xs" style="margin-bottom: 0.25rem;">
            <span>${course.modulesCompleted}/${course.totalModules} Modules</span>
            <span class="font-bold text-primary-color">${course.progressPct}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${course.progressPct}%;"></div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="favourite-badge-btn ${course.isFavourite ? 'active' : ''}" data-id="${course.id}" style="position: relative; top: 0; right: 0;">
            <i class="fa-${course.isFavourite ? 'solid' : 'regular'} fa-star"></i>
          </button>
          <button class="btn btn-primary btn-sm open-course-details-btn" data-id="${course.id}">
            <i class="fa-solid fa-book-open"></i> View Details
          </button>
        </div>
      </div>
    `;
  },

  bindCardEvents(container) {
    container.querySelectorAll('.favourite-badge-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const state = StorageService.getState();
        const course = state.courses.find(c => c.id === id);
        if (course) {
          course.isFavourite = !course.isFavourite;
          StorageService.saveState(state);
          Toast.success(`${course.title} ${course.isFavourite ? 'favorited' : 'unfavorited'}`);
          this.render();
        }
      });
    });

    container.querySelectorAll('.open-course-details-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openCourseDetailsModal(id);
      });
    });
  },

  openCourseDetailsModal(courseId) {
    const state = StorageService.getState();
    const course = state.courses.find(c => c.id === courseId);
    if (!course) return;

    const modalBody = `
      <div>
        <div class="flex items-center gap-4" style="margin-bottom: 1.25rem;">
          <img src="${course.thumbnail}" style="width: 110px; height: 80px; border-radius: var(--radius-md); object-fit: cover;" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600';">
          <div>
            <div class="flex items-center gap-2" style="margin-bottom: 0.35rem;">
              <span class="badge badge-primary">${course.category}</span>
              <span class="badge badge-secondary">${course.difficulty}</span>
            </div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">${course.title}</h3>
            <p class="text-xs text-secondary"><i class="fa-solid fa-user-tie"></i> ${course.instructor}</p>
          </div>
        </div>

        <p class="text-sm text-secondary" style="margin-bottom: 1.5rem; line-height: 1.6;">${course.description}</p>

        <h4 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 0.75rem;">Syllabus & Modules Checklist (${course.modulesCompleted}/${course.totalModules} Completed)</h4>

        <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 260px; overflow-y: auto; padding-right: 0.5rem; margin-bottom: 1.5rem;">
          ${course.modules.map(m => `
            <label class="flex items-center justify-between" style="padding: 0.65rem 0.85rem; background: var(--bg-tertiary); border-radius: var(--radius-md); cursor: pointer;">
              <div class="flex items-center gap-3">
                <input type="checkbox" class="module-check-input" data-course-id="${course.id}" data-module-id="${m.id}" ${m.completed ? 'checked' : ''} style="accent-color: var(--primary); width: 18px; height: 18px;">
                <span class="text-sm ${m.completed ? 'font-semibold' : ''}" style="${m.completed ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${m.title}</span>
              </div>
              ${m.completed ? '<i class="fa-solid fa-circle-check text-primary-color"></i>' : ''}
            </label>
          `).join('')}
        </div>

        <div class="flex items-center justify-between" style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
          <span class="text-xs text-muted"><i class="fa-solid fa-clock"></i> Target: ${course.estimatedCompletion}</span>
          <button class="btn btn-secondary" data-close-modal>Close</button>
        </div>
      </div>
    `;

    Modal.open('course-details-modal', {
      title: course.title,
      bodyHTML: modalBody
    });

    // Module checkbox toggle listener
    document.querySelectorAll('.module-check-input').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const cId = chk.getAttribute('data-course-id');
        const mId = parseInt(chk.getAttribute('data-module-id'));
        const currentState = StorageService.getState();
        const targetCourse = currentState.courses.find(c => c.id === cId);
        if (targetCourse) {
          const mod = targetCourse.modules.find(m => m.id === mId);
          if (mod) {
            mod.completed = chk.checked;
            // Recalculate completed count & percentage
            targetCourse.modulesCompleted = targetCourse.modules.filter(m => m.completed).length;
            targetCourse.progressPct = Math.round((targetCourse.modulesCompleted / targetCourse.totalModules) * 100);
            if (targetCourse.progressPct === 100) {
              targetCourse.status = 'Completed';
            } else if (targetCourse.progressPct > 0) {
              targetCourse.status = 'In Progress';
            } else {
              targetCourse.status = 'Not Started';
            }
            StorageService.saveState(currentState);
            Toast.success('Module progress updated');
            this.openCourseDetailsModal(cId); // Re-render modal view
            this.render(); // Re-render page
          }
        }
      });
    });
  }
};
