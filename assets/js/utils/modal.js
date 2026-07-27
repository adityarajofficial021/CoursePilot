/* Reusable Modal Dialog Manager */

export const Modal = {
  /**
   * Opens a modal overlay by ID and populates content if provided
   */
  open(modalId, options = {}) {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) return;

    if (options.title) {
      const titleEl = modalEl.querySelector('.modal-title');
      if (titleEl) titleEl.textContent = options.title;
    }

    if (options.bodyHTML) {
      const bodyEl = modalEl.querySelector('.modal-body');
      if (bodyEl) bodyEl.innerHTML = options.bodyHTML;
    }

    modalEl.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Attach Esc listener
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        Modal.close(modalId);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  },

  /**
   * Closes a modal overlay
   */
  close(modalId) {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) return;

    modalEl.classList.remove('active');
    document.body.style.overflow = '';
  },

  /**
   * Attach default backdrop and close button triggers
   */
  bindEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay') || e.target.closest('[data-close-modal]')) {
        const modal = e.target.closest('.modal-overlay');
        if (modal) {
          Modal.close(modal.id);
        }
      }
    });
  }
};
