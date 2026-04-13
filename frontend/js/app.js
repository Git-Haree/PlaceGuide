/**
 * PlaceIQ — app.js
 * Full frontend application logic
 * Author: PlaceIQ Team
 */

// ============================================================
// CONFIGURATION — Update BASE_URL to your Railway URL for prod
// ============================================================
const BASE_URL = 'https://placeguide-production.up.railway.app'; // Production Railway URL

// ============================================================
// GLOBAL STATE
// ============================================================
const state = {
  currentStep: 1,
  skillTags: [],
  selectedCompanies: [],
  allCompanies: [],
  analysisResult: null,
  profileId: null,
  timerInterval: null,
  timerRunning: false,
  timerSeconds: 120,
  mockTopic: 'all',
  mockQCount: 0,
  compareList: [],
  radarCharts: {},
  overviewChart: null
};

// ============================================================
// COMPANY DATA (fallback when API unavailable)
// ============================================================
const FALLBACK_COMPANIES = [
  { name: 'TCS', category: 'Service' }, { name: 'Infosys', category: 'Service' },
  { name: 'Wipro', category: 'Service' }, { name: 'Cognizant', category: 'Service' },
  { name: 'HCL', category: 'Service' }, { name: 'Capgemini', category: 'Service' },
  { name: 'Tech Mahindra', category: 'Service' }, { name: 'Mphasis', category: 'Service' },
  { name: 'LTIMindtree', category: 'Service' },
  { name: 'Zoho', category: 'Product' }, { name: 'Freshworks', category: 'Product' },
  { name: "BYJU'S", category: 'Product' }, { name: 'Razorpay', category: 'Product' },
  { name: 'Swiggy', category: 'Product' }, { name: 'Zomato', category: 'Product' },
  { name: 'Meesho', category: 'Product' }, { name: 'PhonePe', category: 'Product' },
  { name: 'Paytm', category: 'Product' },
  { name: 'Amazon', category: 'MNC' }, { name: 'Google', category: 'MNC' },
  { name: 'Microsoft', category: 'MNC' }, { name: 'Meta', category: 'MNC' },
  { name: 'Adobe', category: 'MNC' }, { name: 'Salesforce', category: 'MNC' },
  { name: 'Oracle', category: 'MNC' }, { name: 'SAP', category: 'MNC' },
  { name: 'IBM', category: 'MNC' }, { name: 'Accenture', category: 'MNC' },
  { name: 'Deloitte', category: 'MNC' }, { name: 'Walmart Global Tech', category: 'MNC' },
  { name: 'Startup General', category: 'Startup' }, { name: 'Ola', category: 'Startup' },
  { name: 'Nykaa', category: 'Startup' }, { name: 'Groww', category: 'Startup' },
  { name: 'CRED', category: 'Startup' }, { name: 'Dunzo', category: 'Startup' },
  { name: 'Postman', category: 'Startup' }, { name: 'Atlassian', category: 'Startup' },
  { name: 'Flipkart', category: 'Startup' }
];

// Company icons
const COMPANY_ICONS = {
  'TCS': '🏢', 'Infosys': '💼', 'Wipro': '🌐', 'Cognizant': '☁️',
  'HCL': '⚙️', 'Capgemini': '🔷', 'Tech Mahindra': '📱', 'Mphasis': '🏦',
  'LTIMindtree': '🌿', 'Zoho': '🔵', 'Freshworks': '🌸', "BYJU'S": '📚',
  'Razorpay': '💳', 'Swiggy': '🍕', 'Zomato': '🍔', 'Meesho': '🛍️',
  'PhonePe': '📲', 'Paytm': '💰', 'Amazon': '📦', 'Google': '🔍',
  'Microsoft': '🪟', 'Meta': '👥', 'Adobe': '🎨', 'Salesforce': '☁️',
  'Oracle': '🏛️', 'SAP': '💼', 'IBM': '🤖', 'Accenture': '🌊',
  'Deloitte': '⬛', 'Walmart Global Tech': '🛒', 'Startup General': '🚀',
  'Ola': '🚗', 'Nykaa': '💄', 'Groww': '📈', 'CRED': '💎',
  'Dunzo': '🛵', 'Postman': '📮', 'Atlassian': '🔧', 'Flipkart': '🛒'
};

