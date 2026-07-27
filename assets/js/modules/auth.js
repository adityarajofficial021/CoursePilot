/* Auth Controller Module - Landing Page Tabs, Registration, Login, Hashing, Password Strength, Reset Flow */

import { ApiService } from '../services/api.js';
import { StorageService } from '../services/storage.js';
import { Toast } from '../utils/toast.js';
import { Modal } from '../utils/modal.js';
import { CryptoUtils } from '../utils/crypto.js';

export const AuthModule = {
  resetEmailCandidate: null,

  init(onLoginSuccess) {
    const tabLoginBtn = document.getElementById('tab-login-btn');
    const tabRegBtn = document.getElementById('tab-register-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const errorAlert = document.getElementById('login-error-alert');
    const successAlert = document.getElementById('login-success-alert');

    // 1. Landing View Tab Switching
    if (tabLoginBtn && tabRegBtn) {
      tabLoginBtn.addEventListener('click', () => {
        tabLoginBtn.classList.add('active');
        tabRegBtn.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        errorAlert.classList.add('hidden');
        successAlert.classList.add('hidden');
      });

      tabRegBtn.addEventListener('click', () => {
        tabRegBtn.classList.add('active');
        tabLoginBtn.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        errorAlert.classList.add('hidden');
        successAlert.classList.add('hidden');
      });
    }

    // 2. Password Visibility Toggles
    this.bindPasswordToggles();

    // 3. Live Password Strength & Match Indicators for Registration
    this.bindRegistrationLiveFeedback();

    // 4. Registration Form Submission
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const mobile = document.getElementById('reg-mobile').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        const submitBtn = document.getElementById('reg-submit-btn');

        errorAlert.classList.add('hidden');
        successAlert.classList.add('hidden');

        if (password !== confirmPassword) {
          errorAlert.textContent = 'Passwords do not match';
          errorAlert.classList.remove('hidden');
          return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<div class="spinner"></div> Creating Account...`;

        try {
          const res = await ApiService.register({ name, email, mobile, password });
          if (res.ok) {
            successAlert.textContent = res.message || 'Account created successfully. Please log in.';
            successAlert.classList.remove('hidden');
            Toast.success('Account created successfully!');
            registerForm.reset();

            // Pre-fill login email and switch to login tab
            document.getElementById('login-email').value = email;
            document.getElementById('login-password').value = password;
            setTimeout(() => {
              if (tabLoginBtn) tabLoginBtn.click();
            }, 1200);
          } else {
            errorAlert.textContent = res.error || 'Registration failed';
            errorAlert.classList.remove('hidden');
          }
        } catch (err) {
          errorAlert.textContent = 'Registration failed. Please try again.';
          errorAlert.classList.remove('hidden');
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Create Student Account</span> <i class="fa-solid fa-user-plus"></i>`;
        }
      });
    }

    // 5. Login Form Submission
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me-checkbox').checked;
        const submitBtn = document.getElementById('login-submit-btn');

        errorAlert.classList.add('hidden');
        successAlert.classList.add('hidden');

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<div class="spinner"></div> Authenticating...`;

        try {
          const response = await ApiService.login(email, password);

          if (response.ok) {
            StorageService.setAuth(response.user, rememberMe);
            Toast.success(`Welcome back, ${response.user.name}!`);

            setTimeout(() => {
              this.hideLoginScreen();
              if (onLoginSuccess) onLoginSuccess(response.user);
            }, 300);
          } else {
            errorAlert.textContent = response.error || 'Invalid email or password.';
            errorAlert.classList.remove('hidden');
          }
        } catch (err) {
          errorAlert.textContent = 'Connection error. Please try again.';
          errorAlert.classList.remove('hidden');
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Sign In to Dashboard</span> <i class="fa-solid fa-arrow-right"></i>`;
        }
      });
    }

    // 6. Two-Step Password Reset Flow
    this.bindPasswordResetFlow();

    // 7. Logout Handling
    document.querySelectorAll('.logout-trigger-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to log out?')) {
          StorageService.clearAuth();
          Toast.info('Logged out successfully');
          this.showLoginScreen();
        }
      });
    });

    // 8. Auto Login Session Check
    if (StorageService.isLoggedIn()) {
      const auth = StorageService.getAuth();
      this.hideLoginScreen();
      if (onLoginSuccess && auth) onLoginSuccess(auth.user);
    } else {
      this.showLoginScreen();
    }
  },

  bindPasswordToggles() {
    const pairs = [
      { btn: 'toggle-password-btn', input: 'login-password' },
      { btn: 'toggle-reg-password-btn', input: 'reg-password' },
      { btn: 'toggle-reg-confirm-btn', input: 'reg-confirm-password' }
    ];

    pairs.forEach(({ btn, input }) => {
      const btnEl = document.getElementById(btn);
      const inputEl = document.getElementById(input);
      if (btnEl && inputEl) {
        btnEl.addEventListener('click', () => {
          const type = inputEl.getAttribute('type') === 'password' ? 'text' : 'password';
          inputEl.setAttribute('type', type);
          btnEl.className = `fa-solid ${type === 'password' ? 'fa-eye' : 'fa-eye-slash'} toggle-password-btn`;
        });
      }
    });
  },

  bindRegistrationLiveFeedback() {
    const regPassword = document.getElementById('reg-password');
    const regConfirm = document.getElementById('reg-confirm-password');
    const strengthBar = document.getElementById('reg-strength-bar');
    const strengthText = document.getElementById('reg-strength-text');
    const matchText = document.getElementById('reg-match-text');

    if (regPassword && strengthBar && strengthText) {
      regPassword.addEventListener('input', () => {
        const val = regPassword.value;
        const res = CryptoUtils.checkPasswordStrength(val);
        strengthBar.style.width = `${(res.score / 4) * 100}%`;
        strengthBar.style.backgroundColor = res.color;
        strengthText.textContent = `Strength: ${res.label}`;
        strengthText.style.color = res.color;
      });
    }

    if (regConfirm && regPassword && matchText) {
      const checkMatch = () => {
        if (!regConfirm.value) {
          matchText.textContent = '';
          return;
        }
        if (regConfirm.value === regPassword.value) {
          matchText.textContent = '✓ Passwords match';
          matchText.style.color = 'var(--success)';
        } else {
          matchText.textContent = '✕ Passwords do not match';
          matchText.style.color = 'var(--danger)';
        }
      };
      regConfirm.addEventListener('input', checkMatch);
      regPassword.addEventListener('input', checkMatch);
    }
  },

  bindPasswordResetFlow() {
    const forgotLink = document.getElementById('forgot-password-link');
    const step1Form = document.getElementById('forgot-password-form');
    const step2Form = document.getElementById('reset-password-step2-form');

    if (forgotLink) {
      forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (step1Form) step1Form.classList.remove('hidden');
        if (step2Form) step2Form.classList.add('hidden');
        Modal.open('forgot-password-modal');
      });
    }

    if (step1Form) {
      step1Form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('reset-email-input').value.trim();
        const res = await ApiService.requestPasswordReset(email);
        if (res.ok) {
          this.resetEmailCandidate = email;
          Toast.success('Account verified! Enter your new password.');
          step1Form.classList.add('hidden');
          if (step2Form) step2Form.classList.remove('hidden');
        } else {
          Toast.error(res.error || 'No account found with this email');
        }
      });
    }

    if (step2Form) {
      step2Form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPass = document.getElementById('reset-new-password').value;
        const confirmPass = document.getElementById('reset-confirm-password').value;

        if (newPass !== confirmPass) {
          Toast.error('Passwords do not match');
          return;
        }

        const res = await ApiService.resetPassword(this.resetEmailCandidate, newPass);
        if (res.ok) {
          Toast.success(res.message);
          Modal.close('forgot-password-modal');
          step2Form.reset();
          if (step1Form) step1Form.reset();
        } else {
          Toast.error(res.error || 'Password reset failed');
        }
      });
    }
  },

  showLoginScreen() {
    const loginOverlay = document.getElementById('login-screen-wrapper');
    const appLayout = document.getElementById('app-layout');
    if (loginOverlay) loginOverlay.classList.remove('hidden');
    if (appLayout) appLayout.classList.add('hidden');
  },

  hideLoginScreen() {
    const loginOverlay = document.getElementById('login-screen-wrapper');
    const appLayout = document.getElementById('app-layout');
    if (loginOverlay) loginOverlay.classList.remove('hidden');
    if (loginOverlay) loginOverlay.classList.add('hidden');
    if (appLayout) appLayout.classList.remove('hidden');
  }
};
