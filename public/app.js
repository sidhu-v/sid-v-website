async function loadData(){
  const res = await fetch('/api/data');
  return await res.json();
}

function el(tag, cls, txt){
  const e = document.createElement(tag);
  if(cls) e.className = cls;
  if(txt !== undefined) e.textContent = txt;
  return e;
}

function formatPercent(percent){
  return `${Math.min(Math.max(percent, 0), 100)}%`;
}

function renderProfile(profile){
  const nameEl = document.getElementById('name'); if(nameEl) nameEl.textContent = profile.name;
  const titleEl = document.getElementById('title'); if(titleEl) titleEl.textContent = profile.title;
  const bioEl = document.getElementById('bio'); if(bioEl) bioEl.textContent = profile.bio;
  const avatar = document.getElementById('hero-avatar'); if(avatar) avatar.src = profile.avatar;
}

function renderStats(stats){
  const grid = document.getElementById('stat-grid');
  if(!grid) return;
  grid.innerHTML = '';
  stats.forEach(stat => {
    const card = el('div','stat-card');
    card.setAttribute('data-stat-id', stat.id);
    card.appendChild(el('div','stat-icon',stat.icon));
    card.appendChild(el('div','stat-value',stat.value));
    card.appendChild(el('div','stat-label',stat.label));
    grid.appendChild(card);
  });
}

function renderFeaturedMoment(moment){
  const elFeat = document.getElementById('featured-moment'); if(elFeat) elFeat.textContent = `${moment.title} — ${moment.description}`;
}

function renderHeroMarquee(highlights){
  const marquee = document.getElementById('hero-marquee');
  if(marquee) marquee.textContent = highlights.map(h => h.text).join(' • ');
}

function renderProjects(projects){
  const grid = document.getElementById('project-grid');
  if(!grid) return;
  grid.innerHTML = '';
  projects.forEach(project => {
    const card = el('div','project-card');
    card.dataset.projectId = project.id;
    const image = document.createElement('img');
    image.src = project.image;
    image.alt = project.title;
    image.className = 'project-image';
    card.appendChild(image);
    const content = el('div','project-card-content');
    content.appendChild(el('h3',null,project.title));
    content.appendChild(el('div','project-meta',`${project.category} · ${project.tagline}`));
    content.appendChild(el('p',null,project.summary));
    const tags = el('div','filter-pill-row');
    project.tags.forEach(tag => tags.appendChild(el('span','filter-pill',tag)));
    content.appendChild(tags);
    const link = el('a',null,'View project');
    link.href = project.url;
    link.target = '_blank';
    content.appendChild(link);
    card.appendChild(content);
    // open modal on click to show richer project details
    card.addEventListener('click', (ev) => {
      // avoid opening when clicking the external link
      if(ev.target.tagName.toLowerCase() === 'a') return;
      openProjectModal(project);
    });
    grid.appendChild(card);
  });
}

// Project modal
function openProjectModal(project){
  const modal = document.getElementById('project-modal');
  const content = document.getElementById('project-modal-content');
  if(!modal || !content) return;
  content.innerHTML = '';
  const header = el('div','modal-header');
  header.appendChild(el('h2',null,project.title));
  header.appendChild(el('div','muted',`${project.category} · ${project.tagline}`));
  content.appendChild(header);
  const img = document.createElement('img'); img.src = project.image; img.alt = project.title; img.style.width='100%'; img.style.borderRadius='12px';
  content.appendChild(img);
  content.appendChild(el('p',null,project.summary));
  const tags = el('div','filter-pill-row'); project.tags.forEach(t => tags.appendChild(el('span','filter-pill',t)));
  content.appendChild(tags);
  const ext = el('a','btn btn-primary','Open project'); ext.href = project.url; ext.target = '_blank'; ext.style.display='inline-block'; ext.style.marginTop='12px';
  content.appendChild(ext);
  modal.setAttribute('aria-hidden','false');
  modal.classList.add('open');
}

document.addEventListener('click', (ev)=>{
  const modal = document.getElementById('project-modal');
  if(!modal) return;
  if(ev.target.id === 'project-modal' || ev.target.id === 'project-modal-close'){
    modal.setAttribute('aria-hidden','true'); modal.classList.remove('open');
  }
});