// ============================================================
// MOCK INTERVIEW QUESTION BANK
// ============================================================
const QUESTIONS = {
  dsa: [
    'Explain the difference between Array and Linked List. When would you choose one over the other?',
    'How does a Hash Map work internally? What is a collision and how is it handled?',
    'What is dynamic programming? Explain with the Fibonacci sequence example.',
    'Explain Binary Search. What is its time complexity and when does it fail?',
    'What is a Binary Search Tree? How do you perform in-order, pre-order, and post-order traversal?',
    'Reverse a linked list without using extra space. Walk me through your approach.',
    'Find the maximum subarray sum using Kadane\'s algorithm.',
    'Explain the two-pointer technique. Give two problems it solves.',
    'What is a stack and queue? Give real-world examples for each.',
    'Explain merge sort and quick sort. When would you prefer one over the other?',
    'What is BFS vs DFS? When would you use each?',
    'How would you detect a cycle in a linked list?',
    'What is a heap? How is it used in a priority queue?',
    'Explain the sliding window technique with an example.',
    'What is the time complexity of common operations in HashMap, ArrayList, and LinkedList?'
  ],
  oop: [
    'Explain the four pillars of OOP with real examples.',
    'What is the difference between Abstract Class and Interface in Java?',
    'Explain method overriding vs method overloading.',
    'What is polymorphism? Give a real-world coding example.',
    'What is encapsulation and why is it important?',
    'Explain the SOLID principles with examples.',
    'What is the Singleton design pattern? When should you use it?',
    'Difference between composition and inheritance. When to use each?',
    'What is the Factory design pattern? Explain with a code example.',
    'What are Java Collections? Name the most common ones and their uses.',
    'What is the difference between == and .equals() in Java?',
    'Explain Exception Handling in Java. Checked vs Unchecked exceptions.',
    'What is a constructor and what is constructor chaining?',
    'Explain the Observer design pattern.',
    'What are Generics in Java and why are they useful?'
  ],
  system: [
    'How would you design a URL shortener like bit.ly?',
    'Design a system like Swiggy/Zomato food delivery. What are the key components?',
    'How does WhatsApp handle millions of concurrent messages?',
    'Design an Instagram-like feed system. How would you handle scalability?',
    'What is the CAP theorem? Explain with examples.',
    'Explain horizontal vs vertical scaling. When would you choose each?',
    'What is a CDN? How does it improve performance?',
    'How does Netflix ensure its streaming service is always available?',
    'Explain the concept of database sharding and when it is needed.',
    'What is Load Balancing? Explain different load balancing algorithms.',
    'Design a notification system for an e-commerce app.',
    'What is the difference between SQL and NoSQL databases? When to use each?',
    'Explain microservices architecture vs monolithic. What are the tradeoffs?',
    'How would you implement a rate limiting system?',
    'Design a search autocomplete system for a large e-commerce platform.'
  ],
  hr: [
    'Tell me about yourself in 2 minutes.',
    'What is your greatest strength? Give a specific example.',
    'Describe a time when you failed and what you learned from it.',
    'Where do you see yourself in 5 years?',
    'Why do you want to join this company specifically?',
    'Tell me about a challenging project you worked on and how you handled it.',
    'How do you handle tight deadlines and pressure?',
    'Describe a situation where you had to work in a team with a conflict.',
    'What motivates you in your work?',
    'How do you stay updated with the latest technology trends?',
    'What are your salary expectations and why?',
    'Why should we hire you over other candidates?',
    'Describe a time when you had to learn a new skill quickly.',
    'What is your biggest weakness and how are you working on it?',
    'How would your college professors describe you?'
  ],
  sql: [
    'What is the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN?',
    'Explain the difference between WHERE and HAVING clauses.',
    'What are indexes in SQL and how do they improve query performance?',
    'Explain ACID properties in database transactions.',
    'What is normalization? Explain 1NF, 2NF, and 3NF.',
    'What is the difference between DELETE, TRUNCATE, and DROP?',
    'Write a query to find the second highest salary from an Employee table.',
    'What are stored procedures? When would you use one?',
    'Explain the concept of database views.',
    'What is denormalization and when is it useful?',
    'What is a primary key vs foreign key? Can they contain NULL?',
    'Explain GROUP BY with HAVING clause. Give a practical example.',
    'What is a correlated subquery? How does it differ from a regular subquery?',
    'What are window functions? Give an example using ROW_NUMBER().',
    'Explain the difference between UNION and UNION ALL.'
  ],
  os: [
    'What is the difference between a process and a thread?',
    'Explain deadlock. What are the four Coffman conditions?',
    'What is virtual memory? How does paging work?',
    'What is the difference between TCP and UDP? When would you use each?',
    'Explain the OSI model. What happens when you type a URL in your browser?',
    'What is a mutex vs semaphore?',
    'Explain the concept of thrashing in operating systems.',
    'What happens during a context switch?',
    'What is the difference between stack and heap memory?',
    'Explain different CPU scheduling algorithms (FCFS, SJF, Round Robin).',
    'What is a socket? How does client-server communication work?',
    'Explain DNS. What is the difference between a domain name and an IP address?',
    'What is HTTPS? How does SSL/TLS work?',
    'What is a race condition? How do you prevent it?',
    'Explain the producer-consumer problem and how to solve it.'
  ]
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSkillTagInput();
  loadCompanies();
  checkShareParams();
  console.log('🚀 PlaceIQ ready! API:', BASE_URL);
});

// ============================================================
// THEME TOGGLE
// ============================================================
function initTheme() {
  const saved = localStorage.getItem('placeiq-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

document.getElementById('themeToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('placeiq-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ============================================================
// STEP NAVIGATION
// ============================================================
function goToStep(step) {
  if (step === 2 && !validateStep1()) return;
  if (step === 4) updateReviewSummary();

  document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  document.getElementById(`step${step}`).classList.add('active');
  state.currentStep = step;

  // Update indicator
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`step-dot-${i}`);
    const line = document.getElementById(`step-line-${i}`);
    if (i < step) {
      dot.classList.remove('active'); dot.classList.add('completed');
      dot.querySelector('.step-num').innerHTML = '<i class="fas fa-check"></i>';
      if (line) line.classList.add('active');
    } else if (i === step) {
      dot.classList.add('active'); dot.classList.remove('completed');
      dot.querySelector('.step-num').innerHTML = i === 1 ? '<i class="fas fa-user"></i>' : i;
      if (line) line.classList.remove('active');
    } else {
      dot.classList.remove('active', 'completed');
      dot.querySelector('.step-num').innerHTML = i;
      if (line) line.classList.remove('active');
    }
  }

  document.getElementById('formSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function validateStep1() {
  const name = document.getElementById('inputName').value.trim();
  if (!name) {
    showToast('⚠️ Please enter your name to continue.', 'warning');
    document.getElementById('inputName').focus();
    return false;
  }
  return true;
}

function updateReviewSummary() {
  const name = document.getElementById('inputName').value.trim();
  const domain = document.getElementById('inputDomain').value;
  const cgpa = document.getElementById('inputCgpa').value;
  const exp = document.getElementById('inputExperience').value;

  document.getElementById('reviewName').textContent = name || '—';
  document.getElementById('reviewDomain').textContent = `${domain || 'Not specified'} · CGPA: ${cgpa || '—'} · ${exp}`;

  const count = state.skillTags.length;
  const resumeText = document.getElementById('inputResumeText').value;
  const estimatedExtra = resumeText.trim().length > 50
    ? Math.floor(resumeText.split(' ').length / 20)
    : 0;
  document.getElementById('reviewSkillCount').textContent = count + estimatedExtra;

  const selected = state.selectedCompanies.length;
  const total = state.allCompanies.length;
  document.getElementById('reviewCompanyCount').textContent = selected === 0 ? total : selected;
}

// ============================================================
// SKILL TAG INPUT
// ============================================================
function initSkillTagInput() {
  const input = document.getElementById('skillTagInput');
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkillTag(input.value);
      input.value = '';
    } else if (e.key === 'Backspace' && input.value === '' && state.skillTags.length > 0) {
      removeSkillTag(state.skillTags[state.skillTags.length - 1]);
    }
  });

  input.addEventListener('blur', () => {
    if (input.value.trim()) {
      addSkillTag(input.value);
      input.value = '';
    }
  });
}

