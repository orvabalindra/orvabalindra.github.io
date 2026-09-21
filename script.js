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


/* =========================
   PROJECT DATA
========================= */

const projects = [
  {
    index: '01',
    title: 'Blodora — Blood Donation Management System',

    text:
      'Sistem manajemen donor darah yang dikembangkan secara berkelompok menggunakan Laravel. Saya berkontribusi pada dashboard admin, pengelolaan data pendonor, CRUD, routing, Blade, authentication berbasis role, UI dashboard, navigasi, dan alur halaman.',

    role: 'Web Developer',
    status: 'Team Project',
    stack: 'Laravel · PHP · MySQL · Bootstrap',

    image: 'assets/projects/blodora-dashboard.png',
    imageAlt: 'Dashboard admin Blodora',

    url: 'https://github.com/orvabalindra/blodora-app',
    linkText: 'Open repository ↗'
  },

  {
    index: '02',
    title: 'Portfolio Website',

    text:
      'Website portfolio pribadi untuk menampilkan profil, skills, dan project. Website dikembangkan menggunakan HTML, CSS, dan JavaScript dengan responsive layout, navigasi, project showcase, dan beberapa elemen interaktif.',

    role: 'Frontend Developer',
    status: 'Personal Project',
    stack: 'HTML · CSS · JavaScript',

    image: 'assets/projects/portfolio-website.png',
    imageAlt: 'Portfolio website Mochammad Risky Orva Balindra',

    url: 'https://orvabalindra.github.io/',
    linkText: 'Open website ↗'
  }
];


/* =========================
   PROJECT DIALOG
========================= */

const dialog = document.querySelector('#project-dialog');

const dialogIndex = document.querySelector('#dialog-index');
const dialogImage = document.querySelector('#dialog-image');
const dialogTitle = document.querySelector('#dialog-title');
const dialogText = document.querySelector('#dialog-text');
const dialogLink = document.querySelector('#dialog-link');
const dialogDetails = document.querySelector('#dialog-details');


function openProject(index) {
  const project = projects[index];

  if (!project || !dialog) return;


  // Index
  if (dialogIndex) {
    dialogIndex.textContent = project.index;
  }


  // Image
  if (dialogImage) {
    dialogImage.src = project.image;
    dialogImage.alt = project.imageAlt;
  }


  // Title
  if (dialogTitle) {
    dialogTitle.textContent = project.title;
  }


  // Description
  if (dialogText) {
    dialogText.textContent = project.text;
  }


  // Details
  if (dialogDetails) {
    dialogDetails.innerHTML = `
      <div>
        <span>ROLE</span>
        <strong>${project.role}</strong>
      </div>

      <div>
        <span>STATUS</span>
        <strong>${project.status}</strong>
      </div>

      <div>
        <span>STACK</span>
        <strong>${project.stack}</strong>
      </div>
    `;
  }


  // Project link
  if (dialogLink) {

    const hasProjectUrl =
      Boolean(project.url && project.url !== '#');

    dialogLink.href = hasProjectUrl
      ? project.url
      : '#';

    dialogLink.textContent =
      hasProjectUrl
        ? project.linkText
        : 'Project link coming soon';

    dialogLink.setAttribute(
      'aria-disabled',
      String(!hasProjectUrl)
    );

    dialogLink.tabIndex =
      hasProjectUrl ? 0 : -1;

    dialogLink.classList.toggle(
      'is-disabled',
      !hasProjectUrl
    );
  }


  dialog.showModal();

  document.body.classList.add('dialog-open');
}


/* =========================
   PROJECT CARD CLICK
========================= */

document.querySelectorAll('.project-card').forEach((card) => {

  card.addEventListener('click', (event) => {

    // Jangan buka modal kalau yang diklik adalah link.
    if (event.target.closest('a')) return;

    const projectIndex =
      Number(card.dataset.project);

    openProject(projectIndex);
  });

});


/* =========================
   CLOSE DIALOG
========================= */

document
  .querySelector('.dialog-close')
  ?.addEventListener('click', () => {
    dialog?.close();
  });


dialog?.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
});


/* Klik area gelap di luar modal untuk menutup */
dialog?.addEventListener('click', (event) => {

  const rect = dialog.getBoundingClientRect();

  const inside =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;

  if (!inside) {
    dialog.close();
  }

});


/* =========================
   WHAT I DO → SELECTED WORK
   FILTER
========================= */

const serviceLinks = [
  ...document.querySelectorAll(
    '.service-row[data-work-filter]'
  )
];

const projectCards = [
  ...document.querySelectorAll(
    '.project-card[data-work-type]'
  )
];

const workSection =
  document.querySelector('#work');

const workNote =
  document.querySelector('#work-note');

const projectGrid =
  document.querySelector('.project-grid');


const workFilterLabels = {

  all:
    'Projects that show my experience through school and personal practice.',

  development:
    'Projects focused on frontend web development and web application development.',

  uiux:
    'Projects where interface structure, layout, responsive design, and usability are part of the build.'
};