// --- Advanced visuals: animated SVG hero and audio-reactive canvas ---
let audioLevel = 0;
function setupHeroSVGAnimation(){
  const path = document.getElementById('hero-path');
  if(!path) return;
  const len = path.getTotalLength();
  path.style.strokeDasharray = `${len} ${len}`;
  let offset = 0;
  function loop(){
    // react to audioLevel (0..1)
    const speed = 0.8 + (audioLevel || 0) * 6;
    offset = (offset + speed) % len;
    path.style.strokeDashoffset = Math.abs(Math.sin(offset/80)) * 14 + offset * 0.02;
    // subtle color shift
    const g = Math.floor(120 + audioLevel*120);
    path.setAttribute('stroke', `rgba(${200 - g}, ${220 - g/2}, ${255}, ${0.2 + audioLevel*0.6})`);
    requestAnimationFrame(loop);
  }
  loop();
}

async function initAudioReactivity(){
  const canvas = document.getElementById('audio-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  // Try microphone first
  try{
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const src = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser(); analyser.fftSize = 256;
    src.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    function draw(){
      analyser.getByteFrequencyData(data);
      let sum = 0; for(let i=0;i<data.length;i++) sum += data[i];
      const avg = sum / data.length / 255;
      audioLevel = Math.min(1, avg*1.6);
      // draw waveform
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = `rgba(109,216,255,0.06)`;
      const w = canvas.width; const h = canvas.height;
      for(let i=0;i<data.length;i++){
        const x = (i/data.length) * w;
        const hval = (data[i]/255) * h * audioLevel * 1.4;
        ctx.fillRect(x, (h-hval)/2, Math.max(1,w/data.length), hval);
      }
      requestAnimationFrame(draw);
    }
    draw();
  }catch(err){
    // fallback: ambient pulsing animation
    let t = 0; function idle(){ audioLevel = 0.05 + 0.05*Math.sin(t); t += 0.04; const c = ctx; c.clearRect(0,0,canvas.width,canvas.height); c.fillStyle='rgba(255,255,255,0.03)'; c.beginPath(); c.ellipse(canvas.width/2, canvas.height/2, 80+Math.sin(t)*20, 18+Math.cos(t)*6, 0,0,Math.PI*2); c.fill(); requestAnimationFrame(idle);} idle();
  }
}

function setupThemePresets(){
  document.querySelectorAll('.preset').forEach(btn => {
    btn.addEventListener('click', ()=>{
      const p = btn.dataset.preset;
      if(p === 'ocean'){
        document.documentElement.style.setProperty('--accent', '#6ee7b7');
        document.documentElement.style.setProperty('--accent-strong', '#10b981');
        document.body.style.background = 'linear-gradient(180deg,#071a2b,#021017)';
      }else if(p === 'sunset'){
        document.documentElement.style.setProperty('--accent', '#ffb86b');
        document.documentElement.style.setProperty('--accent-strong', '#ff6b8a');
        document.body.style.background = 'linear-gradient(180deg,#ff9a8b,#3d1b4a)';
      }else{
        document.documentElement.style.setProperty('--accent', '#cbd5e1');
        document.documentElement.style.setProperty('--accent-strong', '#94a3b8');
        document.body.style.background = 'linear-gradient(180deg,#0b1220,#07101a)';
      }
    });
  });
}

function setupScrollStory(){
  // parallax for hero image and simple scroll progress
  const hero = document.querySelector('.hero');
  const avatar = document.getElementById('hero-avatar');
  if(!hero || !avatar) return;
  window.addEventListener('scroll', ()=>{
    const rect = hero.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, 1 - (rect.top / window.innerHeight)));
    avatar.style.transform = `translateY(${pct*8}px) scale(${1 - pct*0.02})`;
  });
  // reveal story segments
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('reveal-visible'); });
  }, { threshold: 0.16 });
  document.querySelectorAll('[data-story]').forEach(el=> observer.observe(el));
}

function renderProjectFilters(categories){
  const container = document.getElementById('project-filters');
  if(!container) return;
  container.innerHTML = '';
  categories.forEach(category => {
    const button = el('button','filter-pill',category);
    button.type = 'button';
    if(category === 'All') button.classList.add('active');
    button.addEventListener('click', () => {
      container.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      button.classList.add('active');
      const event = new CustomEvent('project-filter', { detail: category });
      window.dispatchEvent(event);
    });
    container.appendChild(button);
  });
}

