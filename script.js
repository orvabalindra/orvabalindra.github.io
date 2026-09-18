const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const projects = [
  {
    index: '01',
    title: 'Blodora App',
    text: 'A Laravel-based blood donation management system built as a team project and currently in progress. The project covers web interface work, database-driven features, authentication, and role-based pages.',
    role: 'Frontend / Fullstack Beginner',
    status: 'In Progress',
    stack: 'Laravel · PHP · MySQL · Bootstrap',
    url: 'https://github.com/orvabalindra/blodora-app'
  }
];

const dialog = document.querySelector('#project-dialog');
const dialogIndex = document.querySelector('#dialog-index');
const dialogTitle = document.querySelector('#dialog-title');
const dialogText = document.querySelector('#dialog-text');
const dialogLink = document.querySelector('#dialog-link');
const dialogDetails = document.querySelector('#dialog-details');

function openProject(index) {
  const project = projects[index];
  if (!project || !dialog) return;
  dialogIndex.textContent = project.index;
  dialogTitle.textContent = project.title;
  dialogText.textContent = project.text;
  if (dialogDetails) {
    dialogDetails.innerHTML = `
      <div><span>ROLE</span><strong>${project.role}</strong></div>
      <div><span>STATUS</span><strong>${project.status}</strong></div>
      <div><span>STACK</span><strong>${project.stack}</strong></div>
    `;
  }
  const hasProjectUrl = Boolean(project.url && project.url !== '#');
  dialogLink.href = hasProjectUrl ? project.url : '#';
  dialogLink.textContent = hasProjectUrl ? 'Open project ↗' : 'Project link coming soon';
  dialogLink.setAttribute('aria-disabled', String(!hasProjectUrl));
  dialogLink.tabIndex = hasProjectUrl ? 0 : -1;
  dialogLink.classList.toggle('is-disabled', !hasProjectUrl);
  dialog.showModal();
  document.body.classList.add('dialog-open');
}

document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;
    openProject(Number(card.dataset.project));
  });
});

document.querySelector('.dialog-close')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));
dialog?.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (!inside) dialog.close();
});


// WHAT I DO -> SELECTED WORK filter
const serviceLinks = [...document.querySelectorAll('.service-row[data-work-filter]')];
const projectCards = [...document.querySelectorAll('.project-card[data-work-type]')];
const workSection = document.querySelector('#work');
const workNote = document.querySelector('#work-note');
const projectGrid = document.querySelector('.project-grid');

const workFilterLabels = {
  all: 'A real team project that represents my current web development practice.',
  development: 'A Laravel project focused on building a database-driven web application.',
  uiux: 'A project where interface structure, layout, and usability are part of the build.'
};

function applyWorkFilter(filter = 'all', shouldScroll = false) {
  const activeFilter = workFilterLabels[filter] ? filter : 'all';

  projectGrid?.classList.toggle('is-filtered', activeFilter !== 'all');

  projectCards.forEach((card) => {
    const types = (card.dataset.workType || '').split(/\s+/).filter(Boolean);
    const visible = activeFilter === 'all' || types.includes(activeFilter);

    card.hidden = !visible;
    card.classList.toggle('is-filtered-out', !visible);

    // Restart the entrance animation only for cards that are currently shown.
    card.classList.remove('is-filter-enter');
    if (visible) {
      requestAnimationFrame(() => card.classList.add('is-filter-enter'));
    }
  });

  serviceLinks.forEach((link) => {
    const active = link.dataset.workFilter === activeFilter;
    link.classList.toggle('is-selected', active);
    link.setAttribute('aria-current', active ? 'true' : 'false');
    link.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  if (workNote) {
    workNote.textContent = workFilterLabels[activeFilter];
  }

  if (shouldScroll && workSection) {
    workSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

serviceLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    applyWorkFilter(link.dataset.workFilter || 'all', true);
  });
});

document.querySelector('[data-show-all-work]')?.addEventListener('click', () => {
  applyWorkFilter('all');
});

// The main Work navigation always returns to the complete project list.
document.querySelectorAll('.nav a[href="#work"]').forEach((link) => {
  link.addEventListener('click', () => applyWorkFilter('all'));
});

applyWorkFilter('all');

// Motion / interaction layer
const topbar = document.querySelector('.topbar');
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]:not(.nav-cta)')];
const sections = [...document.querySelectorAll('main section[id]')];

// Reveal sections and cards as they enter the viewport.
const revealTargets = [
  ...document.querySelectorAll('.section-heading'),
  ...document.querySelectorAll('.service-list'),
  ...document.querySelectorAll('.project-grid'),
  ...document.querySelectorAll('.about-grid'),
  ...document.querySelectorAll('.contact-left, .contact-right')
];

revealTargets.forEach((el) => {
  if (!el.classList.contains('reveal-stagger')) {
    el.classList.add('reveal');
  }
});

document.querySelectorAll('.service-list, .project-grid, .skill-list').forEach((el) => {
  el.classList.add('reveal-stagger');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

revealTargets.forEach((el) => revealObserver.observe(el));
document.querySelectorAll('.service-list, .project-grid, .skill-list').forEach((el) => revealObserver.observe(el));

// Sticky header state.
const updateHeader = () => {
  topbar?.classList.toggle('is-scrolled', window.scrollY > 18);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

// Active section indicator.
if (sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  sections.forEach((section) => sectionObserver.observe(section));
}

// Tiny pointer tilt on the profile image; disabled on touch devices.
const profile = document.querySelector('.profile-photo');
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (profile && canHover) {
  profile.addEventListener('pointermove', (event) => {
    const rect = profile.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    profile.style.transform = `perspective(700px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 3).toFixed(2)}deg)`;
  });

  profile.addEventListener('pointerleave', () => {
    profile.style.transform = '';
  });
}


dialogLink?.addEventListener('click', (event) => {
  if (dialogLink.classList.contains('is-disabled')) event.preventDefault();
});
