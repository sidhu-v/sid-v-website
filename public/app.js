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
    grid.appendChild(card);
  });
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
