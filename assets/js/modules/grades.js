/* Grades View Controller Module */

import { StorageService } from '../services/storage.js';
import { Helpers } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';
import { Modal } from '../utils/modal.js';

export const GradesModule = {
  init() {
    const exportCsvBtn = document.getElementById('grades-export-csv-btn');
    const exportPdfBtn = document.getElementById('grades-export-pdf-btn');
    const printBtn = document.getElementById('grades-print-btn');

    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        const state = StorageService.getState();
        const grades = state.grades || [];
        const exportData = grades.map(g => ({
          'Course Name': g.courseName,
          'Quiz Score': g.quizScore + '%',
          'Assignment Score': g.assignmentScore + '%',
          'Midterm Exam': g.midtermScore + '%',
          'Final Exam': g.finalScore + '%',
          'Overall Percentage': g.overallPct + '%',
          'Grade': g.gradeBadge,
          'Class Rank': '#' + g.rank,
          'Credits': g.credits
        }));
        Helpers.exportToCSV('Student_Gradebook_Report_2026.csv', exportData);
        Toast.success('Gradebook report exported to CSV!');
      });
    }

    if (exportPdfBtn || printBtn) {
      const triggerPrint = () => {
        Toast.info('Preparing print preview report...');
        setTimeout(() => Helpers.printReport(), 300);
      };
      if (exportPdfBtn) exportPdfBtn.addEventListener('click', triggerPrint);
      if (printBtn) printBtn.addEventListener('click', triggerPrint);
    }
  },

  render() {
    const state = StorageService.getState();
    const grades = state.grades || [];

    // Calculate overall statistics
    const totalCredits = grades.reduce((acc, g) => acc + g.credits, 0);
    const avgPct = grades.length > 0 ? (grades.reduce((acc, g) => acc + g.overallPct, 0) / grades.length).toFixed(1) : '0';

    const cgpaEl = document.getElementById('grades-cgpa-val');
    const rankEl = document.getElementById('grades-rank-val');
    const creditsEl = document.getElementById('grades-credits-val');
    const avgPctEl = document.getElementById('grades-avg-pct-val');

    if (cgpaEl) cgpaEl.textContent = state.stats.cgpa || '3.88';
    if (rankEl) rankEl.textContent = '#2 in Department';
    if (creditsEl) creditsEl.textContent = `${totalCredits} Credits`;
    if (avgPctEl) avgPctEl.textContent = `${avgPct}%`;

    // Render Gradebook Table
    const tableBody = document.getElementById('grades-table-body');
    if (!tableBody) return;

    if (grades.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            No grades available yet.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = grades.map(g => {
      let badgeClass = 'badge-primary';
      if (g.gradeBadge.startsWith('A')) badgeClass = 'badge-success';
      if (g.gradeBadge.startsWith('B')) badgeClass = 'badge-warning';

      return `
        <tr>
          <td style="font-weight: 600;">${g.courseName}</td>
          <td>${g.quizScore}%</td>
          <td>${g.assignmentScore}%</td>
          <td>${g.midtermScore}%</td>
          <td>${g.finalScore}%</td>
          <td class="font-bold text-primary-color">${g.overallPct}%</td>
          <td><span class="badge ${badgeClass}">${g.gradeBadge}</span></td>
          <td>#${g.rank}</td>
          <td>
            <button class="btn btn-secondary btn-sm view-grade-detail-btn" data-id="${g.id}">
              <i class="fa-solid fa-chart-pie"></i> Details
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Bind Details Modal Event
    tableBody.querySelectorAll('.view-grade-detail-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openGradeDetailModal(id);
      });
    });
  },

  openGradeDetailModal(gradeId) {
    const state = StorageService.getState();
    const grade = state.grades.find(g => g.id === gradeId);
    if (!grade) return;

    const modalBody = `
      <div style="padding: 0.5rem 0;">
        <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1rem;">${grade.courseName}</h3>

        <div class="grid grid-cols-2 gap-4" style="margin-bottom: 1.5rem;">
          <div class="card" style="padding: 1rem; text-align: center; background: var(--bg-tertiary);">
            <div class="text-xs text-muted">Final Grade</div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--primary);">${grade.gradeBadge}</div>
          </div>
          <div class="card" style="padding: 1rem; text-align: center; background: var(--bg-tertiary);">
            <div class="text-xs text-muted">Overall Average</div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--success);">${grade.overallPct}%</div>
          </div>
        </div>

        <h4 style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.75rem;">Grade Weight Breakdown</h4>
        <div style="display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1.5rem;">
          <div class="flex justify-between text-sm">
            <span>Quizzes & Self-Tests (20%)</span>
            <span class="font-bold">${grade.quizScore}%</span>
          </div>
          <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${grade.quizScore}%;"></div></div>

          <div class="flex justify-between text-sm">
            <span>Assignments & Projects (30%)</span>
            <span class="font-bold">${grade.assignmentScore}%</span>
          </div>
          <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${grade.assignmentScore}%;"></div></div>

          <div class="flex justify-between text-sm">
            <span>Midterm Exam (25%)</span>
            <span class="font-bold">${grade.midtermScore}%</span>
          </div>
          <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${grade.midtermScore}%;"></div></div>

          <div class="flex justify-between text-sm">
            <span>Final Comprehensive Exam (25%)</span>
            <span class="font-bold">${grade.finalScore}%</span>
          </div>
          <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${grade.finalScore}%;"></div></div>
        </div>

        <div class="flex justify-between items-center" style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
          <span class="text-xs text-muted">Course Credits: ${grade.credits} Units</span>
          <button class="btn btn-secondary" data-close-modal>Close</button>
        </div>
      </div>
    `;

    Modal.open('grade-detail-modal', {
      title: 'Detailed Score Breakdown',
      bodyHTML: modalBody
    });
  }
};
