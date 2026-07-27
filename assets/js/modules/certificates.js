/* Certificates View Controller Module */

import { StorageService } from '../services/storage.js';
import { Toast } from '../utils/toast.js';
import { Modal } from '../utils/modal.js';
import { Helpers } from '../utils/helpers.js';

export const CertificatesModule = {
  render() {
    const state = StorageService.getState();
    const certs = state.certificates || [];

    const container = document.getElementById('certificates-grid-container');
    if (!container) return;

    if (certs.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 3rem; text-align: center; color: var(--text-muted);">
          <i class="fa-solid fa-award" style="font-size: 3rem; margin-bottom: 1rem;"></i>
          <h3>No certificates earned yet</h3>
          <p>Complete 100% of a course's syllabus to earn verified certificates.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = certs.map(c => `
      <div class="certificate-card">
        <div class="certificate-banner">
          <i class="fa-solid fa-certificate"></i>
          <span class="badge badge-success" style="position: absolute; top: 1rem; right: 1rem;">Verified</span>
        </div>
        <div style="padding: 1.5rem;">
          <div class="text-xs text-muted" style="margin-bottom: 0.25rem;">Credential ID: ${c.credentialId}</div>
          <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; line-height: 1.3;">${c.title}</h3>
          <p class="text-xs text-secondary" style="margin-bottom: 1.25rem;">
            Issued on: <strong>${c.issueDate}</strong> by ${c.instructor}
          </p>

          <div class="flex items-center gap-2">
            <button class="btn btn-primary btn-sm preview-cert-btn" data-id="${c.id}" style="flex: 1;">
              <i class="fa-solid fa-eye"></i> Preview Certificate
            </button>
            <button class="btn btn-secondary btn-sm share-cert-btn" data-id="${c.id}">
              <i class="fa-solid fa-share-nodes"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    this.bindEvents(container);
  },

  bindEvents(container) {
    container.querySelectorAll('.preview-cert-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openCertificateModal(id);
      });
    });

    container.querySelectorAll('.share-cert-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const state = StorageService.getState();
        const cert = state.certificates.find(c => c.id === id);
        if (cert) {
          navigator.clipboard.writeText(cert.verificationUrl || window.location.href);
          Toast.success('Credential verification link copied to clipboard!');
        }
      });
    });
  },

  openCertificateModal(certId) {
    const state = StorageService.getState();
    const cert = state.certificates.find(c => c.id === certId);
    const student = state.student;
    if (!cert) return;

    const modalBody = `
      <div id="certificate-print-area" class="cert-modal-template">
        <div style="font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; color: #475569; font-weight: 700; margin-bottom: 0.5rem;">
          ${student.college}
        </div>
        <h2 style="font-size: 1.8rem; font-family: serif; color: #1E1B4B; margin-bottom: 1.25rem;">Certificate of Achievement</h2>

        <p style="font-size: 0.95rem; color: #475569;">This is to certify that</p>
        <h1 style="font-size: 2.2rem; font-weight: 800; color: #4F46E5; margin: 0.5rem 0 1rem 0;">${student.name}</h1>
        <p style="font-size: 0.95rem; color: #475569; max-width: 480px; margin: 0 auto 1.5rem auto;">
          has successfully completed all required modules, assessments, and capstone practicals for the course:
        </p>

        <h3 style="font-size: 1.35rem; font-weight: 700; color: #0F172A; margin-bottom: 1.5rem;">"${cert.course}"</h3>

        <div class="cert-modal-seal">
          <i class="fa-solid fa-ribbon"></i>
        </div>

        <div class="flex justify-between items-end" style="margin-top: 2rem; border-top: 1px solid #CBD5E1; padding-top: 1rem; text-align: left;">
          <div>
            <div style="font-weight: 700; font-size: 0.9rem;">${cert.instructor}</div>
            <div style="font-size: 0.75rem; color: #64748B;">Lead Course Instructor</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 700; font-size: 0.9rem;">Date: ${cert.issueDate}</div>
            <div style="font-size: 0.75rem; color: #64748B;">ID: ${cert.credentialId}</div>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center" style="margin-top: 1.5rem;">
        <button class="btn btn-primary" id="download-cert-pdf-btn">
          <i class="fa-solid fa-download"></i> Download PDF Certificate
        </button>
        <button class="btn btn-secondary" data-close-modal>Close</button>
      </div>
    `;

    Modal.open('certificate-modal', {
      title: 'Verified Digital Certificate',
      bodyHTML: modalBody
    });

    const downloadBtn = document.getElementById('download-cert-pdf-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        Toast.info('Preparing high-resolution PDF download...');
        setTimeout(() => Helpers.printReport(), 400);
      });
    }
  }
};
