/* Attendance View Controller Module */

import { StorageService } from '../services/storage.js';
import { Toast } from '../utils/toast.js';
import { Modal } from '../utils/modal.js';

export const AttendanceModule = {
  init() {
    const requestLeaveBtn = document.getElementById('attendance-request-leave-btn');
    const leaveForm = document.getElementById('leave-request-form');

    if (requestLeaveBtn) {
      requestLeaveBtn.addEventListener('click', () => {
        Modal.open('leave-request-modal');
      });
    }

    if (leaveForm) {
      leaveForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const reason = document.getElementById('leave-reason-input').value;
        Toast.success('Leave application submitted for approval!');
        Modal.close('leave-request-modal');
        leaveForm.reset();
      });
    }
  },

  render() {
    const state = StorageService.getState();
    const att = state.attendance || {};

    const pctEl = document.getElementById('att-overall-pct');
    const presentEl = document.getElementById('att-present-days');
    const absentEl = document.getElementById('att-absent-days');
    const lateEl = document.getElementById('att-late-days');
    const leaveEl = document.getElementById('att-leave-days');

    if (pctEl) pctEl.textContent = `${att.overallPct}%`;
    if (presentEl) presentEl.textContent = att.presentDays || 0;
    if (absentEl) absentEl.textContent = att.absentDays || 0;
    if (lateEl) lateEl.textContent = att.lateDays || 0;
    if (leaveEl) leaveEl.textContent = att.leaveDays || 0;

    // Subject-wise Table
    const tableBody = document.getElementById('attendance-subject-table-body');
    if (!tableBody) return;

    const subjects = att.subjectWise || [];
    if (subjects.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">No attendance records found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = subjects.map(s => {
      let badgeClass = 'badge-success';
      if (s.pct < 85 && s.pct >= 75) badgeClass = 'badge-warning';
      if (s.pct < 75) badgeClass = 'badge-danger';

      return `
        <tr>
          <td style="font-weight: 600;">${s.subject}</td>
          <td>${s.present} Days</td>
          <td>${s.total} Days</td>
          <td class="font-bold">${s.pct}%</td>
          <td><span class="badge ${badgeClass}">${s.status}</span></td>
        </tr>
      `;
    }).join('');
  }
};