function renderBadges(medals){
  const row = document.getElementById('badge-row');
  if(!row) return;
  row.innerHTML = '';
  medals.forEach(medal => {
    const pill = el('div','badge-pill');
    pill.appendChild(el('strong',null,medal.name));
    pill.appendChild(el('div',null,`Level: ${medal.level}`));
    pill.appendChild(el('div','muted',medal.info));
    row.appendChild(pill);
  });
}

function renderAchievementSummary(data){
  const summary = document.getElementById('achievement-summary');
  if(!summary) return;
  summary.textContent = `${data.moments.length} moments · ${data.milestones.length} milestones · ${data.medals.length} badges`;
}

function renderTimeline(entries){
  const container = document.getElementById('timeline-list');
  if(!container) return;
  container.innerHTML = '';
  const grouped = entries.reduce((acc, entry) => {
    acc[entry.stage] = acc[entry.stage] || [];
    acc[entry.stage].push(entry);
    return acc;
  }, {});
  Object.keys(grouped).forEach(stage => {
    const stageCard = el('div','project-card');
    stageCard.style.padding = '18px';
    stageCard.appendChild(el('h3',null,stage));
    grouped[stage].sort((a,b) => b.when - a.when).forEach(entry => {
      const row = el('div','timeline-row');
      row.appendChild(el('div','muted',entry.when));
      const right = el('div');
      right.appendChild(el('div',null,entry.title));
      right.appendChild(el('div','muted',entry.detail));
      right.appendChild(el('div','timeline-tag',entry.category));
      row.appendChild(right);
      stageCard.appendChild(row);
    });
    container.appendChild(stageCard);
  });
}

function renderSkills(skills){
  const list = document.getElementById('skill-list');
  if(!list) return;
  list.innerHTML = '';
  skills.forEach(skill => {
    const card = el('div','skill-card');
    const header = el('strong',null,skill.name);
    const bar = el('div','skill-bar');
    const fill = el('div','skill-fill');
    fill.style.width = formatPercent(skill.level);
    bar.appendChild(fill);
    card.appendChild(header);
    card.appendChild(bar);
    list.appendChild(card);
    requestAnimationFrame(() => {
      fill.style.transform = `scaleX(${skill.level / 100})`;
    });
  });
}

function renderTestimonials(testimonials){
  const grid = document.getElementById('testimonial-grid');
  if(!grid) return;
  grid.innerHTML = '';
  testimonials.forEach(item => {
    const card = el('div','testimonial-card');
    const quote = el('blockquote',null,item.quote);
    const author = el('p','role',`${item.name} · ${item.role}`);
    card.appendChild(quote);
    card.appendChild(author);
    grid.appendChild(card);
  });
}

function renderGallery(gallery){
  const grid = document.getElementById('image-gallery');
  if(!grid) return;
  grid.innerHTML = '';
  gallery.forEach(item => {
    const card = el('div','gallery-card');
    const image = document.createElement('img');
    image.src = item.image;
    image.alt = item.title;
    card.appendChild(image);
    card.appendChild(el('div','gallery-card-caption',item.title));
    grid.appendChild(card);
  });
}

function renderContact(contact){
  const container = document.getElementById('contact-info');
  if(!container) return;
  container.innerHTML = '';
  const items = [
    { title:'Email', value:contact.email },
    { title:'Phone', value:contact.phone },
    { title:'Location', value:contact.location }
  ];
  items.forEach(item => {
    const box = el('div','contact-item');
    box.appendChild(el('strong',null,item.title));
    box.appendChild(el('div',null,item.value));
    container.appendChild(box);
  });
  contact.socials.forEach(social => {
    const box = el('div','contact-item');
    const link = el('a',null,`${social.icon} ${social.name}`);
    link.href = social.href;
    link.target = '_blank';
    link.style.color = 'inherit';
    link.style.textDecoration = 'none';
    box.appendChild(link);
    container.appendChild(box);
  });
}

