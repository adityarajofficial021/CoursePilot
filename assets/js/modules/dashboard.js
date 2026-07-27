/* Dashboard View Controller Module */

import { StorageService } from '../services/storage.js';
import { Helpers } from '../utils/helpers.js';
import { AnalyticsCharts } from '../components/charts.js';
import { Toast } from '../utils/toast.js';

export const DashboardModule = {
  render() {
    const state = StorageService.getState();
    const student = state.student;
    const stats = state.stats;
    const courses = state.courses || [];
    const assignments = state.assignments || [];
    const activityFeed = state.activityFeed || [];

    // 1. Welcome Greeting Banner
    const hour = new Date().getHours();
    let greeting = 'Good Morning';
    if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
    if (hour >= 17) greeting = 'Good Evening';

    const greetingEl = document.getElementById('welcome-greeting');
    if (greetingEl) {
      greetingEl.textContent = `${greeting}, ${student.name.split(' ')[0]}! 👋`;
    }

    const welcomeDateEl = document.getElementById('welcome-date-subtitle');
    if (welcomeDateEl) {
      welcomeDateEl.textContent = `Here's your learning progress overview for ${Helpers.formatDate()}`;
    }

    // 2. Animate Statistic Cards
    const pendingCount = assignments.filter(a => a.status === 'Pending').length;
    const completedCount = courses.filter(c => c.status === 'Completed').length;

    Helpers.animateCounter(document.getElementById('stat-enrolled-courses'), courses.length);
    Helpers.animateCounter(document.getElementById('stat-completed-courses'), completedCount);
    Helpers.animateCounter(document.getElementById('stat-pending-assignments'), pendingCount);
    Helpers.animateCounter(document.getElementById('stat-attendance-pct'), state.attendance.overallPct, 1000, '%');
    Helpers.animateCounter(document.getElementById('stat-cgpa'), state.stats.cgpa || 3.88);
    Helpers.animateCounter(document.getElementById('stat-certificates'), state.certificates.length);

    // 3. Overall Circular Progress Indicator
    const totalModules = courses.reduce((acc, c) => acc + c.totalModules, 0);
    const completedModules = courses.reduce((acc, c) => acc + c.modulesCompleted, 0);
    const overallPct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

    const ringFill = document.getElementById('dashboard-ring-fill');
    const ringPctText = document.getElementById('dashboard-ring-pct');
    const scoreText = document.getElementById('dashboard-learning-score');

    if (ringFill && ringPctText) {
      const radius = 58;
      const circumference = 2 * Math.PI * radius; // ~364.4
      const offset = circumference - (overallPct / 100) * circumference;
      ringFill.style.strokeDasharray = `${circumference}`;
      ringFill.style.strokeDashoffset = `${offset}`;
      ringPctText.textContent = `${overallPct}%`;
    }

    if (scoreText) {
      scoreText.textContent = `${stats.learningScore || 945} Points`;
    }

    // 4. Render Dashboard Course Progress Cards
    const coursesGrid = document.getElementById('dashboard-courses-grid');
    if (coursesGrid) {
      coursesGrid.innerHTML = courses.slice(0, 4).map(course => this.createCourseCardHTML(course)).join('');
      this.bindCourseCardEvents(coursesGrid);
    }

    // 5. Render Recent Activity Feed
    const activityTimeline = document.getElementById('dashboard-activity-timeline');
    if (activityTimeline) {
      activityTimeline.innerHTML = activityFeed.map(item => `
        <div class="timeline-item">
          <div class="timeline-dot" style="background: ${item.iconColor || 'var(--primary)'}"></div>
          <div style="font-weight: 600; font-size: 0.875rem; color: var(--text-primary);">${item.title}</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary);">${item.description}</div>
          <div style="font-size: 0.7rem; color: var(--text-muted);">${item.timestamp}</div>
        </div>
      `).join('');
    }

    // 6. Initialize Chart Analytics
    setTimeout(() => {
      AnalyticsCharts.init(state.grades, state.attendance);
    }, 100);
  },

  createCourseCardHTML(course) {
    let statusClass = 'badge-primary';
    if (course.status === 'Completed') statusClass = 'badge-success';
    if (course.status === 'Paused') statusClass = 'badge-warning';
    if (course.status === 'Not Started') statusClass = 'badge-secondary';

    return `
      <div class="card course-card">
        <div class="course-thumbnail-container">
          <img src="${course.thumbnail}" alt="${course.title}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600';">
          <button class="favourite-badge-btn ${course.isFavourite ? 'active' : ''}" data-id="${course.id}" title="Toggle Favorite">
            <i class="fa-${course.isFavourite ? 'solid' : 'regular'} fa-star"></i>
          </button>
        </div>
        <div class="flex items-center justify-between" style="margin-bottom: 0.5rem;">
          <span class="badge badge-secondary">${course.category}</span>
          <span class="badge ${statusClass}">${course.status}</span>
        </div>
        <h3 class="card-title" style="font-size: 1rem; margin-bottom: 0.35rem; line-height: 1.3;">${course.title}</h3>
        <p class="text-xs text-secondary" style="margin-bottom: 1rem;">
          <i class="fa-solid fa-user-tie"></i> ${course.instructor}
        </p>

        <div style="margin-top: auto;">
          <div class="flex justify-between text-xs text-secondary" style="margin-bottom: 0.35rem;">
            <span>Modules (${course.modulesCompleted}/${course.totalModules})</span>
            <span class="font-bold text-primary-color">${course.progressPct}%</span>
          </div>
          <div class="progress-bar-bg" style="margin-bottom: 1rem;">
            <div class="progress-bar-fill" style="width: ${course.progressPct}%;"></div>
          </div>
          <div class="flex items-center justify-between">
            <button class="btn btn-primary btn-sm resume-course-btn" data-id="${course.id}">
              <i class="fa-solid fa-play"></i> ${course.status === 'Completed' ? 'Review' : 'Resume'}
            </button>
            <span class="text-xs text-muted"><i class="fa-solid fa-clock"></i> ${course.estimatedCompletion}</span>
          </div>
        </div>
      </div>
    `;
  },

  bindCourseCardEvents(container) {
    container.querySelectorAll('.favourite-badge-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const state = StorageService.getState();
        const course = state.courses.find(c => c.id === id);
        if (course) {
          course.isFavourite = !course.isFavourite;
          StorageService.saveState(state);
          Toast.success(`${course.title} ${course.isFavourite ? 'added to' : 'removed from'} favorites`);
          this.render();
        }
      });
    });

    container.querySelectorAll('.resume-course-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const state = StorageService.getState();
        const course = state.courses.find(c => c.id === id);
        if (course) {
          Toast.info(`Launching ${course.title}...`);
          // Dispatch navigation to courses details
          const navCourses = document.querySelector('.nav-item[data-view="courses"]');
          if (navCourses) navCourses.click();
        }
      });
    });
  }
};
