/* ===================================================
   StudySwap — Browse Page Logic v3 (Supabase-enabled)
   =================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('browse-notes-grid');
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  const subjectFilter = document.getElementById('filter-subject');
  const semesterFilter = document.getElementById('filter-semester');
  const sortFilter = document.getElementById('filter-sort');
  const resultsCount = document.getElementById('results-count');
  const clearFiltersBtn = document.getElementById('clear-filters-btn');
  const pills = document.querySelectorAll('.filter-pill');

  if (!grid) return;

  let allNotes = getAllNotes();

  // --- Render notes ---
  function renderNotes() {
    let filtered = [...allNotes];

    // Search filter
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.description.toLowerCase().includes(query) ||
        note.uploader.toLowerCase().includes(query) ||
        (note.tags && note.tags.some(t => t.toLowerCase().includes(query)))
      );
    }

    // Subject filter
    const selectedSubject = subjectFilter.value;
    if (selectedSubject) {
      filtered = filtered.filter(n => n.subject === selectedSubject);
    }

    // Semester filter
    const selectedSemester = semesterFilter.value;
    if (selectedSemester) {
      filtered = filtered.filter(n => n.semester === selectedSemester);
    }

    // Sort
    const sortBy = sortFilter.value;
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'downloads':
        filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
      case 'az':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }

    resultsCount.innerHTML = `Showing <span>${filtered.length}</span> note${filtered.length !== 1 ? 's' : ''}`;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          ${ICONS.search}
          <h3>No notes found</h3>
          <p>Try adjusting your search or filters to find what you're looking for.</p>
          <button class="btn btn-secondary btn-sm" onclick="resetAllFilters()">Reset Search</button>
        </div>
      `;
    } else {
      grid.innerHTML = filtered.map(note => renderNoteCard(note)).join('');
    }
  }

  // Event listeners
  searchInput.addEventListener('input', () => {
    clearBtn.classList.toggle('show', searchInput.value.length > 0);
    renderNotes();
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.remove('show');
    renderNotes();
    searchInput.focus();
  });

  subjectFilter.addEventListener('change', () => {
    pills.forEach(p => {
      p.classList.toggle('active', p.dataset.subject === subjectFilter.value);
    });
    renderNotes();
  });

  semesterFilter.addEventListener('change', renderNotes);
  sortFilter.addEventListener('change', renderNotes);

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const subject = pill.dataset.subject;
      if (pill.classList.contains('active')) {
        pill.classList.remove('active');
        subjectFilter.value = '';
      } else {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        subjectFilter.value = subject;
      }
      renderNotes();
    });
  });

  clearFiltersBtn.addEventListener('click', () => {
    resetAllFilters();
  });

  window.resetAllFilters = function () {
    searchInput.value = '';
    clearBtn.classList.remove('show');
    subjectFilter.value = '';
    semesterFilter.value = '';
    sortFilter.value = 'recent';
    pills.forEach(p => p.classList.remove('active'));
    allNotes = getAllNotes();
    renderNotes();
  };

  // Initial immediate render
  renderNotes();

  // Background fetch from Supabase
  try {
    const fetched = await fetchNotesAsync();
    if (fetched && fetched.length > 0) {
      allNotes = fetched;
      renderNotes();
    }
  } catch (e) {
    // Handled gracefully
  }
});