function renderAnimalStudio(animals){
  const grid = document.getElementById('animal-grid');
  if(!grid) return;
  grid.innerHTML = '';
  animals.forEach((animal, index) => {
    const tile = el('button','animal-tile');
    tile.type = 'button';
    tile.dataset.index = index;
    tile.appendChild(el('div','animal-emoji',animal.emoji));
    tile.appendChild(el('strong',null,animal.name));
    tile.appendChild(el('div','muted',animal.role));
    tile.addEventListener('click', () => selectAnimal(animal, tile));
    grid.appendChild(tile);
  });
  if(animals.length) selectAnimal(animals[0], grid.querySelector('.animal-tile'));
}

function selectAnimal(animal, tile){
  const detailEmoji = document.getElementById('detail-emoji');
  const detailName = document.getElementById('detail-name');
  const detailRole = document.getElementById('detail-role');
  const detailFact = document.getElementById('detail-fact');
  const tags = document.getElementById('animal-tags');
  if(detailEmoji) detailEmoji.textContent = animal.emoji;
  if(detailName) detailName.textContent = animal.name;
  if(detailRole) detailRole.textContent = animal.role;
  if(detailFact) detailFact.textContent = animal.fact;
  if(tags){
    tags.innerHTML = '';
    animal.tags.forEach(tag => tags.appendChild(el('span','animal-tag',tag)));
  }
  document.querySelectorAll('.animal-tile.active').forEach(el=> el.classList.remove('active'));
  if(tile) tile.classList.add('active');
  document.documentElement.style.setProperty('--accent', animal.colorAccent || '#6dd8ff');
  document.documentElement.style.setProperty('--accent-strong', animal.colorStrong || '#38bdf8');
  document.body.style.background = animal.background || '';
}

function initAnimalStudio(animals){
  const button = document.getElementById('random-animal');
  if(!button || !animals || !animals.length) return;
  button.addEventListener('click', () => {
    const choice = animals[Math.floor(Math.random() * animals.length)];
    const tile = document.querySelector(`.animal-tile[data-index="${animals.indexOf(choice)}"]`);
    if(tile) tile.click();
    else selectAnimal(choice);
  });
}

function animateHeroMarquee(highlights){
  const marquee = document.getElementById('hero-marquee');
  if(!marquee || !highlights || !highlights.length) return;
  let index = 0;
  marquee.textContent = highlights[index].text;
  setInterval(() => {
    index = (index + 1) % highlights.length;
    marquee.textContent = highlights[index].text;
  }, 4200);
}

function renderSearchResults(items){
  const dynamic = document.getElementById('dynamic');
  if(!dynamic) return;
  dynamic.innerHTML = '';
  if (!items.length) {
    dynamic.appendChild(el('div','item','No matching items found.'));
    return;
  }
  items.forEach(item => {
    const card = el('div','item');
    card.appendChild(el('h3',null,item.title || item.name || item.text));
    if(item.category || item.date || item.year || item.type) {
      card.appendChild(el('div','muted',item.category || item.date || item.year || item.type));
    }
    card.appendChild(el('p',null,item.description || item.detail || item.info || item.summary || item.text || ''));
    dynamic.appendChild(card);
  });
}

function getSearchItems(data){
  return [
    ...data.projects.map(p => ({...p, type:'Project'})),
    ...data.moments.map(m => ({...m, type:'Moment'})),
    ...data.milestones.map(m => ({...m, type:'Milestone'})),
    ...data.medals.map(m => ({...m, type:'Medal'})),
    ...data.highlights.map(h => ({...h, title:h.text, type:'Highlight'}))
  ];
}

function setupThemeToggle(){
  const button = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme') || 'light';
  document.body.classList.toggle('dark-theme', saved === 'dark');
  button.textContent = saved === 'dark' ? '☀️' : '🌙';
  button.addEventListener('click', () => {
    const enabled = document.body.classList.toggle('dark-theme');
    button.textContent = enabled ? '☀️' : '🌙';
    localStorage.setItem('theme', enabled ? 'dark' : 'light');
  });
}

