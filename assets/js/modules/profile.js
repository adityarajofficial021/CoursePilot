/* Profile View Controller Module */

import { StorageService } from '../services/storage.js';
import { Toast } from '../utils/toast.js';
import { HeaderComponent } from '../components/header.js';

export const ProfileModule = {
  init() {
    const profileForm = document.getElementById('profile-edit-form');

    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const state = StorageService.getState();

        state.student = {
          ...state.student,
          name: document.getElementById('profile-name').value.trim(),
          email: document.getElementById('profile-email').value.trim(),
          phone: document.getElementById('profile-phone').value.trim(),
          college: document.getElementById('profile-college').value.trim(),
          department: document.getElementById('profile-department').value.trim(),
          semester: document.getElementById('profile-semester').value.trim(),
          bio: document.getElementById('profile-bio').value.trim(),
          learningGoal: document.getElementById('profile-learning-goal').value.trim(),
          socialLinks: {
            github: document.getElementById('profile-github').value.trim(),
            linkedin: document.getElementById('profile-linkedin').value.trim(),
            twitter: document.getElementById('profile-twitter').value.trim()
          }
        };

        StorageService.saveState(state);
        HeaderComponent.updateUserPill(state.student);
        Toast.success('Profile updated successfully!');
      });
    }
  },

  render() {
    const state = StorageService.getState();
    const student = state.student || {};

    const nameIn = document.getElementById('profile-name');
    const emailIn = document.getElementById('profile-email');
    const phoneIn = document.getElementById('profile-phone');
    const collegeIn = document.getElementById('profile-college');
    const deptIn = document.getElementById('profile-department');
    const semIn = document.getElementById('profile-semester');
    const bioIn = document.getElementById('profile-bio');
    const goalIn = document.getElementById('profile-learning-goal');
    const githubIn = document.getElementById('profile-github');
    const linkedinIn = document.getElementById('profile-linkedin');
    const twitterIn = document.getElementById('profile-twitter');

    if (nameIn) nameIn.value = student.name || '';
    if (emailIn) emailIn.value = student.email || '';
    if (phoneIn) phoneIn.value = student.phone || '';
    if (collegeIn) collegeIn.value = student.college || '';
    if (deptIn) deptIn.value = student.department || '';
    if (semIn) semIn.value = student.semester || '';
    if (bioIn) bioIn.value = student.bio || '';
    if (goalIn) goalIn.value = student.learningGoal || '';
    if (githubIn) githubIn.value = student.socialLinks?.github || '';
    if (linkedinIn) linkedinIn.value = student.socialLinks?.linkedin || '';
    if (twitterIn) twitterIn.value = student.socialLinks?.twitter || '';

    HeaderComponent.updateUserPill(student);
  }
};
