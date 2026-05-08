/* ============================================================
   SCROLL LOCK — always start at top on load
   ============================================================ */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
history.replaceState(null, '', location.pathname + location.search + '#home');
window.scrollTo(0, 0);

/* ============================================================
   TYPING EFFECT
   ============================================================ */
const typingEl = document.getElementById('typing-text');
const phrases = [
  'Web Developer',
  'Security Enthusiast',
  'Problem Solver',
  'Future Cybersecurity Specialist',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeSpeed = 80;
const deleteSpeed = 45;
const pauseAfterType = 1800;
const pauseAfterDelete = 400;

function typeLoop() {
  const current = phrases[phraseIndex];

  if (!isDeleting) {
    typingEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeLoop, pauseAfterType);
      return;
    }
  } else {
    typingEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeLoop, pauseAfterDelete);
      return;
    }
  }

  setTimeout(typeLoop, isDeleting ? deleteSpeed : typeSpeed);
}

typeLoop();

/* ============================================================
   NAVBAR — scroll effect + active link
   ============================================================ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // scrolled class for background
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // active link highlight
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

/* ============================================================
   MOBILE MENU
   ============================================================ */
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('open');
  });
});

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings revealed together
      const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
      siblings.forEach((el, idx) => {
        setTimeout(() => el.classList.add('visible'), idx * 100);
      });
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

setTimeout(() => {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}, 800);

/* ============================================================
   CONTACT FORM — client-side handling
   ============================================================ */
const form = document.getElementById('contact-form');
const btnText = document.getElementById('btn-text');
const formStatus = document.getElementById('form-status');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    setStatus('Please fill in all fields.', 'error');
    return;
  }
  if (!isValidEmail(email)) {
    setStatus('Please enter a valid email address.', 'error');
    return;
  }

  btnText.textContent = 'Sending...';
  form.querySelector('button').disabled = true;

  // Simulate send — replace with a real backend / EmailJS / Formspree call
  setTimeout(() => {
    setStatus('Message sent! I\'ll get back to you soon.', 'success');
    form.reset();
    btnText.textContent = 'Send Message';
    form.querySelector('button').disabled = false;
  }, 1500);
});

function setStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className = 'form-note ' + type;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================================
   HERO REVEAL ON LOAD
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  setTimeout(() => {
    window.scrollTo(0, 0);
    history.replaceState(null, '', location.pathname + location.search + '#home');
  }, 100);

  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 120);
  });

  initTerminal();
  initProjectsCarousel();
});

/* ============================================================
   PROJECTS CAROUSEL (mobile)
   ============================================================ */
function initProjectsCarousel() {
  const grid = document.querySelector('.projects-grid');
  const cta  = document.querySelector('.projects-cta');
  if (!grid || !cta) return;

  let dotsContainer = null;
  let scrollHandler = null;

  function buildCarousel() {
    if (window.innerWidth > 768) {
      teardown();
      return;
    }
    if (dotsContainer) return; // already built

    const cards = Array.from(grid.querySelectorAll('.project-card'));

    /* --- dots --- */
    dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';

    const dots = cards.map((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', 'Project ' + (i + 1));
      btn.addEventListener('click', () => {
        const cardW = cards[0].offsetWidth + 16; // card width + 1rem gap
        grid.scrollTo({ left: i * cardW, behavior: 'smooth' });
      });
      dotsContainer.appendChild(btn);
      return btn;
    });

    cta.parentNode.insertBefore(dotsContainer, cta);

    /* --- scroll → update dots --- */
    scrollHandler = () => {
      const cardW = cards[0].offsetWidth + 16;
      const idx   = Math.min(
        Math.round(grid.scrollLeft / cardW),
        dots.length - 1
      );
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    };
    grid.addEventListener('scroll', scrollHandler, { passive: true });
  }

  function teardown() {
    if (dotsContainer) { dotsContainer.remove(); dotsContainer = null; }
    if (scrollHandler)  { grid.removeEventListener('scroll', scrollHandler); scrollHandler = null; }
  }

  buildCarousel();
  window.addEventListener('resize', buildCarousel);
}

