/**
 * Cyber Security Portfolio Script
 * Vamsi Sai Krishna Routhu - Cyber Security Analyst
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initNetworkCanvas();
  initMobileNav();
  initScrollSpy();
  initSkillFilters();
});

/* ==========================================================================
   1. LIVE TELEMETRY CLOCK
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('live-time');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const utcString = now.toUTCString().split(' ')[4] + ' UTC';
    clockEl.textContent = utcString;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   2. INTERACTIVE CYBER CANVAS (NETWORK PARTICLES)
   ========================================================================== */
function initNetworkCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 16000), 75);

  const mouse = {
    x: null,
    y: null,
    radius: 140
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 1.6 + 1;
      this.baseColor = Math.random() > 0.8 ? '#00f2fe' : '#00ff66';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const fx = (dx / dist) * force * 1.5;
          const fy = (dy / dist) * force * 1.5;
          this.x -= fx;
          this.y -= fy;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.baseColor;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = 1 - dist / 110;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 255, 102, ${alpha * 0.22})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   3. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!hamburgerBtn || !mobileNav) return;

  function toggleDrawer() {
    mobileNav.classList.toggle('open');
  }

  hamburgerBtn.addEventListener('click', toggleDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', toggleDrawer);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
    });
  });
}

/* ==========================================================================
   4. SCROLL SPY & STICKY HEADER SHADOW
   ========================================================================== */
function initScrollSpy() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;

    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   5. SKILL FILTER TABS
   ========================================================================== */
function initSkillFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-cat-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. PROJECT MODAL SYSTEM
   ========================================================================== */
const projectData = {
  forensic: {
    badge: 'PROJECT // 01',
    type: 'INCIDENT FORENSICS & THREAT DETECTION',
    title: 'LOG BASED DIGITAL FORENSIC TOOL FOR INCIDENT ANALYSIS',
    subtitle: 'Automated Log Analysis & Threat Identification',
    description: `
      <p style="color: #cbd5e1; margin-bottom: 16px; line-height: 1.7;">
        Developed a specialized digital forensic application leveraging Python and machine learning algorithms to ingest, parse, and systematically analyze complex system logs for anomaly detection and incident response acceleration.
      </p>
      <h4 style="font-family: var(--font-heading); color: #fff; font-size: 1.1rem; margin-bottom: 10px;">
        <i class="fa-solid fa-list-check" style="color: var(--accent-green); margin-right: 6px;"></i> Technical Breakdown (From Resume)
      </h4>
      <ul style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; color: #94a3b8; font-size: 0.9rem;">
        <li><i class="fa-solid fa-chevron-right" style="color: var(--accent-green); margin-right: 6px;"></i> Developed a Python-based digital forensic tool to analyze system logs and identify security-related events.</li>
        <li><i class="fa-solid fa-chevron-right" style="color: var(--accent-green); margin-right: 6px;"></i> Implemented machine learning techniques for anomaly detection and threat identification in log data.</li>
        <li><i class="fa-solid fa-chevron-right" style="color: var(--accent-green); margin-right: 6px;"></i> Automated log analysis to support incident response and digital forensic investigations efficiently.</li>
      </ul>
      <div style="background: rgba(0, 255, 102, 0.05); border: 1px dashed rgba(0, 255, 102, 0.3); border-radius: 4px; padding: 12px 16px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-green);">
        <i class="fa-solid fa-terminal"></i> Status: Research Implementation Complete // Python Architecture
      </div>
    `,
    tags: ['Python', 'Digital Forensics', 'Machine Learning', 'Log Analysis', 'Anomaly Detection', 'Incident Response']
  },
  keystroke: {
    badge: 'PROJECT // 02',
    type: 'EDUCATIONAL / SECURITY RESEARCH PROJECT',
    title: 'KEYSTROKE MONITORING SECURITY RESEARCH TOOL',
    subtitle: 'Educational Study on Input Hooking & Encrypted Logs',
    description: `
      <p style="color: #cbd5e1; margin-bottom: 16px; line-height: 1.7;">
        An educational security project created to explore how keystroke logging mechanisms work at the system level, study input event capture dynamics, and implement safe, encrypted storage mechanisms for audit logs.
      </p>
      <h4 style="font-family: var(--font-heading); color: #fff; font-size: 1.1rem; margin-bottom: 10px;">
        <i class="fa-solid fa-list-check" style="color: var(--accent-green); margin-right: 6px;"></i> Technical Breakdown (From Resume)
      </h4>
      <ul style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; color: #94a3b8; font-size: 0.9rem;">
        <li><i class="fa-solid fa-chevron-right" style="color: var(--accent-green); margin-right: 6px;"></i> Developed a Python-based keylogger for educational purposes to understand keystroke logging mechanisms.</li>
        <li><i class="fa-solid fa-chevron-right" style="color: var(--accent-green); margin-right: 6px;"></i> Implemented keyboard event capturing using Python libraries.</li>
        <li><i class="fa-solid fa-chevron-right" style="color: var(--accent-green); margin-right: 6px;"></i> Designed functionality to log keystrokes securely into encrypted log files.</li>
      </ul>
      <div style="background: rgba(255, 170, 0, 0.08); border: 1px dashed rgba(255, 170, 0, 0.4); border-radius: 4px; padding: 12px 16px; font-family: var(--font-mono); font-size: 0.8rem; color: #ffaa00;">
        <i class="fa-solid fa-shield-halved"></i> Ethical Disclaimer: Strictly for educational analysis & understanding endpoint threat mechanics.
      </div>
    `,
    tags: ['Python', 'Keystroke Dynamics', 'Event Capturing', 'File Encryption', 'Security Research', 'Ethical Hacking']
  }
};

