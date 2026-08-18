/* ===================================================
   StudySwap — Data Layer & Supabase Sync v3
   Seamless hybrid: Supabase remote DB + localStorage fallback.
   =================================================== */

const STORAGE_KEY = 'studyswap_notes';

const SUBJECT_CLASS_MAP = {
  'Computer Science': 'cs',
  'Mathematics': 'math',
  'Physics': 'physics',
  'Economics': 'economics',
  'Chemistry': 'chemistry',
  'Mechanical Engineering': 'mechanical'
};

const SEED_NOTES = [
  {
    id: 'note_1',
    title: 'Data Structures & Algorithms — Complete Exam Prep',
    subject: 'Computer Science',
    semester: 'Semester 3',
    uploader: 'Aarav Sharma',
    uploaderInitials: 'AS',
    description: 'Comprehensive notes covering Trees, Graphs, Dynamic Programming, and Time Complexity analyses with code snippets and practice problems.',
    fileFormat: 'PDF',
    fileSize: '4.2 MB',
    pages: 28,
    downloads: 342,
    rating: 4.9,
    dateAdded: '2026-08-15',
    tags: ['Trees', 'Graphs', 'DP', 'Sorting']
  },
  {
    id: 'note_2',
    title: 'Multivariable Calculus & Linear Algebra Summary',
    subject: 'Mathematics',
    semester: 'Semester 2',
    uploader: 'Priya Patel',
    uploaderInitials: 'PP',
    description: 'Concise summary of partial derivatives, multiple integrals, eigenvalues, vector spaces, and matrix decompositions.',
    fileFormat: 'PDF',
    fileSize: '3.1 MB',
    pages: 22,
    downloads: 287,
    rating: 4.8,
    dateAdded: '2026-08-14',
    tags: ['Calculus', 'Linear Algebra', 'Eigenvalues']
  },
  {
    id: 'note_3',
    title: 'Quantum Mechanics & Wave Optics Handwritten Notes',
    subject: 'Physics',
    semester: 'Semester 4',
    uploader: 'Rahul Verma',
    uploaderInitials: 'RV',
    description: 'Detailed handwritten notes on Schrödinger equation, wave-particle duality, interference, diffraction, and polarization.',
    fileFormat: 'PDF',
    fileSize: '6.8 MB',
    pages: 35,
    downloads: 198,
    rating: 4.7,
    dateAdded: '2026-08-13',
    tags: ['Quantum', 'Optics', 'Waves']
  },
  {
    id: 'note_4',
    title: 'Macroeconomics: Fiscal Policy & Inflation Models',
    subject: 'Economics',
    semester: 'Semester 1',
    uploader: 'Ananya Gupta',
    uploaderInitials: 'AG',
    description: 'In-depth analysis of Keynesian economics, IS-LM model, fiscal multipliers, inflation targeting, and monetary policy tools.',
    fileFormat: 'DOCX',
    fileSize: '2.4 MB',
    pages: 18,
    downloads: 156,
    rating: 4.6,
    dateAdded: '2026-08-12',
    tags: ['Fiscal Policy', 'Inflation', 'IS-LM']
  },
  {
    id: 'note_5',
    title: 'Database Management Systems — SQL & Normalization',
    subject: 'Computer Science',
    semester: 'Semester 4',
    uploader: 'Karan Singh',
    uploaderInitials: 'KS',
    description: 'Complete DBMS notes covering ER diagrams, relational algebra, SQL queries, normalization (1NF to BCNF), and transaction management.',
    fileFormat: 'PDF',
    fileSize: '5.0 MB',
    pages: 32,
    downloads: 410,
    rating: 4.9,
    dateAdded: '2026-08-11',
    tags: ['SQL', 'Normalization', 'ER Diagrams']
  },
  {
    id: 'note_6',
    title: 'Discrete Mathematics & Graph Theory Formula Book',
    subject: 'Mathematics',
    semester: 'Semester 3',
    uploader: 'Neha Joshi',
    uploaderInitials: 'NJ',
    description: 'Quick-reference formula book for combinatorics, graph coloring, recurrence relations, Boolean algebra, and proof techniques.',
    fileFormat: 'PDF',
    fileSize: '2.9 MB',
    pages: 20,
    downloads: 265,
    rating: 4.5,
    dateAdded: '2026-08-10',
    tags: ['Combinatorics', 'Graph Theory', 'Boolean']
  },
  {
    id: 'note_7',
    title: 'Electromagnetism & Thermodynamics Quick Revision',
    subject: 'Physics',
    semester: 'Semester 2',
    uploader: 'Arjun Mehta',
    uploaderInitials: 'AM',
    description: 'Exam-focused revision notes on Maxwell\'s equations, Gauss\'s law, thermodynamic cycles, entropy, and heat transfer.',
    fileFormat: 'PDF',
    fileSize: '3.6 MB',
    pages: 24,
    downloads: 178,
    rating: 4.4,
    dateAdded: '2026-08-09',
    tags: ['Electromagnetism', 'Thermodynamics', 'Maxwell']
  },
  {
    id: 'note_8',
    title: 'Microeconomic Theory: Consumer Behavior & Markets',
    subject: 'Economics',
    semester: 'Semester 2',
    uploader: 'Sneha Reddy',
    uploaderInitials: 'SR',
    description: 'Covers utility theory, indifference curves, budget constraints, perfect competition, monopoly, and game theory basics.',
    fileFormat: 'PDF',
    fileSize: '3.3 MB',
    pages: 26,
    downloads: 134,
    rating: 4.7,
    dateAdded: '2026-08-08',
    tags: ['Utility', 'Markets', 'Game Theory']
  }
];