function addSkillTag(val) {
  val = val.replace(/,/g, '').trim();
  if (!val) return;
  if (state.skillTags.includes(val)) return;
  state.skillTags.push(val);
  renderSkillTags();
}

function addQuickSkill(skill) {
  addSkillTag(skill);
}

function removeSkillTag(tag) {
  state.skillTags = state.skillTags.filter(t => t !== tag);
  renderSkillTags();
}

function renderSkillTags() {
  const container = document.getElementById('skillTagsContainer');
  const input = document.getElementById('skillTagInput');
  container.innerHTML = '';
  state.skillTags.forEach(tag => {
    const chip = document.createElement('span');
    chip.className = 'skill-tag';
    chip.innerHTML = `${tag} <button class="remove-tag" onclick="removeSkillTag('${tag.replace(/'/g, "\\'")}')">✕</button>`;
    container.appendChild(chip);
  });
  container.appendChild(input);
}

// ============================================================
// COMPANY LOADING & GRID
// ============================================================
async function loadCompanies() {
  try {
    const res = await fetch(`${BASE_URL}/api/companies`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('Server error');
    const data = await res.json();
    state.allCompanies = data;
    renderCompanyGrid(data);
    populateSalaryModal(data);
    document.getElementById('companyLoadError').style.display = 'none';
  } catch (e) {
    console.warn('API unavailable, using fallback company list');
    state.allCompanies = FALLBACK_COMPANIES;
    renderCompanyGrid(FALLBACK_COMPANIES);
    populateSalaryModal(FALLBACK_COMPANIES);
    document.getElementById('companyLoadError').style.display = 'block';
  }
}

function renderCompanyGrid(companies) {
  const grid = document.getElementById('companyGrid');
  grid.innerHTML = '';
  companies.forEach(c => {
    const icon = COMPANY_ICONS[c.name] || '🏢';
    const catClass = `cat-${c.category?.toLowerCase()}`;
    const div = document.createElement('div');
    div.className = 'company-checkbox-card';
    div.setAttribute('data-category', c.category || '');
    div.innerHTML = `
      <input type="checkbox" id="chk_${escapeName(c.name)}" value="${c.name}">
      <label for="chk_${escapeName(c.name)}" class="company-checkbox-label">
        <span class="company-icon">${icon}</span>
        <span>${c.name}</span>
        <span class="company-category-tag ${catClass}">${c.category || ''}</span>
      </label>`;
    div.querySelector('input').addEventListener('change', (e) => {
      if (e.target.checked) {
        if (!state.selectedCompanies.includes(c.name)) state.selectedCompanies.push(c.name);
      } else {
        state.selectedCompanies = state.selectedCompanies.filter(n => n !== c.name);
      }
    });
    grid.appendChild(div);
  });
}

function escapeName(name) {
  return name.replace(/[^a-zA-Z0-9]/g, '_');
}

function selectAllCompanies(select) {
  document.querySelectorAll('#companyGrid input[type="checkbox"]').forEach(chk => {
    chk.checked = select;
  });
  state.selectedCompanies = select ? state.allCompanies.map(c => c.name) : [];
}

function filterCompanies(cat, btn) {
  document.querySelectorAll('[onclick*="filterCompanies"]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.company-checkbox-card').forEach(card => {
    const cardCat = card.getAttribute('data-category');
    card.style.display = (cat === 'all' || cardCat === cat) ? '' : 'none';
  });
}

function populateSalaryModal(companies) {
  const sel = document.getElementById('salaryCompanyInput');
  companies.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });
}