function initProjectFilter(data){
  window.addEventListener('project-filter', e => {
    const category = e.detail;
    const filtered = category === 'All'
      ? data.projects
      : data.projects.filter(project => project.category === category);
    renderProjects(filtered);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadData();
  
  // Initialize interactive features
  initParticleField();
  initTypingAnimation();
  initEasterEggs();
  
  // Render content
  renderProfile(data.profile);
  renderStats(data.stats);
  renderFeaturedMoment(data.moments[0] || {title:'No moment yet', description:'Edit server data to add your first achievement.'});
  renderHeroMarquee(data.highlights);
  animateHeroMarquee(data.highlights);
  renderProjects(data.projects);
  renderProjectFilters(['All', ...new Set(data.projects.map(p => p.category))]);
  initProjectFilter(data);
  renderAnimalStudio(data.animals || []);
  initAnimalStudio(data.animals || []);
  renderBadges(data.medals);
  renderAchievementSummary(data);
  renderTimeline(data.timeline);
  renderSkills(data.skills);
  renderTestimonials(data.testimonials);
  renderGallery(data.gallery);
  renderContact(data.contact);
  document.getElementById('footer-note').textContent = data.footer;

  // Fun facts and carousel
  initFunFacts(data);
  enhanceStats(data);

  // Advanced setup
  setupHeroSVGAnimation();
  setupThemePresets();
  setupScrollStory();

  // audio toggle wiring
  const audioBtn = document.getElementById('audio-toggle');
  let audioActive = false;
  if(audioBtn){
    audioBtn.addEventListener('click', async ()=>{
      if(!audioActive){
        audioBtn.classList.add('active');
        audioBtn.textContent = '🎧';
        await initAudioReactivity();
        audioActive = true;
      } else {
        audioBtn.classList.remove('active');
        audioBtn.textContent = '🔊';
        audioActive = false;
        audioLevel = 0;
      }
    });
  }

  const btnMom = document.getElementById('btn-moments');
  if(btnMom) btnMom.addEventListener('click', () => {
    renderSearchResults(data.moments.map(m => ({...m, title:m.title, description:m.description, date:m.date, type:'Moment'})));
    window.location.hash = '#achievements';
  });
  const btnMil = document.getElementById('btn-milestones');
  if(btnMil) btnMil.addEventListener('click', () => {
    renderSearchResults(data.milestones.map(m => ({...m, title:m.title, description:m.detail, year:m.year, type:'Milestone'})));
    window.location.hash = '#achievements';
  });

  const search = document.getElementById('search');
  if(search) search.addEventListener('input', () => {
    const q = search.value.toLowerCase().trim();
    if (!q) {
      renderSearchResults(data.highlights.map(h => ({title:h.text, description:'Highlight', type:'Highlight'})));
      return;
    }
    const items = getSearchItems(data).filter(item => {
      return Object.values(item).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(q)
      );
    });
    renderSearchResults(items);
  });
  
  setupThemeToggle();
  enhanceReveal();
  initCarousel(data.projects);
  initContactForm();
  
  // Setup new interactive features
  setupQuoteRotation();
  setupNewsletterSubscription();
  setupScrollAnimations();
  animateGrowthChart();

  const footerEl = document.getElementById('footer-note'); 
  if(footerEl) footerEl.textContent = data.footer;
});

// Contact form handler posts to /api/contact
function initContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  const status = document.getElementById('contact-status');
  form.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    status.textContent = 'Sending…';
    try{
      const res = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
      const json = await res.json();
      if(res.ok){ status.textContent = 'Message sent. Thank you!'; form.reset(); }
      else status.textContent = json.error || 'Send failed';
    }catch(err){ status.textContent = 'Network error'; }
    setTimeout(()=> status.textContent = '', 5000);
  });
}

// --- Missing interactive helpers (lightweight implementations) ---
function initParticleField(){
  const container = document.getElementById('particle-field');
  if(!container) return;
  // create canvas
  let canvas = container.querySelector('canvas');
  if(!canvas){
    canvas = document.createElement('canvas');
    container.appendChild(canvas);
  }
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  function resize(){
    w = canvas.width = container.clientWidth || window.innerWidth;
    h = canvas.height = container.clientHeight || 200;
    particles = Array.from({length: Math.max(12, Math.floor(w/120))}).map(()=>({
      x: Math.random()*w, y: Math.random()*h, r: Math.random()*2+0.6, vx:(Math.random()-0.5)*0.4, vy:(Math.random()-0.5)*0.4, alpha: Math.random()*0.6+0.2
    }));
  }
  window.addEventListener('resize', resize);
  resize();
  let raf;
  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(p.x < -10) p.x = w+10; if(p.x > w+10) p.x = -10;
      if(p.y < -10) p.y = h+10; if(p.y > h+10) p.y = -10;
      ctx.beginPath(); ctx.fillStyle = `rgba(255,255,255,${p.alpha})`; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  }
  draw();
  // store to stop later if needed
  container._particleCancel = ()=> cancelAnimationFrame(raf);
}

