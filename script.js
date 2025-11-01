    // Theme persistence like index.html
    const html = document.documentElement;
    const saved = localStorage.getItem('theme');
    function applyTheme(mode){ html.classList.remove('light','dark'); if(mode) html.classList.add(mode);
      document.getElementById('themeToggle').checked = (html.classList.contains('dark') || (!html.classList.contains('light') && window.matchMedia('(prefers-color-scheme: dark)').matches)); }
    applyTheme(saved);
    document.getElementById('themeToggle').addEventListener('change',(e)=>{ const mode = e.target.checked ? 'dark' : 'light'; applyTheme(mode); localStorage.setItem('theme', mode); });

    // Filtering logic: text search + tag chips (OR across chips, AND with text)
    const q = document.getElementById('q');
    const chips = Array.from(document.querySelectorAll('.chip'));
    const grid = document.getElementById('grid');
    const cards = Array.from(grid.querySelectorAll('.card'));

    let activeTags = new Set();

    function normalize(s){ return (s||'').toLowerCase().trim(); }

    function updateChipsUI(){
      chips.forEach(ch => ch.classList.toggle('active', activeTags.has(ch.dataset.tag) || (activeTags.size===0 && ch.dataset.tag==='all')));
    }

    function filter(){
      const term = normalize(q.value);
      cards.forEach(card => {
        const tags = normalize(card.dataset.tags || '');
        const title = normalize(card.dataset.title || '');
        const text = normalize(card.innerText || '');
        const tagHit = (activeTags.size===0 || activeTags.has('all')) ? true
                      : Array.from(activeTags).some(t => tags.includes(t));
        const textHit = !term ? true : (title.includes(term) || tags.includes(term) || text.includes(term));
        card.style.display = (tagHit && textHit) ? '' : 'none';
      });
    }

    // Chip clicks
    chips.forEach(ch => {
      ch.addEventListener('click', () => {
        const tag = ch.dataset.tag;
        if (tag === 'all') { activeTags.clear(); }
        else {
          if (activeTags.has('all')) activeTags.delete('all');
          if (activeTags.has(tag)) activeTags.delete(tag); else activeTags.add(tag);
        }
        updateChipsUI();
        filter();
      });
    });

    // Search input
    q.addEventListener('input', filter);

    // Initialize
    updateChipsUI();
    filter();