// ============================================================
// FORM SUBMISSION & ANALYSIS
// ============================================================
async function submitAnalysis() {
  const name = document.getElementById('inputName').value.trim();
  if (!name) { showToast('⚠️ Please enter your name!', 'warning'); goToStep(1); return; }

  const btn = document.getElementById('analyseBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analysing...';

  // Build payload
  const payload = {
    name,
    email: document.getElementById('inputEmail').value.trim(),
    domain: document.getElementById('inputDomain').value,
    experience: document.getElementById('inputExperience').value,
    cgpa: parseFloat(document.getElementById('inputCgpa').value) || null,
    location: document.getElementById('inputLocation').value,
    salaryMin: parseFloat(document.getElementById('inputSalaryMin').value) || null,
    skills: [...state.skillTags],
    targetCompanies: [...state.selectedCompanies],
    interviewWeeks: parseInt(document.getElementById('weeksSlider').value) || 4,
    resumeText: document.getElementById('inputResumeText').value.trim()
  };

  // Show loading
  document.getElementById('formSection').style.display = 'none';
  document.getElementById('loadingSection').style.display = 'block';
  document.getElementById('loadingSection').scrollIntoView({ behavior: 'smooth' });

  animateLoadingCompanies(payload.targetCompanies);

  try {
    const res = await fetch(`${BASE_URL}/api/analyse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    state.analysisResult = data;
    state.profileId = data.profileId;

    renderResults(data);
  } catch (e) {
    console.error('Analysis failed:', e);
    showToast('❌ Backend not responding. Make sure Spring Boot is running on port 8080.', 'error', 6000);
    document.getElementById('loadingSection').style.display = 'none';
    document.getElementById('formSection').style.display = 'block';
    goToStep(4);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-brain"></i> Analyse My Placement Readiness <i class="fas fa-arrow-right"></i>';
  }
}

let loadingMsgInterval;
const loadingMessages = [
  'Parsing your skills...',
  'Fetching company data...',
  'Running gap analysis...',
  'Generating personalised roadmaps...',
  'Computing placement scores...',
  'Ranking companies by match...',
  'Almost done!'
];

function animateLoadingCompanies(companies) {
  let i = 0;
  loadingMsgInterval = setInterval(() => {
    const txt = document.getElementById('loadingText');
    const sub = document.getElementById('loadingSubText');
    if (txt) txt.textContent = loadingMessages[i % loadingMessages.length];
    if (sub) {
      const co = (companies.length > 0 ? companies : state.allCompanies.map(c => c.name));
      if (i < co.length) sub.textContent = `Analysing: ${co[i]}`;
    }
    i++;
  }, 1500);
}

// ============================================================
// RENDER RESULTS
// ============================================================
function renderResults(data) {
  clearInterval(loadingMsgInterval);
  document.getElementById('loadingSection').style.display = 'none';
  document.getElementById('resultsSection').style.display = 'block';
  document.getElementById('progressPanel').style.display = 'block';
  document.getElementById('fabGroup').style.display = 'flex';
  document.getElementById('viewResultsBtn').style.display = 'inline-flex';

  const results = data.results || [];
  const skills = data.detectedSkills || [];

  // Student name
  document.getElementById('resultStudentName').textContent = data.studentName || 'Student';

  // Overview stats
  const avg = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
    : 0;
  const strong = results.filter(r => r.score >= 70).length;
  document.getElementById('ov-companies').textContent = results.length;
  document.getElementById('ov-avg-score').textContent = avg + '%';
  document.getElementById('ov-strong').textContent = strong;
  document.getElementById('ov-skills').textContent = skills.length;

  // Detected skills
  const skillsContainer = document.getElementById('detectedSkillsBadges');
  skillsContainer.innerHTML = '';
  skills.forEach((s, i) => {
    const badge = document.createElement('span');
    badge.className = 'skill-badge skill-badge-detected';
    badge.style.animationDelay = `${i * 0.05}s`;
    badge.innerHTML = `<i class="fas fa-check-circle"></i> ${s}`;
    skillsContainer.appendChild(badge);
  });

  // Bar chart
  renderOverviewChart(results);

  // Company cards
  const container = document.getElementById('companyCardsContainer');
  container.innerHTML = '';
  results.forEach((r, i) => {
    container.appendChild(buildCompanyCard(r, i));
  });

  // Progress tracker
  renderProgressTracker(results, skills);

  // Confetti if avg > 70
  if (avg >= 70) triggerConfetti();

  // Scroll to results
  setTimeout(() => {
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
  }, 300);
}

// ============================================================
// OVERVIEW BAR CHART
// ============================================================
function renderOverviewChart(results) {
  const ctx = document.getElementById('overviewBarChart').getContext('2d');
  if (state.overviewChart) { state.overviewChart.destroy(); }

  const top = results.slice(0, 15);
  const labels = top.map(r => r.company);
  const scores = top.map(r => r.score);
  const colors = scores.map(s =>
    s >= 70 ? 'rgba(0,212,170,0.75)' : s >= 40 ? 'rgba(255,209,102,0.75)' : 'rgba(255,107,107,0.75)'
  );
  const borderColors = scores.map(s =>
    s >= 70 ? '#00D4AA' : s >= 40 ? '#FFD166' : '#FF6B6B'
  );

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const tickColor = isDark ? '#a0a8c0' : '#4a5568';

  state.overviewChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Match Score %',
        data: scores,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1.5,
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.raw}% match`
          }
        }
      },
      scales: {
        x: {
          max: 100,
          grid: { color: gridColor },
          ticks: { color: tickColor, callback: v => v + '%' }
        },
        y: {
          grid: { display: false },
          ticks: { color: tickColor, font: { weight: '600' } }
        }
      },
      animation: { duration: 1000, easing: 'easeInOutQuart' }
    }
  });
}