function openProjectModal(key) {
  const modal = document.getElementById('project-modal');
  const container = document.getElementById('modal-content');
  const data = projectData[key];

  if (!modal || !container || !data) return;

  let tagsHtml = data.tags
    .map((t) => `<span class="tech-tag" style="margin-right: 6px; margin-bottom: 6px; display: inline-block;">${t}</span>`)
    .join('');

  container.innerHTML = `
    <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-green); letter-spacing: 0.1em; margin-bottom: 6px;">
      ${data.badge} • ${data.type}
    </div>
    <h2 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; color: #fff; margin-bottom: 6px;">
      ${data.title}
    </h2>
    <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-green); margin-bottom: 20px;">
      ${data.subtitle}
    </div>
    <div style="margin-bottom: 24px;">
      ${data.description}
    </div>
    <div style="border-top: 1px solid var(--border-dim); padding-top: 16px; margin-bottom: 20px;">
      <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px;">TECHNOLOGY STACK:</div>
      <div>${tagsHtml}</div>
    </div>
    <div style="text-align: right;">
      <button class="btn-cyber-outline" onclick="closeProjectModal()">
        <i class="fa-solid fa-xmark"></i> CLOSE DETAILS
      </button>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function closeModalOnOverlay(e) {
  if (e.target.id === 'project-modal') {
    closeProjectModal();
  }
}

/* ==========================================================================
   7. COPY TO CLIPBOARD & TOAST NOTIFICATION
   ========================================================================== */
function copyToClipboard(text, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg || 'Copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy');
  });
}

function showToast(msg) {
  const toast = document.getElementById('cyber-toast');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   8. FORM SUBMISSION SIMULATION
   ========================================================================== */
function handleFormSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form || !feedback) return;

  const submitBtn = form.querySelector('.submit-btn');
  const originalText = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> <span>ENCRYPTING & SENDING...</span>`;

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    form.reset();

    feedback.className = 'form-feedback-msg success';
    feedback.innerHTML = `
      <i class="fa-solid fa-shield-check"></i>
      <strong>Transmission Acknowledged:</strong> Your message has been encrypted and prepared for transmission to Vamsi Sai Krishna Routhu.
    `;

    showToast('Message transmitted securely!');
  }, 1200);
}