function applyWorkFilter(
  filter = 'all',
  shouldScroll = false
) {

  const activeFilter =
    workFilterLabels[filter]
      ? filter
      : 'all';


  projectGrid?.classList.toggle(
    'is-filtered',
    activeFilter !== 'all'
  );


  projectCards.forEach((card) => {

    const types =
      (card.dataset.workType || '')
        .split(/\s+/)
        .filter(Boolean);

    const visible =
      activeFilter === 'all' ||
      types.includes(activeFilter);


    card.hidden = !visible;

    card.classList.toggle(
      'is-filtered-out',
      !visible
    );


    // Restart entrance animation
    card.classList.remove(
      'is-filter-enter'
    );


    if (visible) {

      requestAnimationFrame(() => {
        card.classList.add(
          'is-filter-enter'
        );
      });

    }

  });


  serviceLinks.forEach((link) => {

    const active =
      link.dataset.workFilter === activeFilter;

    link.classList.toggle(
      'is-selected',
      active
    );

    link.setAttribute(
      'aria-current',
      active ? 'true' : 'false'
    );

    link.setAttribute(
      'aria-pressed',
      active ? 'true' : 'false'
    );

  });


  if (workNote) {
    workNote.textContent =
      workFilterLabels[activeFilter];
  }


  if (shouldScroll && workSection) {

    workSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

  }

}


/* Service filter click */

serviceLinks.forEach((link) => {

  link.addEventListener('click', (event) => {

    event.preventDefault();

    applyWorkFilter(
      link.dataset.workFilter || 'all',
      true
    );

  });

});


/* View selected work */

document
  .querySelector('[data-show-all-work]')
  ?.addEventListener('click', () => {

    applyWorkFilter('all');

  });


/* Main Work navigation */

document
  .querySelectorAll('.nav a[href="#work"]')
  .forEach((link) => {

    link.addEventListener('click', () => {

      applyWorkFilter('all');

    });

  });


/* Initial filter */

applyWorkFilter('all');


/* =========================
   MOTION / INTERACTION
========================= */

const topbar =
  document.querySelector('.topbar');

const navLinks = [
  ...document.querySelectorAll(
    '.nav a[href^="#"]:not(.nav-cta)'
  )
];

const sections = [
  ...document.querySelectorAll(
    'main section[id]'
  )
];


/* =========================
   REVEAL ANIMATION
========================= */

const revealTargets = [

  ...document.querySelectorAll(
    '.section-heading'
  ),

  ...document.querySelectorAll(
    '.service-list'
  ),

  ...document.querySelectorAll(
    '.project-grid'
  ),

  ...document.querySelectorAll(
    '.about-grid'
  ),

  ...document.querySelectorAll(
    '.contact-left, .contact-right'
  )

];


revealTargets.forEach((el) => {

  if (!el.classList.contains('reveal-stagger')) {
    el.classList.add('reveal');
  }

});


document
  .querySelectorAll(
    '.service-list, .project-grid, .skill-list'
  )
  .forEach((el) => {

    el.classList.add('reveal-stagger');

  });


const revealObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add(
          'is-visible'
        );

        revealObserver.unobserve(
          entry.target
        );

      });

    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px'
    }
  );


revealTargets.forEach((el) => {
  revealObserver.observe(el);
});


document
  .querySelectorAll(
    '.service-list, .project-grid, .skill-list'
  )
  .forEach((el) => {

    revealObserver.observe(el);

  });


/* =========================
   STICKY HEADER
========================= */

const updateHeader = () => {

  topbar?.classList.toggle(
    'is-scrolled',
    window.scrollY > 18
  );

};


updateHeader();

window.addEventListener(
  'scroll',
  updateHeader,
  {
    passive: true
  }
);


/* =========================
   ACTIVE NAV SECTION
========================= */

if (
  sections.length &&
  navLinks.length
) {

  const sectionObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {

            link.classList.toggle(
              'is-active',
              link.getAttribute('href') ===
                `#${entry.target.id}`
            );

          });

        });

      },
      {
        rootMargin:
          '-35% 0px -55% 0px',

        threshold: 0
      }
    );


  sections.forEach((section) => {

    sectionObserver.observe(section);

  });

}


/* =========================
   PROFILE IMAGE TILT
========================= */

const profile =
  document.querySelector('.profile-photo');

const canHover =
  window.matchMedia(
    '(hover: hover) and (pointer: fine)'
  ).matches;


if (profile && canHover) {

  profile.addEventListener(
    'pointermove',
    (event) => {

      const rect =
        profile.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
          rect.width -
        0.5;

      const y =
        (event.clientY - rect.top) /
          rect.height -
        0.5;

      profile.style.transform =
        `perspective(700px)
         rotateX(${(-y * 3).toFixed(2)}deg)
         rotateY(${(x * 3).toFixed(2)}deg)`;

    }
  );


  profile.addEventListener(
    'pointerleave',
    () => {

      profile.style.transform = '';

    }
  );

}


/* =========================
   DISABLED PROJECT LINK
========================= */

dialogLink?.addEventListener(
  'click',
  (event) => {

    if (
      dialogLink.classList.contains(
        'is-disabled'
      )
    ) {

      event.preventDefault();

    }

  }
);