// ============================================================
// COMPANY CARDS
// ============================================================
function buildCompanyCard(r, index) {
  const scoreClass = r.score >= 70 ? 'score-high' : r.score >= 40 ? 'score-medium' : 'score-low';
  const catClass = `cat-${r.category?.toLowerCase()}`;
  const confidenceClass = r.confidenceLevel === 'Strong' ? 'conf-strong'
    : r.confidenceLevel === 'Needs Work' ? 'conf-needs' : 'conf-moderate';

  const icon = COMPANY_ICONS[r.company] || '🏢';

  // Trend badges
  const trendBadge = getTrendBadge(r.company);

  // Matched/missing
  const matchedHTML = (r.matchedSkills || []).map(s =>
    `<span class="skill-badge skill-badge-matched"><i class="fas fa-check"></i> ${s}</span>`
  ).join('');
  const missingHTML = (r.missingSkills || []).map(s =>
    `<span class="skill-badge skill-badge-missing"><i class="fas fa-times"></i> ${s}</span>`
  ).join('');

  // Roadmap
  const roadmapHTML = buildRoadmapHTML(r.roadmap || {});

  // Salary
  const salary = r.salaryInfo || {};
  const salaryText = (salary.min && salary.max)
    ? `₹${salary.min}–${salary.max} LPA` : 'Check company website';

  // PYQs
  const pyqHTML = (r.pyqLinks || []).map(link =>
    `<a href="${link}" target="_blank" class="btn-action btn-outline" style="font-size:0.78rem;padding:0.3rem 0.8rem;">
      <i class="fas fa-external-link-alt"></i> Interview Q&A
    </a>`
  ).join('');

  // Canvas ID
  const canvasId = `radar_${escapeName(r.company)}_${index}`;

  const card = document.createElement('div');
  card.className = 'company-accord-card';
  card.setAttribute('data-company', r.company);
  card.innerHTML = `
    <div class="accord-header" onclick="toggleAccord(this)">
      <div class="score-badge ${scoreClass}" style="--pct:${r.score}">
        <span>${r.score}%</span>
      </div>
      <div class="company-name-accord">
        ${icon} ${r.company}
        ${trendBadge}
        <span class="company-category-tag ${catClass} ms-1">${r.category || ''}</span>
      </div>
      <span class="confidence-badge ${confidenceClass}">${r.confidenceLevel || 'Moderate'}</span>
      <button class="compare-btn ms-2 d-none d-md-inline-block" onclick="toggleCompare(event,'${r.company.replace(/'/g, "\\'")}')">
        📊 Compare
      </button>
      <i class="fas fa-chevron-down accord-chevron ms-2"></i>
    </div>
    <div class="accord-body">
      <div class="row g-4 mt-1">

        <!-- Left: Skill match + radar -->
        <div class="col-md-7">
          <div class="mb-3">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
              <span style="font-size:0.8rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">
                MATCH SCORE
              </span>
              <span style="font-weight:800;color:${r.score>=70?'var(--secondary)':r.score>=40?'var(--warning)':'var(--accent)'};">
                ${r.score}%
              </span>
            </div>
            <div class="progress-bar-custom">
              <div class="progress-fill ${r.score>=70?'progress-fill-green':r.score>=40?'progress-fill-yellow':'progress-fill-red'}"
                style="width:${r.score}%"></div>
            </div>
          </div>

          ${matchedHTML ? `<div class="mb-3">
            <div style="font-size:0.78rem;font-weight:700;color:var(--secondary);margin-bottom:0.4rem;text-transform:uppercase;">
              ✅ Matched (${(r.matchedSkills||[]).length})
            </div>
            ${matchedHTML}
          </div>` : ''}

          ${missingHTML ? `<div class="mb-3">
            <div style="font-size:0.78rem;font-weight:700;color:var(--accent-light);margin-bottom:0.4rem;text-transform:uppercase;">
              ❌ Missing (${(r.missingSkills||[]).length})
            </div>
            ${missingHTML}
          </div>` : ''}
        </div>

        <!-- Right: Radar chart -->
        <div class="col-md-5">
          <div class="radar-container">
            <canvas id="${canvasId}"></canvas>
          </div>
        </div>

        <!-- AI Advice -->
        <div class="col-12">
          <div class="ai-advice-card">
            <div class="ai-badge"><i class="fas fa-user-tie me-1"></i> Expert Career Advice</div>
            <p style="font-size:0.9rem;color:var(--text-primary);margin-bottom:0.75rem;">
              ${r.geminiAdvice || 'Focus on strengthening your technical skills.'}
            </p>
            <div class="d-flex gap-2 flex-wrap align-items-center">
              ${r.prioritySkill ? `<div style="font-size:0.82rem;">
                <strong>Top Priority:</strong>
                <span class="skill-badge skill-badge-detected" style="display:inline-flex;">${r.prioritySkill}</span>
              </div>` : ''}
              ${r.interviewTip ? `<div style="font-size:0.82rem;color:var(--text-secondary);">
                <em>${r.interviewTip}</em>
              </div>` : ''}
            </div>
          </div>
        </div>

        <!-- Roadmap -->
        ${roadmapHTML}

        <!-- Salary + Hiring Info -->
        <div class="col-12">
          <div class="row g-2">
            <div class="col-md-6">
              <div class="salary-card">
                <div>
                  <div style="font-size:0.75rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;">FRESHER CTC RANGE</div>
                  <div class="salary-range">${salaryText}</div>
                </div>
                <div class="ms-auto">
                  <button class="btn-action btn-outline" style="font-size:0.78rem;padding:0.3rem 0.8rem;"
                    onclick="openSalaryModal('${r.company.replace(/'/g,"\\'")}')">
                    <i class="fas fa-sack-dollar"></i> Negotiate
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="salary-card" style="background:rgba(108,99,255,0.05);border-color:rgba(108,99,255,0.2);">
                <div>
                  <div style="font-size:0.75rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;">HIRING SEASON</div>
                  <div style="font-weight:700;color:var(--primary-light);font-size:0.95rem;">${r.hiringMonths || 'Year Round'}</div>
                  <div style="font-size:0.8rem;color:var(--text-muted);">${r.interviewRounds || 'Multiple rounds'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PYQ Links -->
        ${pyqHTML ? `<div class="col-12">
          <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:0.5rem;">
            <i class="fas fa-book-open"></i> Previous Year Questions & Interview Experiences
          </div>
          <div class="d-flex gap-2 flex-wrap">${pyqHTML}</div>
        </div>` : ''}

      </div>
    </div>`;

  // Render radar chart after DOM insertion
  setTimeout(() => {
    renderRadarChart(canvasId, r);
  }, 200 + index * 50);

  return card;
}

