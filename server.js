const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');

const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/data', (req, res) => {
  const data = {
    profile: {
      name: 'Sidharth Vellanki',
      title: 'Experience designer, educator, and product storyteller',
      bio: 'I blend software, design, and narrative to create memorable portfolios, digital products, and career milestones.',
      avatar: 'https://photos.fife.usercontent.google.com/pw/AP1GczOGXX3DeNPOEVhVyAIUKZU_aYjdDQC3zsjo6FKDUOk1capGcee78YYO9Q=w1434-h2146-s-no-gm?authuser=0'
    },
    stats: [
      { id: 1, label: 'Years coding', value: '5+', icon: '⏱' },
      { id: 2, label: 'Projects launched', value: '17+', icon: '🚀' },
      { id: 3, label: 'APs Taken', value: '12', icon: '📝' },
      { id: 4, label: 'High school awards', value: '5', icon: '🏅' }
    ],
    moments: [
      { id: 1, title: 'Built a community dashboard', date: '2024-01-14', description: 'Created a live analytics dashboard for community health and engagement.' },
      { id: 2, title: 'Spoke at DevConf', date: '2023-11-08', description: 'Presented on usable design systems and cross-team collaboration.' },
      { id: 3, title: 'Led product launch', date: '2023-05-20', description: 'Delivered a public launch for a creator productivity toolkit.' }
    ],
    milestones: [
      { id: 1, title: 'Started freelance studio', year: 2022, detail: 'Launched a creative studio for polished digital experiences.' },
      { id: 2, title: 'First remote hire', year: 2023, detail: 'Expanded with a remote designer and backend engineer.' },
      { id: 3, title: 'One million visits', year: 2024, detail: 'Surpassed 1M visitors across products and guides.' }
    ],
    medals: [
      { id: 1, name: 'FBLA States Network Design', level: '9th Place', info : 'Designed a network for a school district system project that won 9th place at the state level.' },
      { id: 2, name: 'Design Sprint Leader', level: 'Platinum', info: 'Led rapid iteration cycles from concept to shipped product.' },
      { id: 3, name: 'Hackathon MVP', level: 'Silver', info: 'Won best experience in a 48-hour innovation sprint.' }
    ],
    projects: [
      { id: 1, title: 'Crisis Triage Simulator (Medical)', category: 'Medical', tagline: 'Emergency response', summary: 'A simulation tool for medical professionals to practice triage decisions.', url: 'https://example.com', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80', tags: ['React', 'Medical', 'Simulation'] },
      { id: 2, title: 'Innovate Education Website', category: 'EdTech', tagline: 'Learning platform', summary: 'An engaging platform for online courses with interactive content and progress tracking.', url: 'https://example.com', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80', tags: ['Vue', 'Education', 'Progress'] },
      { id: 3, title: 'Music Production Thingy', category: 'Creative', tagline: 'Audio creation', summary: 'A tool for creating and editing music with a modern interface.', url: 'https://example.com', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80', tags: ['Audio', 'Editing', 'Creative'] }
    ],
    skills: [
      { id: 1, name: 'Java', level: 89},
      { id: 2, name: 'JavaScript', level: 57},
      { id: 3, name: 'Python', level: 63},
      { id: 4, name: 'R', level: 41 },
      { id: 5, name: 'HTML CSS', level: 49}
    ],
    timeline: [
      { id: 1, stage: 'High School', when: 2016, title: 'FBLA States ', detail: 'Built a robotics project that won first place.', category: 'Academics' },
      { id: 2, stage: 'High School', when: 2017, title: 'Debate team captain', detail: 'Led the team to the national finals.', category: 'Leadership' },
      { id: 3, stage: 'College', when: 2019, title: 'Internship at startup', detail: 'Built marketing dashboards and growth tools.', category: 'Internship' },
      { id: 4, stage: 'College', when: 2020, title: 'Designed campus app', detail: 'Created a student event app used by 1,500 students.', category: 'Product' },
      { id: 5, stage: 'Career', when: 2022, title: 'Freelance studio launch', detail: 'Started a service to build product experiences for founders.', category: 'Career' },
      { id: 6, stage: 'Career', when: 2024, title: 'Hosted global workshop', detail: 'Taught UX and product strategy to remote teams.', category: 'Speaking' }
    ],
    testimonials: [
      { id: 1, name: 'Suresh Unc.', role: 'Intern Helper', quote: 'Sidharth turns ambitious ideas into polished, easy-to-use products with thoughtful execution.' },
      { id: 2, name: 'NCHS Teacher.', role: 'Educator', quote: 'Sidharth is a great student and has a strong work ethic, making him a valuable asset to any team.' }
    ],
    gallery: [
      { id: 1, title: 'Workshop highlights', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80' },
      { id: 2, title: 'Design studio', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80' },
      { id: 3, title: 'Launch day', image: 'https://images.unsplash.com/photo-1517430816045-df4b7de46b60?auto=format&fit=crop&w=900&q=80' }
    ],
    contact: {
      email: 'hello@sidharth.dev',
      phone: '+91 98765 43210',
      location: 'Remote / Hyderabad',
      socials: [
        { id: 1, name: 'LinkedIn', href: 'https://linkedin.com', icon: '🔗' },
        { id: 2, name: 'GitHub', href: 'https://github.com', icon: '🐙' },
        { id: 3, name: 'Twitter', href: 'https://twitter.com', icon: '🐦' }
      ]
    },
    highlights: [
      { id: 1, text: 'Built award-winning school robotics and design projects.' },
      { id: 2, text: 'Created digital tools used by teams and communities globally.' },
      { id: 3, text: 'Mentored students, interns, and creators through guided sprints.' }
    ],
    animals: [
      {
        id: 1,
        name: 'Pink',
        emoji: '🩷',
        role: 'Design scout',
        fact: 'Tracks creative systems and weaves color palettes into polished experiences.',
        tags: ['Strategy', 'UI', 'Motion'],
        colorAccent: '#f5a6ff',
        colorStrong: '#8b5cf6',
        background: 'radial-gradient(circle at 20% 20%, rgba(245,166,255,0.22), transparent 24%), linear-gradient(180deg,#090910,#0d1224)'
      },
      {
        id: 2,
        name: 'Green',
        emoji: '💛',
        role: 'Flow engineer',
        fact: 'Glides through product journeys with bright interactions and friendly logic.',
        tags: ['Animation', 'UX', 'Code'],
        colorAccent: '#6ee7b7',
        colorStrong: '#10b981',
        background: 'radial-gradient(circle at 80% 30%, rgba(110,231,183,0.22), transparent 18%), linear-gradient(180deg,#02060b,#081321)'
      },
      {
        id: 3,
        name: 'Purple',
        emoji: '💜',
        role: 'Insight guardian',
        fact: 'Sees through patterns, making data, stories, and interactivity feel effortless.',
        tags: ['Research', 'Analytics', 'Storytelling'],
        colorAccent: '#8b93ff',
        colorStrong: '#3b82f6',
        background: 'radial-gradient(circle at 40% 15%, rgba(139,147,255,0.24), transparent 20%), linear-gradient(180deg,#060810,#111a2f)'
      },
      {
        id: 4,
        name: 'Orange',
        emoji: '🧡',
        role: 'Build champion',
        fact: 'Solves tough problems with clear structure and steady momentum.',
        tags: ['Architecture', 'Optimization', 'Reliability'],
        colorAccent: '#fbbf24',
        colorStrong: '#f59e0b',
        background: 'radial-gradient(circle at 15% 80%, rgba(251,191,36,0.16), transparent 20%), linear-gradient(180deg,#0c0f16,#131b2c)'
      }
    ],
    funFacts: [
      '🎨 I design experiences that make people smile.',
      '🚀 Built 17+ projects that are used by real people.',
      '💡 Love turning "impossible" into "done".',
      '🎯 Focus on clarity, simplicity, and joy.',
      '📚 Lifelong learner, currently exploring AI/ML.',
      '🎭 Believe in storytelling through code.',
      '⚡ Best ideas happen at 3 AM (or with coffee).',
      '🌍 Remote-first, community-driven, always shipping.',
      '🎵 Keyboard shortcuts are my second language.',
      '✨ Making the web beautiful, one pixel at a time.',
      '🔧 I debug by rubber ducking (talking to my plants).',
      '🎬 Every project is a short film in my head first.',
      '🌟 Bug: "It works on my machine!" Feature: It will now work anywhere.',
      '⚙️ There\'s no such thing as "just frontend" or "just backend"—it\'s all a vibe.',
      '🎪 My favorite code is the code I don\'t have to write.'
    ],
    footer: 'This portfolio is updated live via server and refreshed when content changes.'
  };
  res.json(data);
});

// Receive contact form submissions and append to a local file
app.post('/api/contact', (req, res) => {
  const entry = Object.assign({ receivedAt: new Date().toISOString() }, req.body || {});
  const file = path.join(__dirname, 'contacts.json');
  fs.readFile(file, 'utf8', (err, raw) => {
    let list = [];
    if(!err){
      try{ list = JSON.parse(raw) || []; }catch(e){ list = []; }
    }
    list.push(entry);
    fs.writeFile(file, JSON.stringify(list, null, 2), (werr) => {
      if(werr) return res.status(500).json({ error: 'Failed to save message' });
      res.json({ ok: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
