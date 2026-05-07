/* ============================================================
   SCROLL LOCK — always start at top on load
   ============================================================ */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname + window.location.search);
}
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

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   SKILL BAR ANIMATION
   ============================================================ */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => barObserver.observe(el));

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

  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 120);
  });

  initTerminal();
});

/* ============================================================
   CHATBOT TERMINAL
   ============================================================ */
function initTerminal() {
  const output   = document.getElementById('term-output');
  const input    = document.getElementById('term-input');
  const terminal = document.getElementById('terminal');

  if (!output || !input) return;

  /* ---- Knowledge base ---- */
  const rules = [
    {
      keys: ['hello', 'hi', 'hey', 'bonjour', 'salam', 'salut', 'hola', 'bonsoir', 'yo', 'sup'],
      reply: [
        "Hello! 👋 I'm Bilal's terminal assistant.",
        "Ask me anything about him — skills, projects, contact, and more."
      ]
    },
    {
      keys: ['thank', 'thanks', 'merci', 'shukran', 'thx'],
      reply: ["You're welcome! 😊 Feel free to ask anything else."]
    },
    {
      keys: ['bye', 'goodbye', 'ciao', 'au revoir', 'bslama', 'see you'],
      reply: ["Goodbye! 👋 Don't forget to check the Projects and Contact sections!"]
    },
    {
      keys: ['who are you', 'what are you', 'introduce yourself'],
      reply: [
        "I'm a simple chatbot built into Bilal's portfolio 🤖",
        "I can answer questions about his skills, projects, background, and more."
      ]
    },
    {
      keys: ['who is bilal', 'tell me about bilal', 'about bilal', 'bilal touati'],
      reply: [
        "Bilal Touati is a Web Developer & Cybersecurity Student 👤",
        "Based in Morocco, he builds secure web apps and explores",
        "ethical hacking, IT infrastructure, and CTF challenges."
      ]
    },
    {
      keys: ['python'],
      reply: [
        "Bilal uses Python 🐍 for:",
        "  • Automation scripts",
        "  • Security tooling & exploit development",
        "  • Backend web development",
        "  • Data parsing and network tools"
      ]
    },
    {
      keys: ['linux', 'kali', 'ubuntu', 'debian'],
      reply: [
        "Bilal is comfortable with Linux 🐧",
        "  • Kali Linux    — pentesting & security research",
        "  • Ubuntu/Debian — servers and dev environments",
        "  • CentOS        — enterprise infrastructure",
        "He uses the terminal daily for automation and security work."
      ]
    },
    {
      keys: ['network', 'networking', 'tcp', 'ip', 'dns', 'wireshark'],
      reply: [
        "Bilal has solid networking fundamentals 🌐",
        "  • TCP/IP, DNS, DHCP, HTTP/S",
        "  • Network scanning: Nmap & Wireshark",
        "  • Subnetting and VLANs",
        "  • Configuring routers and firewalls in lab setups"
      ]
    },
    {
      keys: ['virtualiz', 'vmware', 'proxmox', 'hyper-v', 'virtualbox', 'esxi'],
      reply: [
        "Virtualization is one of Bilal's core strengths 🖥️",
        "  • VMware Workstation & ESXi",
        "  • Proxmox VE — home lab & server clustering",
        "  • Hyper-V     — Windows virtualisation",
        "  • VirtualBox  — rapid testing environments",
        "  • Docker      — containerization & deployment"
      ]
    },
    {
      keys: ['skill', 'stack', 'language', 'technology', 'tools', 'know', 'html', 'css', 'javascript'],
      reply: [
        "Bilal's skill set:",
        "  • Frontend  → HTML, CSS, JavaScript",
        "  • Backend   → Python, PHP, Node.js",
        "  • Security  → Kali, Burp Suite, OWASP, Wireshark",
        "  • Infra     → Docker, VMware, Proxmox, Hyper-V",
        "  • Tools     → Git, GitHub, VS Code"
      ]
    },
    {
      keys: ['cyber', 'security', 'ethical', 'pentest', 'owasp', 'burp', 'hacking', 'hack'],
      reply: [
        "Cybersecurity is Bilal's main focus 🔒",
        "  • Web app testing (OWASP Top 10, Burp Suite)",
        "  • Network security & traffic analysis (Wireshark, Nmap)",
        "  • Ethical hacking methodology",
        "  • Active participation in CTF competitions"
      ]
    },
    {
      keys: ['ctf', 'capture the flag', 'challenge', 'hackthebox', 'tryhackme'],
      reply: [
        "Bilal actively practices CTF challenges 🚩",
        "  • Platforms: HackTheBox, TryHackMe",
        "  • Focus: web exploitation, privilege escalation,",
        "    reverse engineering, network forensics",
        "  • Goal: sharpen real-world offensive/defensive skills"
      ]
    },
    {
      keys: ['project', 'built', 'made', 'created', 'work', 'docker', 'container'],
      reply: [
        "Bilal's IT projects 💻",
        "  • Docker        — containerized app deployments",
        "  • Hyper-V       — Windows VM infrastructure",
        "  • VMware / ESXi — enterprise virtualisation lab",
        "  • Proxmox VE    — open-source hypervisor cluster",
        "  • VirtualBox    — multi-OS test environments"
      ]
    },
    {
      keys: ['github', 'repo', 'repository', 'code', 'open source'],
      reply: [
        "Bilal's GitHub 🐙",
        "→ github.com/Touati-bilal",
        "Find his projects, scripts, and experiments there."
      ]
    },
    {
      keys: ['linkedin'],
      reply: [
        "Connect with Bilal on LinkedIn 💼",
        "→ linkedin.com/in/bilal-touati-0884253a2"
      ]
    },
    {
      keys: ['contact', 'email', 'reach', 'phone', 'hire', 'message', 'available'],
      reply: [
        "Reach Bilal here:",
        "  • Email    → bilal.touati.services@gmail.com",
        "  • Phone    → +212 770 878 144",
        "  • LinkedIn → linkedin.com/in/bilal-touati-0884253a2",
        "  • GitHub   → github.com/Touati-bilal",
        "",
        "Or scroll down to the Contact section ↓"
      ]
    },
    {
      keys: ['location', 'where', 'country', 'from', 'live', 'based', 'morocco'],
      reply: [
        "Bilal is based in Morocco 🇲🇦",
        "Open to remote opportunities worldwide."
      ]
    },
    {
      keys: ['education', 'study', 'studied', 'school', 'degree', 'diploma', 'digital infrastructure'],
      reply: [
        "Bilal completed his studies in Digital Infrastructure 🎓",
        "Currently specializing in Cybersecurity."
      ]
    },
    {
      keys: ['interest', 'hobby', 'passion', 'like', 'love', 'enjoy'],
      reply: [
        "Bilal is passionate about 🚀",
        "  • Cybersecurity & Ethical Hacking",
        "  • CTF Challenges",
        "  • Virtualization & Infrastructure",
        "  • Open-source contributions"
      ]
    },
    {
      keys: ['job', 'role', 'position', 'title', 'developer', 'student', 'career'],
      reply: [
        "Bilal is a Web Developer & Cybersecurity Student 🎯",
        "He builds clean, responsive web interfaces while focusing on",
        "secure development practices and IT infrastructure."
      ]
    },
    {
      keys: ['help', 'what can', 'topics', 'commands', 'ask', 'menu'],
      reply: [
        "Topics you can ask about:",
        "  • skills / html / css / javascript / python",
        "  • linux / networking / virtualization",
        "  • cybersecurity / ctf",
        "  • projects / github / linkedin",
        "  • contact / location / education",
        "",
        "Just type naturally — I'll do my best! 🤖"
      ]
    }
  ];

  /* ---- Reply matcher with error counter ---- */
  let errorCount = 0;

  function getReply(msg) {
    const lower = msg.toLowerCase();
    for (const rule of rules) {
      if (rule.keys.some(k => lower.includes(k))) {
        errorCount = 0;
        return rule.reply;
      }
    }
    errorCount++;
    if (errorCount >= 3) {
      errorCount = 0;
      return [
        "Hmm, I'm not sure about that yet 🤔",
        "But I can tell you about Bilal's skills, projects, or how to contact him.",
        "",
        "Try asking about: skills, projects, contact, GitHub, LinkedIn,",
        "Linux, networking, virtualization, Python, cybersecurity."
      ];
    }
    return [
      "Hmm, I'm not sure about that yet 🤔",
      "But I can tell you about Bilal's skills, projects, or how to contact him."
    ];
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
        input.focus();
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
    }, 500 + Math.random() * 300);
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
      "Hi there! 👋 I'm Bilal's assistant.",
      "Ask me anything — skills, projects, contact, and more.",
      "Type 'help' to see all topics."
    ]);
  }, 500);
}