function buildRoadmapHTML(roadmap) {
  const weeks = Object.entries(roadmap).filter(([, skills]) => skills.length > 0);
  if (weeks.length === 0) return `<div class="col-12"><p style="color:var(--secondary);font-weight:600;"><i class="fas fa-trophy me-1"></i> No skill gaps — you match all requirements!</p></div>`;

  const weekIcons = { 'Week 1': '<i class="fas fa-play"></i>', 'Week 2': '<i class="fas fa-book"></i>', 'Week 3': '<i class="fas fa-bolt"></i>', 'Week 4+': '<i class="fas fa-trophy"></i>' };

  const weeksHTML = weeks.map(([week, skills]) => `
    <div class="roadmap-week-card">
      <div class="week-label">${weekIcons[week] || ''} ${week}</div>
      ${skills.map(s => `<div class="week-skill">${s}</div>`).join('')}
    </div>
  `).join('');

  return `<div class="col-12">
    <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:0.5rem;">
      <i class="fas fa-calendar-alt"></i> PERSONALISED ROADMAP
    </div>
    <div class="roadmap-timeline">${weeksHTML}</div>
  </div>`;
}

function getTrendBadge(companyName) {
  const hot = ['Amazon', 'Google', 'Microsoft', 'Meta', 'Flipkart', 'Razorpay', 'PhonePe'];
  const rising = ['CRED', 'Groww', 'Meesho', 'Postman', 'Atlassian', 'Nykaa'];
  if (hot.includes(companyName)) return `<span class="trend-badge trend-hot"><i class="fas fa-fire"></i> Hot</span>`;
  if (rising.includes(companyName)) return `<span class="trend-badge trend-rising"><i class="fas fa-arrow-trend-up"></i> Rising</span>`;
  return `<span class="trend-badge trend-core"><i class="fas fa-star"></i> Core</span>`;
}

// ============================================================
// RADAR CHART
// ============================================================
function renderRadarChart(canvasId, result) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const allSkills = [...(result.matchedSkills || []), ...(result.missingSkills || [])].slice(0, 8);
  const matched = new Set(result.matchedSkills || []);
  const data = allSkills.map(s => matched.has(s) ? 100 : 20);

  if (state.radarCharts[canvasId]) state.radarCharts[canvasId].destroy();

  state.radarCharts[canvasId] = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: allSkills.map(s => s.length > 10 ? s.substring(0, 10) + '…' : s),
      datasets: [{
        label: 'Skill Coverage',
        data,
        backgroundColor: 'rgba(108,99,255,0.2)',
        borderColor: '#6C63FF',
        borderWidth: 2,
        pointBackgroundColor: data.map(v => v > 50 ? '#00D4AA' : '#FF6B6B'),
        pointBorderColor: '#fff',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0, max: 100,
          grid: { color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' },
          pointLabels: {
            color: isDark ? '#a0a8c0' : '#4a5568',
            font: { size: 9, weight: '600' }
          },
          ticks: { display: false }
        }
      },
      animation: { duration: 800 }
    }
  });
}

// ============================================================
// ACCORDION
// ============================================================
function toggleAccord(header) {
  const body = header.nextElementSibling;
  const chevron = header.querySelector('.accord-chevron');
  const isOpen = body.classList.contains('open');

  // Close all
  document.querySelectorAll('.accord-body.open').forEach(b => {
    b.classList.remove('open');
    b.previousElementSibling.querySelector('.accord-chevron')?.classList.remove('open');
  });

  if (!isOpen) {
    body.classList.add('open');
    chevron.classList.add('open');
  }
}

// ============================================================
// PROGRESS TRACKER
// ============================================================
function renderProgressTracker(results, skills) {
  const allMissing = [];
  results.forEach(r => {
    (r.missingSkills || []).forEach(s => {
      if (!allMissing.includes(s)) allMissing.push(s);
    });
  });

  const list = document.getElementById('progressSkillList');
  list.innerHTML = '';
  allMissing.forEach(skill => {
    const item = document.createElement('div');
    item.className = 'progress-skill-item';
    item.setAttribute('data-skill', skill);
    item.innerHTML = `
      <div class="progress-skill-check"><i class="fas fa-check" style="opacity:0"></i></div>
      <span style="flex:1;font-weight:600;font-size:0.9rem;">${skill}</span>
      <span style="font-size:0.75rem;color:var(--text-muted);">Click to mark complete</span>`;
    item.addEventListener('click', () => toggleProgressSkill(item, skill));
    list.appendChild(item);
  });

  updateProgressBar();
}