/* ============================================================
   CHATBOT TERMINAL
   ============================================================ */
function initTerminal() {
  const output   = document.getElementById('term-output');
  const input    = document.getElementById('term-input');
  const terminal = document.getElementById('terminal');

  if (!output || !input) return;

  /* ---- Knowledge base (multilingual rule-based engine) ---- */
  const rules = [
    {
      keys: ['hello','hi','hey','bonjour','salut','bonsoir','salam','ahlan','hola','yo','sup',
             'مرحبا','السلام عليكم','سلام','صباح الخير','مساء الخير','labas','lbas','wach labas'],
      reply: [
        "Hello! 👋 I'm Bilal's terminal assistant.",
        "Ask me anything about him — skills, projects, contact, and more.",
        "Type 'help' to see all topics."
      ]
    },
    {
      keys: ['who is bilal','tell me about bilal','about bilal','bilal touati','qui est bilal',
             'présente bilal','من هو بلال','شكون هو بلال','introduce','about you','about him','c\'est qui bilal'],
      reply: [
        "Bilal Touati is a Web Developer & Cybersecurity Student 👤",
        "Based in Morocco 🇲🇦 — he builds secure web apps and explores",
        "ethical hacking, IT infrastructure, and CTF challenges.",
        "Currently specializing in Cybersecurity."
      ]
    },
    {
      keys: ['skill','stack','technology','tools','compétence','outil','مهارة','مهارات','تقنية',
             'what do you know','what can','capable','tech stack'],
      reply: [
        "Bilal's core skills 🛠️",
        "  • Frontend     → HTML, CSS, JavaScript",
        "  • Backend      → Python, PHP, Node.js",
        "  • Security     → Kali Linux, Burp Suite, OWASP, Wireshark, Nmap, Metasploit",
        "  • Infra        → Docker, VMware, Proxmox, Hyper-V, VirtualBox",
        "  • Networking   → TCP/IP, DNS, DHCP, VPN, VLANs, Subnetting",
        "  • Tools        → Git, GitHub, VS Code, Linux CLI"
      ]
    },
    {
      keys: ['web','html','css','javascript','js','frontend','backend','développement web',
             'développeur','developer','website','site web','coding','programming','تطوير الويب',
             'برمجة','موقع','node','php'],
      reply: [
        "Bilal is a Web Developer 💻",
        "  • Frontend: HTML5, CSS3, JavaScript (ES6+)",
        "  • Backend:  Python, PHP, Node.js",
        "  • Tools:    Git, GitHub, VS Code",
        "He focuses on clean, responsive, and secure web interfaces."
      ]
    },
    {
      keys: ['cyber','security','ethical','pentest','owasp','burp','hacking','hack','nmap',
             'wireshark','metasploit','cybersécurité','sécurité','أمن','اختراق','سيبر',
             'penetration','vulnerability','exploit'],
      reply: [
        "Cybersecurity is Bilal's main passion 🔒",
        "  • Web app testing  — OWASP Top 10, Burp Suite",
        "  • Network security — Wireshark, Nmap, Metasploit",
        "  • Ethical hacking  — methodology & lab setups",
        "  • CTF competitions — HackTheBox, TryHackMe",
        "  • OS focus         — Kali Linux, Debian, Ubuntu"
      ]
    },
    {
      keys: ['ctf','capture the flag','hackthebox','tryhackme','hack the box','challenge','wargame'],
      reply: [
        "Bilal actively practices CTF challenges 🚩",
        "  • Platforms: HackTheBox, TryHackMe",
        "  • Categories: web exploitation, privilege escalation,",
        "    reverse engineering, network forensics",
        "  • Goal: sharpen real-world offensive & defensive skills"
      ]
    },
    {
      keys: ['project','built','made','created','portfolio','projet','مشروع','مشاريع',
             'lab','labo','réalisation','travail pratique','chi projet'],
      reply: [
        "Bilal's IT projects 💼",
        "  • Docker        — containerized app deployments",
        "  • Hyper-V       — Windows VM infrastructure",
        "  • VMware / ESXi — enterprise virtualization lab",
        "  • Proxmox VE    — open-source hypervisor cluster",
        "  • VirtualBox    — multi-OS test environments",
        "  • Network Topo  — Cisco Packet Tracer lab design",
        "  • Win. Defender — endpoint security configuration",
        "  • Portfolio     — this website you're on right now!"
      ]
    },
    {
      keys: ['certif','badge','credly','certification','شهادة','شهادات','diplôme certif',
             'credential','cisco cert','basis tech'],
      reply: [
        "Bilal's certifications 🏅",
        "  • Data Analytics Essentials     — Cisco",
        "  • Networking Basics             — Cisco",
        "  • Cybersecurity                 — Cisco",
        "  • BDSP Foundations 2.0          — Basis Technologies",
        "  • Data Essentials               — Basis Technologies",
        "  • Collaboration & Communication — Basis Technologies",
        "All verified on Credly — check the Certifications section ↑"
      ]
    },
    {
      keys: ['education','study','studied','school','degree','diploma','formation','études',
             'diplôme','تعليم','دراسة','دبلوم','bac+2','technicien spécialisé',
             'digital infrastructure','infra numérique'],
      reply: [
        "Bilal's education 🎓",
        "  • Diploma: Digital Infrastructure (Technicien Spécialisé)",
        "  • Currently specializing in Cybersecurity",
        "  • Self-learning via HackTheBox, TryHackMe & online courses"
      ]
    },
    {
      keys: ['experience','expérience','خبرة','تجربة','background','career','professional',
             'work experience','years of','parcours'],
      reply: [
        "Bilal's experience 📋",
        "  • IT infrastructure hands-on (VMware, Proxmox, Hyper-V)",
        "  • Web development (HTML, CSS, JS, Python)",
        "  • Network design & config (Cisco Packet Tracer)",
        "  • Cybersecurity labs & CTF competitions",
        "  • Self-taught ethical hacking & pentesting",
        "Open to internships and entry-level cybersecurity roles."
      ]
    },
    {
      keys: ['language','speak','langue','لغة','لغات','arabic','french','english','darija',
             'عربي','فرنسي','إنجليزي','دارجة','parle quoi','kin loughat'],
      reply: [
        "Languages Bilal speaks 🌍",
        "  • Arabic (Darija) — native",
        "  • French          — fluent",
        "  • English         — professional level"
      ]
    },
    {
      keys: ['github','repo','repository','open source','git','دي هاب','code source','code github'],
      reply: [
        "Bilal's GitHub 🐙",
        "→ github.com/Touati-bilal",
        "Find his scripts, configs, and lab experiments there."
      ]
    },
    {
      keys: ['linkedin','لينكدإن','réseau professionnel','profil linkedin','network linkedin'],
      reply: [
        "Connect with Bilal on LinkedIn 💼",
        "→ linkedin.com/in/bilal-touati-0884253a2"
      ]
    },
    {
      keys: ['contact','email','reach','phone','hire','message','joindre','تواصل','بريد',
             'هاتف','recruiter','recrut','embauche','disponible','chi mail','numéro'],
      reply: [
        "Reach Bilal here 📬",
        "  • Email    → bilal.touati.services@gmail.com",
        "  • Phone    → +212 770 878 144",
        "  • LinkedIn → linkedin.com/in/bilal-touati-0884253a2",
        "  • GitHub   → github.com/Touati-bilal",
        "",
        "Or scroll to the Contact section ↓"
      ]
    },
    {
      keys: ['cv','resume','curriculum','vitae','السيرة الذاتية','سيرة','mon cv','son cv'],
      reply: [
        "To get Bilal's CV, contact him directly 📄",
        "  • Email    → bilal.touati.services@gmail.com",
        "  • LinkedIn → linkedin.com/in/bilal-touati-0884253a2",
        "He'll be happy to share it with you!"
      ]
    },
    {
      keys: ['location','where','country','from','live','based','morocco','maroc','المغرب',
             'فين ساكن','fin kayn','région','ville','city'],
      reply: [
        "Bilal is based in Morocco 🇲🇦",
        "Open to remote opportunities worldwide 🌍"
      ]
    },
    {
      keys: ['available','open to work','job','position','role','internship','stage','freelance',
             'متاح','للتوظيف','recrut','cherche emploi','bghit nkhdm'],
      reply: [
        "Bilal is available for work ✅",
        "  • Open to internships & entry-level positions",
        "  • Remote-friendly — worldwide",
        "  • Focus: Cybersecurity, Web Dev, IT Infrastructure",
        "  • Email → bilal.touati.services@gmail.com"
      ]
    },
    {
      keys: ['virtualiz','vmware','proxmox','hyper-v','virtualbox','esxi','docker','container',
             'machine virtuelle','vm ','hypervisor'],
      reply: [
        "Virtualization — one of Bilal's core strengths 🖥️",
        "  • VMware Workstation & ESXi — enterprise hypervisor",
        "  • Proxmox VE               — open-source cluster",
        "  • Hyper-V                  — Windows virtualization",
        "  • VirtualBox               — test environments",
        "  • Docker                   — containerized apps"
      ]
    },
    {
      keys: ['network','networking','tcp','dns','dhcp','vlan','subnet','routing','cisco',
             'réseau','شبكة','شبكات','packet tracer','firewall','vpn','switching'],
      reply: [
        "Bilal's networking skills 🌐",
        "  • TCP/IP, DNS, DHCP, HTTP/S, VPN",
        "  • Subnetting and VLANs",
        "  • Cisco Packet Tracer — topology design",
        "  • Wireshark & Nmap   — traffic analysis & scanning",
        "  • Firewall configuration and network security"
      ]
    },
    {
      keys: ['python','script','automation','automatisation','أتمتة','سكريبت'],
      reply: [
        "Bilal uses Python 🐍 for:",
        "  • Automation scripts",
        "  • Security tools & exploits",
        "  • Backend web development",
        "  • Network scanning & data parsing"
      ]
    },
    {
      keys: ['linux','ubuntu','debian','centos','bash','terminal','command line','kali',
             'shell','تيرمينال'],
      reply: [
        "Bilal is very comfortable with Linux 🐧",
        "  • Kali Linux    — pentesting & security research",
        "  • Ubuntu/Debian — servers & dev environments",
        "  • CentOS        — enterprise infrastructure",
        "  • Daily terminal use for automation & security"
      ]
    },
    {
      keys: ['interest','hobby','passion','like','love','enjoy','loisir','اهتمام','هواية',
             'shi hobby','mzyan'],
      reply: [
        "Bilal is passionate about 🚀",
        "  • Cybersecurity & Ethical Hacking",
        "  • CTF Competitions",
        "  • Virtualization & Lab Infrastructure",
        "  • Web Development",
        "  • Continuous self-learning"
      ]
    },
    {
      keys: ['who are you','what are you','bot','robot','chatbot','artificial','من أنت',
             'شكون نت','c\'est quoi','t\'es quoi','les chkoun'],
      reply: [
        "I'm a rule-based terminal assistant built into Bilal's portfolio 🤖",
        "No AI or API — just smart keyword matching!",
        "Type 'help' to see all topics."
      ]
    },
    {
      keys: ['help','what can','topics','commands','menu','aide','مساعدة','عاون','chi haja',
             'ash kayndir','ashno tdir'],
      reply: [
        "Here's what you can ask me about:",
        "  • skills / web dev / python / linux",
        "  • cybersecurity / ctf / networking / virtualization",
        "  • projects / certifications / education / experience",
        "  • languages / location / availability",
        "  • github / linkedin / contact / cv",
        "",
        "Ask in English, French, Arabic, or Darija 🌍"
      ]
    },
    {
      keys: ['thank','thanks','merci','شكرا','شكراً','يعطيك الصحة','barak allaho fik',
             'thx','ty','شكراً جزيلاً','merci beaucoup'],
      reply: ["You're welcome! 😊 Feel free to ask anything else about Bilal."]
    },
    {
      keys: ['bye','goodbye','ciao','au revoir','bslama','see you','مع السلامة','بسلامة',
             'وداعاً','a bientôt'],
      reply: ["Goodbye! 👋 Don't forget to check the Projects and Contact sections!"]
    }
  ];

  /* ---- Reply matcher ---- */
  let missCount = 0;

  function getReply(msg) {
    const lower = msg.toLowerCase();
    for (const rule of rules) {
      if (rule.keys.some(k => lower.includes(k))) {
        missCount = 0;
        return rule.reply;
      }
    }
    missCount++;
    const fallback = [
      "Hmm, I'm not sure about that yet 🤔",
      "But I can tell you about Bilal's skills, projects,",
      "education, or how to contact him."
    ];
    if (missCount >= 3) {
      missCount = 0;
      return [
        ...fallback,
        "",
        "Try: skills, projects, cybersecurity, contact, GitHub,",
        "education, certifications, languages, cv, or 'help'."
      ];
    }
    return fallback;
  }

  /* ---- DOM helpers ---- */
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function scrollBottom() { output.scrollTop = output.scrollHeight; }

  function addSpacer() {
    const s = document.createElement('div');
    s.className = 'term-spacer';
    output.appendChild(s);
  }

  function addUserLine(text) {
    const el = document.createElement('div');
    el.className = 'term-line term-user-line';
    el.innerHTML = `<span class="term-you">You</span> ${escapeHtml(text)}`;
    output.appendChild(el);
    scrollBottom();
  }

  function showTypingDots() {
    const el = document.createElement('div');
    el.className = 'term-line term-typing-dots';
    el.id = 'term-dots';
    el.innerHTML = '<span class="tdot"></span><span class="tdot"></span><span class="tdot"></span>';
    output.appendChild(el);
    scrollBottom();
    return el;
  }

  function removeTypingDots() {
    const el = document.getElementById('term-dots');
    if (el) el.remove();
  }

  /* ---- Typing animation ---- */
  function typeLines(lines) {
    let li = 0;

    function nextLine() {
      if (li >= lines.length) {
        addSpacer();
        scrollBottom();
        input.disabled = false;
        return;
      }

      const text = lines[li++];

      if (text === '') {
        addSpacer();
        setTimeout(nextLine, 40);
        return;
      }

      const el = document.createElement('div');
      el.className = 'term-line term-bot-line';
      output.appendChild(el);

      let ci = 0;
      function typeChar() {
        el.textContent = text.slice(0, ++ci);
        scrollBottom();
        if (ci < text.length) setTimeout(typeChar, 14);
        else setTimeout(nextLine, 50);
      }
      typeChar();
    }

    nextLine();
  }

  /* ---- Handle submitted message ---- */
  let lastMsg = '';

  function handleMessage(raw) {
    const msg = raw.trim();
    if (!msg) return;

    lastMsg = msg;

    if (msg.toLowerCase() === 'clear') {
      output.innerHTML = '';
      scrollBottom();
      return;
    }

    addUserLine(msg);
    input.disabled = true;

    const reply = getReply(msg);
    showTypingDots();

    setTimeout(() => {
      removeTypingDots();
      typeLines(reply);
    }, 400 + Math.random() * 300);
  }

  /* ---- Input events ---- */
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      handleMessage(val);
      input.value = '';
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (lastMsg) input.value = lastMsg;
    }
  });

  terminal.addEventListener('click', () => input.focus());

  /* ---- Boot message ---- */
  setTimeout(() => {
    typeLines([
      "Hi! I'm Bilal's assistant 🤖",
      "You can ask me about:",
      "  • skills          — tech stack & tools",
      "  • projects        — IT labs & builds",
      "  • cybersecurity   — hacking, CTF, tools",
      "  • education       — diploma & training",
      "  • experience      — background & career",
      "  • certifications  — Cisco, Basis Technologies",
      "  • languages       — EN / FR / AR / Darija",
      "  • contact         — email, phone, LinkedIn",
      "  • cv              — how to get his resume",
      "",
      "Or just type any question about Bilal 👇"
    ]);
  }, 500);
}
