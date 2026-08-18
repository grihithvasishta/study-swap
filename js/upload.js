/* ===================================================
   StudySwap — Upload Page Logic v3 (Supabase-enabled)
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('upload-form');
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const filePreview = document.getElementById('file-preview');
  const fpName = document.getElementById('fp-name');
  const fpSize = document.getElementById('fp-size');
  const fpRemove = document.getElementById('fp-remove');
  const successModal = document.getElementById('success-modal');
  const toastContainer = document.getElementById('toast-container');

  if (!form) return;

  let selectedFile = null;

  const validators = {
    'student-name': { required: true, minLength: 2, message: 'Name must be at least 2 characters' },
    'subject': { required: true, message: 'Please select a subject' },
    'semester': { required: true, message: 'Please select a semester' },
    'note-title': { required: true, minLength: 5, message: 'Title must be at least 5 characters' },
    'description': { required: true, minLength: 15, message: 'Description must be at least 15 characters' }
  };

  Object.keys(validators).forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (!el) return;
    el.addEventListener('blur', () => validateField(fieldId));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(fieldId);
    });
  });

  function validateField(fieldId) {
    const el = document.getElementById(fieldId);
    const rule = validators[fieldId];
    const errorEl = el.parentElement.querySelector('.form-error');
    let valid = true;

    if (rule.required && !el.value.trim()) valid = false;
    if (rule.minLength && el.value.trim().length < rule.minLength && el.value.trim().length > 0) valid = false;

    if (!valid) {
      el.classList.add('error');
      el.classList.remove('valid');
      if (errorEl) { errorEl.textContent = rule.message; errorEl.classList.add('show'); }
    } else if (el.value.trim()) {
      el.classList.remove('error');
      el.classList.add('valid');
      if (errorEl) errorEl.classList.remove('show');
    } else {
      el.classList.remove('error', 'valid');
      if (errorEl) errorEl.classList.remove('show');
    }
    return valid;
  }

  function validateAll() {
    let allValid = true;
    Object.keys(validators).forEach(fieldId => {
      if (!validateField(fieldId)) allValid = false;
    });
    return allValid;
  }

  // Drag & Drop
  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', () => { dropzone.classList.remove('dragover'); });
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) handleFile(fileInput.files[0]);
  });

  function handleFile(file) {
    const allowed = ['.pdf', '.docx', '.doc', '.png', '.jpg', '.jpeg'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
      showToast('Please upload a PDF, DOCX, PNG, or JPG file.', 'error');
      return;
    }
    selectedFile = file;
    fpName.textContent = file.name;
    fpSize.textContent = formatFileSize(file.size);
    filePreview.classList.add('show');
    dropzone.style.display = 'none';
  }

  fpRemove.addEventListener('click', () => {
    selectedFile = null;
    fileInput.value = '';
    filePreview.classList.remove('show');
    dropzone.style.display = '';
  });

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      showToast('Please fill in all required fields correctly.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const origBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `${ICONS.clock} Uploading...`;
    submitBtn.disabled = true;

    const noteData = {
      title: document.getElementById('note-title').value.trim(),
      subject: document.getElementById('subject').value,
      semester: document.getElementById('semester').value,
      uploader: document.getElementById('student-name').value.trim(),
      uploaderInitials: getInitials(document.getElementById('student-name').value.trim()),
      description: document.getElementById('description').value.trim(),
      fileFormat: selectedFile ? selectedFile.name.split('.').pop().toUpperCase() : 'PDF',
      fileSize: selectedFile ? formatFileSize(selectedFile.size) : 'N/A',
      pages: Math.floor(Math.random() * 30) + 5,
      tags: document.getElementById('tags').value.trim()
        ? document.getElementById('tags').value.trim().split(',').map(t => t.trim()).filter(Boolean)
        : []
    };

    try {
      await addNote(noteData);
      showSuccessModal();
      showToast('Notes submitted successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error uploading notes, saved locally.', 'error');
    } finally {
      submitBtn.innerHTML = origBtnText;
      submitBtn.disabled = false;
    }
  });

  function showSuccessModal() {
    if (successModal) {
      successModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  window.closeSuccessModal = function () {
    if (successModal) {
      successModal.classList.remove('show');
      document.body.style.overflow = '';
    }
  };

  window.uploadAnother = function () {
    closeSuccessModal();
    form.reset();
    selectedFile = null;
    fileInput.value = '';
    filePreview.classList.remove('show');
    dropzone.style.display = '';
    form.querySelectorAll('.form-input').forEach(el => el.classList.remove('error', 'valid'));
    form.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const iconSvg = type === 'success' ? ICONS.checkCircle : ICONS.alertTriangle;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      ${iconSvg}
      <span>${message}</span>
      <span class="toast-close" onclick="this.parentElement.remove()">&times;</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(60px)';
        toast.style.transition = '0.25s';
        setTimeout(() => toast.remove(), 250);
      }
    }, 4000);
  }
});
