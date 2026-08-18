/* ===================================================
   StudySwap — Home Page Logic v3 (Supabase-enabled)
   =================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('recent-notes-grid');
  if (!grid) return;

  // 1. Initial immediate render from local cache
  renderLatest();

  // 2. Fetch live from Supabase in background and re-render
  try {
    await fetchNotesAsync();
    renderLatest();
  } catch (e) {
    // Handled gracefully
  }

  function renderLatest() {
    const latestNotes = getLatestNotes(4);
    if (latestNotes.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          ${ICONS.fileText}
          <h3>No notes yet</h3>
          <p>Be the first to share study notes with your peers.</p>
          <a href="upload.html" class="btn btn-primary btn-sm">Upload Notes</a>
        </div>
      `;
      return;
    }
    grid.innerHTML = latestNotes.map(note => renderNoteCard(note)).join('');
  }
});

/** Open note modal */
function openNoteModal(noteId) {
  const notes = getAllNotes();
  const note = notes.find(n => n.id === noteId);
  if (!note) return;

  const cls = getSubjectClass(note.subject);
  const initials = note.uploaderInitials || getInitials(note.uploader);

  const modalHTML = `
    <div class="modal-overlay show" id="note-modal" onclick="closeNoteModal(event)">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <div>
            <span class="subject-tag ${cls}">${note.subject}</span>
            <h2 style="margin-top: 10px; font-size: 18px; letter-spacing: -0.02em;">${note.title}</h2>
          </div>
          <button class="modal-close" onclick="closeNoteModal()">${ICONS.x}</button>
        </div>
        <div class="modal-body">
          <div class="modal-meta">
            <span class="modal-meta-item">${ICONS.user} ${note.uploader}</span>
            <span class="modal-meta-item">${ICONS.graduation} ${note.semester}</span>
            <span class="modal-meta-item">${ICONS.calendar} ${formatDate(note.dateAdded)}</span>
            <span class="modal-meta-item">${ICONS.file} ${note.fileFormat || 'PDF'} · ${note.pages || '--'} pages</span>
          </div>
          <p class="modal-description">${note.description}</p>
          ${note.tags && note.tags.length > 0 ? `
            <div class="modal-tags">
              ${note.tags.map(t => `<span class="modal-tag">${t}</span>`).join('')}
            </div>
          ` : ''}
          <div class="modal-preview-box">
            ${ICONS.fileText}
            <p>Document preview available after download</p>
            <p style="font-size: 12px; color: var(--text-faint); margin-top: 4px;">${note.fileSize || 'N/A'}</p>
          </div>
          <div class="modal-actions">
            <button class="btn btn-primary btn-sm" onclick="simulateDownload(this)">
              ${ICONS.download} Download ${note.fileFormat || 'PDF'}
            </button>
            <button class="btn btn-secondary btn-sm" onclick="closeNoteModal()">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const existingModal = document.getElementById('note-modal');
  if (existingModal) existingModal.remove();

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', handleModalEscape);
}

function closeNoteModal(event) {
  if (event && event.target !== event.currentTarget) return;
  const modal = document.getElementById('note-modal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleModalEscape);
  }
}

function handleModalEscape(e) {
  if (e.key === 'Escape') closeNoteModal();
}

function simulateDownload(btn) {
  const originalText = btn.innerHTML;
  btn.innerHTML = `${ICONS.clock} Downloading...`;
  btn.disabled = true;
  btn.style.opacity = '0.6';

  setTimeout(() => {
    btn.innerHTML = `${ICONS.check} Downloaded`;
    btn.style.opacity = '1';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 2000);
  }, 1500);
}