function toggleProgressSkill(item, skill) {
  const isCompleted = item.classList.toggle('completed');
  const checkIcon = item.querySelector('.progress-skill-check i');
  checkIcon.style.opacity = isCompleted ? '1' : '0';

  // Save to backend if profile ID available
  if (state.profileId) {
    fetch(`${BASE_URL}/api/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userProfileId: state.profileId,
        skillName: skill,
        completed: isCompleted,
        completionDate: isCompleted ? new Date().toISOString().split('T')[0] : null
      })
    }).catch(() => {});
  }

  updateProgressBar();
}

function updateProgressBar() {
  const items = document.querySelectorAll('.progress-skill-item');
  const completed = document.querySelectorAll('.progress-skill-item.completed').length;
  const pct = items.length > 0 ? Math.round(completed / items.length * 100) : 0;
  document.getElementById('progressPercent').textContent = pct;
  document.getElementById('progressBar').style.width = pct + '%';
  if (pct === 100 && items.length > 0) {
    triggerConfetti();
    showToast('All skills completed! You\'re ready for placement!');
  }
}

// ============================================================
// SALARY NEGOTIATION MODAL
// ============================================================
function openSalaryModal(company) {
  document.getElementById('salaryModal').classList.add('open');
  if (company) {
    const sel = document.getElementById('salaryCompanyInput');
    for (let opt of sel.options) {
      if (opt.value === company) { sel.value = company; break; }
    }
  }
  document.getElementById('salaryResultBox').style.display = 'none';
}

function closeSalaryModal() {
  document.getElementById('salaryModal').classList.remove('open');
}

async function getSalaryAdvice() {
  const company = document.getElementById('salaryCompanyInput').value;
  const role = document.getElementById('salaryRoleInput').value || 'Software Engineer';
  const offer = document.getElementById('salaryOfferInput').value;

  if (!company || !offer) {
    showToast('⚠️ Please select company and enter offer amount.', 'warning');
    return;
  }

  const box = document.getElementById('salaryResultBox');
  box.style.display = 'block';
  box.innerHTML = '<div style="text-align:center;padding:1rem;"><i class="fas fa-spinner fa-spin" style="color:var(--primary)"></i> Getting AI advice...</div>';

  try {
    const res = await fetch(`${BASE_URL}/api/salary-advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offeredSalary: offer, company, role })
    });
    const data = await res.json();

    const recColor = data.recommendation === 'Accept' ? 'var(--secondary)'
      : data.recommendation === 'Decline' ? 'var(--accent)' : 'var(--warning)';

    box.innerHTML = `
      <div style="background:${recColor}22;border:1px solid ${recColor}44;padding:0.5rem 1rem;border-radius:50px;display:inline-block;font-weight:700;color:${recColor};margin-bottom:0.75rem;">
        ${data.recommendation === 'Accept' ? '<i class="fas fa-check"></i>' : data.recommendation === 'Decline' ? '<i class="fas fa-times"></i>' : '<i class="fas fa-handshake"></i>'} ${data.recommendation}
      </div>
      <p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:0.5rem;">${data.advice || ''}</p>
      ${data.counter_offer && data.counter_offer !== offer
        ? `<div style="font-size:0.85rem;color:var(--text-muted);"><i class="fas fa-briefcase"></i> Suggested counter offer: <strong style="color:var(--secondary);">₹${data.counter_offer} LPA</strong></div>`
        : ''}`;
  } catch (e) {
    box.innerHTML = `<p style="color:var(--text-muted);font-size:0.9rem;">
      Based on market rates, ₹${offer} LPA ${parseFloat(offer) >= 6 ? 'is a good offer for a fresher. Consider negotiating 10-15% higher.' : 'may be below market. Try negotiating to at least ₹6-8 LPA.'}
    </p>`;
  }
}

// ============================================================
// MOCK INTERVIEW
// ============================================================
function openMockInterview() {
  document.getElementById('mockInterviewModal').classList.add('open');
  resetTimer();
}

function closeMockInterview() {
  document.getElementById('mockInterviewModal').classList.remove('open');
  stopTimer();
}

function filterMockTopic(topic, btn) {
  state.mockTopic = topic;
  document.querySelectorAll('#mockTopicFilter .category-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('mockTopicLabel').textContent = topic === 'all' ? '' : topic.toUpperCase();
}

function nextMockQuestion() {
  let pool = [];
  if (state.mockTopic === 'all') {
    Object.values(QUESTIONS).forEach(arr => pool.push(...arr));
  } else {
    pool = QUESTIONS[state.mockTopic] || Object.values(QUESTIONS).flat();
  }
  const q = pool[Math.floor(Math.random() * pool.length)];
  document.getElementById('mockQuestion').textContent = q;
  state.mockQCount++;
  document.getElementById('qNum').textContent = state.mockQCount;
  resetTimer();
}

let timerInterval;
function toggleTimer() {
  if (state.timerRunning) {
    stopTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  state.timerRunning = true;
  document.getElementById('timerIcon').className = 'fas fa-pause';
  timerInterval = setInterval(() => {
    state.timerSeconds--;
    updateTimerDisplay();
    if (state.timerSeconds <= 0) { stopTimer(); showToast('⏰ Time up!'); }
  }, 1000);
}

function stopTimer() {
  state.timerRunning = false;
  document.getElementById('timerIcon').className = 'fas fa-play';
  clearInterval(timerInterval);
}

function resetTimer() {
  stopTimer();
  state.timerSeconds = 120;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const m = Math.floor(state.timerSeconds / 60).toString().padStart(2, '0');
  const s = (state.timerSeconds % 60).toString().padStart(2, '0');
  const el = document.getElementById('interviewTimer');
  el.textContent = `${m}:${s}`;
  el.className = 'interview-timer';
  if (state.timerSeconds <= 30) el.classList.add('danger');
  else if (state.timerSeconds <= 60) el.classList.add('warning');
}

// ============================================================
// COMPANY COMPARISON
// ============================================================
function toggleCompare(event, company) {
  event.stopPropagation();
  const btn = event.target.closest('.compare-btn');

  if (state.compareList.includes(company)) {
    state.compareList = state.compareList.filter(c => c !== company);
    btn.classList.remove('selected');
    btn.textContent = '📊 Compare';
  } else {
    if (state.compareList.length >= 4) {
      showToast('⚠️ Maximum 4 companies for comparison.', 'warning');
      return;
    }
    state.compareList.push(company);
    btn.classList.add('selected');
    btn.textContent = '✓ Selected';
  }
}

function openCompareModal() {
  document.getElementById('compareModal').classList.add('open');
  renderCompareCharts();
}

function renderCompareCharts() {
  const grid = document.getElementById('compareRadarGrid');
  grid.innerHTML = '';

  if (state.compareList.length === 0) {
    grid.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:2rem;grid-column:1/-1;">No companies selected. Click "📊 Compare" on company cards.</div>';
    return;
  }

  const results = state.analysisResult?.results || [];
  state.compareList.forEach(company => {
    const r = results.find(x => x.company === company);
    if (!r) return;
    const canvasId = `compare_radar_${escapeName(company)}`;
    const div = document.createElement('div');
    div.className = 'glass-card p-3 text-center';
    div.innerHTML = `
      <h6 style="font-family:'Space Grotesk',sans-serif;font-weight:700;margin-bottom:0.5rem;">
        ${COMPANY_ICONS[company] || '🏢'} ${company}
      </h6>
      <div style="font-size:1.5rem;font-weight:800;color:${r.score>=70?'var(--secondary)':r.score>=40?'var(--warning)':'var(--accent)'};">
        ${r.score}%
      </div>
      <canvas id="${canvasId}" style="max-height:200px;"></canvas>`;
    grid.appendChild(div);
    setTimeout(() => renderRadarChart(canvasId, r), 100);
  });
}

// ============================================================
// SHARE / EXPORT
// ============================================================
function shareResults() {
  if (!state.analysisResult) return;
  const results = state.analysisResult.results || [];
  const top = results.slice(0, 3).map(r => `${r.company}: ${r.score}%`).join(', ');
  const params = new URLSearchParams({
    name: state.analysisResult.studentName || '',
    top: top,
    avg: results.length > 0 ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length) : 0
  });
  const url = `${window.location.href.split('?')[0]}?${params.toString()}`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('🔗 Shareable link copied to clipboard!');
    });
  } else {
    prompt('Copy this link:', url);
  }
}

function checkShareParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('name')) {
    showToast(`👋 Viewing shared results for ${params.get('name')} · Avg: ${params.get('avg')}%`);
  }
}

function copyResults() {
  if (!state.analysisResult) return;
  const results = state.analysisResult.results || [];
  const lines = [`PlaceIQ Placement Report — ${state.analysisResult.studentName}`, ''];
  results.slice(0, 10).forEach(r => {
    lines.push(`${r.company} (${r.category}): ${r.score}% match — Confidence: ${r.confidenceLevel}`);
    if (r.missingSkills?.length) lines.push(`  Skills to learn: ${r.missingSkills.slice(0, 5).join(', ')}`);
  });
  lines.push('', 'Generated by PlaceIQ — placeiq.app');
  navigator.clipboard?.writeText(lines.join('\n'));
  showToast('📋 Results copied to clipboard!');
}

function exportPDF() {
  if (!state.analysisResult) { showToast('⚠️ Run analysis first.', 'warning'); return; }
  // Open all accordions for print
  document.querySelectorAll('.accord-body').forEach(b => b.classList.add('open'));
  showToast('🖨️ Opening print dialog... (Ctrl+P → Save as PDF)');
  setTimeout(() => window.print(), 800);
}

// ============================================================
// CONFETTI
// ============================================================
function triggerConfetti() {
  const colors = ['#6C63FF', '#00D4AA', '#FF6B6B', '#FFD166', '#06B6D4'];
  for (let i = 0; i < 80; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    c.style.cssText = `
      left: ${Math.random() * 100}vw;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      animation-duration: ${Math.random() * 3 + 2}s;
      animation-delay: ${Math.random() * 2}s;
      opacity: ${Math.random() * 0.7 + 0.3};
    `;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 6000);
  }
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
let toastTimeout;
function showToast(message, type = 'success', duration = 3500) {
  const toast = document.getElementById('toast');
  const icon = type === 'warning' ? '⚠️' : type === 'error' ? '❌' : '✅';
  toast.innerHTML = `${icon} ${message}`;
  toast.style.borderColor = type === 'error' ? 'rgba(255,107,107,0.4)'
    : type === 'warning' ? 'rgba(255,209,102,0.4)' : 'rgba(0,212,170,0.4)';
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), duration);
}

// ============================================================
// MISC UTILS
// ============================================================
function startOver() {
  if (!confirm('Start a new analysis? Current results will be cleared.')) return;
  state.analysisResult = null;
  state.skillTags = [];
  state.selectedCompanies = [];
  state.compareList = [];
  state.profileId = null;
  document.getElementById('resultsSection').style.display = 'none';
  document.getElementById('progressPanel').style.display = 'none';
  document.getElementById('fabGroup').style.display = 'none';
  document.getElementById('formSection').style.display = 'block';
  document.getElementById('inputName').value = '';
  document.getElementById('inputEmail').value = '';
  document.getElementById('inputCgpa').value = '';
  document.getElementById('inputSalaryMin').value = '';
  document.getElementById('inputResumeText').value = '';
  document.getElementById('detectedSkillsBadges').innerHTML = '';
  document.getElementById('companyCardsContainer').innerHTML = '';
  renderSkillTags();
  goToStep(1);
  window.scrollTo(0, 0);
}

// Close modals on backdrop click
document.querySelectorAll('.modal-custom').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-custom').forEach(m => m.classList.remove('open'));
  }
});

console.log('%c⚡ PlaceIQ', 'color:#6C63FF;font-size:2rem;font-weight:900;');
console.log('%cIntelligent Placement Navigator', 'color:#00D4AA;font-size:1rem;');
console.log('%cBackend API:', 'color:#a0a8c0', BASE_URL);