// --- SVG Icon helpers ---
const ICONS = {
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  graduation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  alertTriangle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  fileText: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13"/></svg>',
};

/** Initialize localStorage with seed data if empty */
function initNotes() {
  let notes = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!notes || notes.length === 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_NOTES));
    notes = SEED_NOTES;
  }
  return notes;
}

/** Get all notes synchronously from local cache */
function getAllNotes() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || SEED_NOTES;
}

/** Get latest N notes from local cache */
function getLatestNotes(count) {
  return getAllNotes()
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, count);
}

/**
 * Fetch notes from Supabase remote database with fallback to local cache.
 * Syncs any remote notes back to localStorage.
 */
async function fetchNotesAsync() {
  const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (!sb) {
    return getAllNotes();
  }

  try {
    const { data, error } = await sb
      .from('notes')
      .select('*')
      .order('date_added', { ascending: false });

    if (error) {
      console.warn('[StudySwap] Supabase query notice (using local data):', error.message);
      return getAllNotes();
    }

    if (data && data.length > 0) {
      // Map remote columns to JS schema
      const mapped = data.map(row => ({
        id: row.id,
        title: row.title,
        subject: row.subject,
        semester: row.semester,
        uploader: row.uploader,
        uploaderInitials: row.uploader_initials || getInitials(row.uploader || 'Student'),
        description: row.description,
        fileFormat: row.file_format || 'PDF',
        fileSize: row.file_size || 'N/A',
        pages: row.pages || 10,
        downloads: row.downloads || 0,
        rating: row.rating || 5.0,
        dateAdded: row.date_added || new Date().toISOString().split('T')[0],
        tags: Array.isArray(row.tags) ? row.tags : (row.tags ? [row.tags] : [])
      }));

      // Merge with seed notes to keep library rich
      const mergedMap = new Map();
      mapped.forEach(n => mergedMap.set(n.id, n));
      SEED_NOTES.forEach(n => {
        if (!mergedMap.has(n.id)) mergedMap.set(n.id, n);
      });

      const mergedList = Array.from(mergedMap.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedList));
      return mergedList;
    }
  } catch (err) {
    console.warn('[StudySwap] Remote fetch exception:', err);
  }

  return getAllNotes();
}

/**
 * Add a new note and write to both Supabase and localStorage.
 */
async function addNote(noteData) {
  const newNote = {
    id: 'note_' + Date.now(),
    ...noteData,
    downloads: 0,
    rating: 5.0,
    dateAdded: new Date().toISOString().split('T')[0]
  };

  // 1. Save locally first for instant feedback
  const localNotes = getAllNotes();
  localNotes.unshift(newNote);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(localNotes));

  // 2. Push to Supabase if connected
  const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (sb) {
    try {
      const { data, error } = await sb.from('notes').insert([
        {
          id: newNote.id,
          title: newNote.title,
          subject: newNote.subject,
          semester: newNote.semester,
          uploader: newNote.uploader,
          uploader_initials: newNote.uploaderInitials,
          description: newNote.description,
          file_format: newNote.fileFormat,
          file_size: newNote.fileSize,
          pages: newNote.pages,
          downloads: newNote.downloads,
          rating: newNote.rating,
          date_added: newNote.dateAdded,
          tags: newNote.tags || []
        }
      ]);

      if (error) {
        console.warn('[StudySwap] Supabase insert warning (saved locally):', error.message);
      } else {
        console.log('[StudySwap] Note successfully saved to Supabase DB!');
      }
    } catch (err) {
      console.warn('[StudySwap] Supabase insert exception (saved locally):', err);
    }
  }

  return newNote;
}

function getSubjectClass(subject) {
  return SUBJECT_CLASS_MAP[subject] || 'cs';
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderNoteCard(note) {
  const cls = getSubjectClass(note.subject);
  const initials = note.uploaderInitials || getInitials(note.uploader);
  return `
    <div class="note-card" data-subject="${note.subject}" data-semester="${note.semester}" data-id="${note.id}" onclick="openNoteModal('${note.id}')">
      <div class="note-card-top">
        <span class="subject-tag ${cls}">${note.subject}</span>
        <span class="semester-tag">${note.semester}</span>
      </div>
      <h3 class="note-card-title">${note.title}</h3>
      <p class="note-card-desc">${note.description}</p>
      <div class="note-card-bottom">
        <div class="note-author">
          <div class="avatar-circle ${cls}">${initials}</div>
          <span class="author-name">${note.uploader}</span>
        </div>
        <div class="note-meta">
          <span>${ICONS.file} ${note.pages || '--'}p</span>
          <span>${ICONS.star} ${note.rating || 'New'}</span>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  initNotes();
});