function initTypingAnimation(){
  const target = document.getElementById('title');
  if(!target) return;
  const obs = new MutationObserver(muts => {
    muts.forEach(m => {
      if(m.type === 'childList'){
        const newText = target.textContent || '';
        target.textContent = '';
        let i = 0;
        const id = setInterval(()=>{
          target.textContent += newText.charAt(i++);
          if(i > newText.length){ clearInterval(id); }
        }, 22);
      }
    });
  });
  obs.observe(target, { childList: true, characterData: true, subtree: true });
}

function initEasterEggs(){
  // simple key toggle for accent glow
  window.addEventListener('keydown', (ev)=>{
    if(ev.key === 'g'){ document.body.classList.toggle('glow-accent'); }
  });
  const logo = document.querySelector('.logo');
  if(logo) logo.addEventListener('dblclick', ()=> document.body.classList.toggle('show-grid'));
}

function initFunFacts(data){
  const txt = document.getElementById('fun-fact-text');
  const btn = document.getElementById('refresh-fun-fact');
  if(!txt || !data || !data.funFacts) return;
  function pick(){
    const choice = data.funFacts[Math.floor(Math.random()*data.funFacts.length)];
    txt.textContent = choice;
  }
  pick();
  if(btn) btn.addEventListener('click', pick);
}

function enhanceStats(data){
  const cards = document.querySelectorAll('.stat-card');
  cards.forEach(card => {
    const valueEl = card.querySelector('.stat-value');
    if(!valueEl) return;
    const raw = valueEl.textContent || '';
    const num = parseInt(raw.replace(/[^0-9]/g,''),10);
    if(Number.isFinite(num) && num > 0){
      let cur = 0; const dur = 900; const start = performance.now();
      function step(now){
        const t = Math.min(1, (now - start) / dur);
        const v = Math.floor(t * num);
        valueEl.textContent = raw.includes('+') ? `${v}+` : `${v}`;
        if(t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    } else {
      valueEl.style.opacity = 0; requestAnimationFrame(()=> valueEl.style.transition='opacity .4s', valueEl.style.opacity=1);
    }
  });
}

function enhanceReveal(){
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en => {
      if(en.isIntersecting) en.target.classList.add('in-view');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.card, .project-card, .testimonial-card, .gallery-card, .animal-detail-card').forEach(el=> io.observe(el));
}

function initCarousel(projects){
  const track = document.getElementById('carousel-track');
  const controls = document.getElementById('carousel-controls');
  const status = document.getElementById('carousel-status');
  if(!track || !projects || !projects.length) return;
  track.innerHTML = '';
  projects.forEach((p, i)=>{
    const slide = document.createElement('div'); 
    slide.className = 'carousel-slide';
    slide.dataset.index = i;
    const img = document.createElement('img'); 
    img.src = p.image; 
    img.alt = p.title; 
    img.className='carousel-image';
    const content = document.createElement('div'); 
    content.className='carousel-slide-content'; 
    content.appendChild(el('h3',null,p.title)); 
    content.appendChild(el('div','muted',p.tagline || p.category || p.summary || ''));
    slide.appendChild(img); 
    slide.appendChild(content);
    track.appendChild(slide);
  });
  let index = 0; 
  const slides = track.children; 
  const total = slides.length;
  function update(){
    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;
    Array.from(slides).forEach((s,i)=> {
      s.classList.toggle('active', i === index);
    });
    if(status) status.textContent = `${index+1} / ${total}`;
  }
  update();
  const prev = el('button','btn btn-icon','‹'); 
  const next = el('button','btn btn-icon','›');
  prev.addEventListener('click', ()=> { index = (index-1+total)%total; update(); });
  next.addEventListener('click', ()=> { index = (index+1)%total; update(); });
  controls.appendChild(prev); 
  controls.appendChild(next);
  let auto = setInterval(()=> { index = (index+1)%total; update(); }, 4500);
  track.addEventListener('mouseenter', ()=> clearInterval(auto));
  track.addEventListener('mouseleave', ()=> auto = setInterval(()=> { index = (index+1)%total; update(); }, 4500));
}

function setupQuoteRotation(){
  const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { text: "In the end, we only regret the chances we didn't take.", author: "Lewis Carroll" },
    { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" }
  ];
  
  let currentQuote = 0;
  const nextBtn = document.getElementById('next-quote');
  if(!nextBtn) return;
  
  function displayQuote(){
    const quote = quotes[currentQuote];
    const quoteEl = document.getElementById('quote-text');
    const authorEl = document.getElementById('quote-author');
    if(quoteEl) quoteEl.textContent = `"${quote.text}"`;
    if(authorEl) authorEl.textContent = `— ${quote.author}`;
  }
  
  displayQuote();
  nextBtn.addEventListener('click', ()=> {
    currentQuote = (currentQuote + 1) % quotes.length;
    displayQuote();
  });
  
  setInterval(()=> {
    currentQuote = (currentQuote + 1) % quotes.length;
    displayQuote();
  }, 8000);
}

function setupNewsletterSubscription(){
  const emailInput = document.getElementById('newsletter-email');
  const btn = document.getElementById('newsletter-btn');
  const status = document.getElementById('newsletter-status');
  
  if(!btn) return;
  
  btn.addEventListener('click', (e)=> {
    e.preventDefault();
    const email = emailInput.value.trim();
    
    if(!email){
      status.textContent = '❌ Please enter an email address';
      status.style.color = '#ff6b6b';
      return;
    }
    
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      status.textContent = '❌ Please enter a valid email address';
      status.style.color = '#ff6b6b';
      return;
    }
    
    status.textContent = '✅ Thanks for subscribing! Check your inbox.';
    status.style.color = 'var(--accent)';
    emailInput.value = '';
    
    setTimeout(()=> {
      status.textContent = '';
    }, 3000);
  });
}

function animateGrowthChart(){
  const chart = document.getElementById('growth-chart');
  if(!chart) return;
  
  const polyline = chart.querySelector('polyline');
  if(!polyline) return;
  
  const length = polyline.getTotalLength();
  polyline.style.strokeDasharray = length;
  polyline.style.strokeDashoffset = length;
  polyline.style.transition = 'stroke-dashoffset 2s ease-in-out';
  
  setTimeout(()=> {
    polyline.style.strokeDashoffset = 0;
  }, 100);
  
  const circles = chart.querySelectorAll('circle[data-index]');
  circles.forEach((circle, i)=> {
    circle.style.opacity = '0';
    circle.style.animation = `none`;
    setTimeout(()=> {
      circle.style.animation = `pulse 0.8s ease-out`;
      circle.style.opacity = '1';
    }, 200 + i * 150);
  });
}

function setupScrollAnimations(){
  const observer = new IntersectionObserver((entries)=> {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
        if(entry.target.id === 'growth-chart' || entry.target.parentElement?.id === 'growth-chart'){
          animateGrowthChart();
        }
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
  });
}

function renderQuotesSection(){
  const quoteSection = document.getElementById('quote-section');
  if(!quoteSection) return;
  
  const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" }
  ];
  
  const quote = quotes[0];
  quoteSection.innerHTML = `
    <h2>💭 Daily Inspiration</h2>
    <div style="margin:24px 0;">
      <p id="quote-text" style="font-size:1.4rem;font-style:italic;color:var(--text);margin:0 0 16px;line-height:1.6;">"${quote.text}"</p>
      <p id="quote-author" style="color:var(--accent);font-weight:600;margin:0;">— ${quote.author}</p>
    </div>
    <button id="next-quote" class="btn btn-secondary" style="margin-top:16px;">Next inspiration ✨</button>
  `;
}

function setupContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  
  form.addEventListener('submit', (e)=> {
    e.preventDefault();
    const email = form.querySelector('input[name="email"]').value;
    const message = form.querySelector('textarea[name="message"]').value;
    const status = document.getElementById('contact-status');
    
    if(!email || !message){
      status.textContent = 'Please fill in all fields';
      status.style.color = '#ff6b6b';
      return;
    }
    
    status.textContent = '✅ Message sent! I\'ll get back to you soon.';
    status.style.color = 'var(--accent)';
    form.reset();
    
    setTimeout(()=> {
      status.textContent = '';
    }, 3000);
  });
}
