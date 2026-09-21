(() => {
  'use strict';
  const config = window.portfolio;
  const grid = document.querySelector('#project-grid');
  const dialog = document.querySelector('#project-dialog');
  const projects = config.projects;
  const safeUrl = value => {
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; }
    catch { return ''; }
  };
  document.querySelectorAll('[data-name]').forEach(el => { el.textContent = config.name; });
  document.querySelectorAll('[data-github]').forEach(el => { el.href = safeUrl(config.github) || 'https://github.com'; });
  document.querySelector('#intro').textContent = config.intro;
  document.querySelector('#bio').textContent = config.bio;
  document.querySelector('#year').textContent = new Date().getFullYear();
  document.title = `${config.name} — Code & Sound`;
  (config.links || []).forEach(item => {
    const url = safeUrl(item.url);
    const tile = document.createElement(url ? 'a' : 'div');
    tile.className = `link-tile${url ? '' : ' link-placeholder'}`;
    if (url) { tile.href = url; tile.target = '_blank'; tile.rel = 'noopener noreferrer'; }
    const title = document.createElement('h3'); title.textContent = item.title;
    const marker = document.createElement('span'); marker.className = 'link-marker'; marker.textContent = url ? '↗' : 'COMING SOON';
    tile.append(title, marker);
    document.querySelector('#links-grid').append(tile);
  });
  function tags(items) {
    const fragment = document.createDocumentFragment();
    (items || []).forEach(text => { const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = text; fragment.append(tag); });
    return fragment;
  }
  function openProject(project) {
    document.querySelector('#dialog-kind').textContent = project.label;
    document.querySelector('#dialog-title').textContent = project.title;
    document.querySelector('#dialog-description').textContent = project.description;
    document.querySelector('#dialog-tags').replaceChildren(tags(project.tags));
    const link = document.querySelector('#dialog-link');
    const url = safeUrl(project.url);
    link.hidden = !url;
    if (url) { link.href = url; link.textContent = project.kind === 'code' ? 'View project ↗' : 'Listen / explore ↗'; }
    else { link.removeAttribute('href'); }
    document.querySelector('#dialog-placeholder').hidden = !project.sample;
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
  function render(filter = 'all') {
    grid.replaceChildren();
    const selection = projects.filter(project => filter === 'all' || project.kind === filter);
    document.querySelector('.section-note').textContent = String(selection.length).padStart(2, '0') + ' projects';
    selection.forEach(project => {
      const card = document.createElement('article'); card.className = 'project-card';
      const button = document.createElement('button'); button.type = 'button'; button.className = 'card-button';
      button.setAttribute('aria-label', `Explore ${project.title}${project.sample ? ' (sample project)' : ''}`);
      button.setAttribute('aria-haspopup', 'dialog');
      const number = document.createElement('span'); number.className = 'project-number'; number.textContent = String(projects.indexOf(project) + 1).padStart(2, '0');
      const body = document.createElement('div'); body.className = 'card-body';
      const label = document.createElement('div'); label.className = 'card-label'; label.textContent = (project.kind === 'code' ? 'Code' : 'Sound') + (project.sample ? ' / Placeholder' : '');
      const titleRow = document.createElement('div'); titleRow.className = 'card-title-row';
      const title = document.createElement('h3'); title.textContent = project.title; title.dataset.text = project.title;
      const arrow = document.createElement('span'); arrow.className = 'card-arrow'; arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true'); titleRow.append(title, arrow);
      body.append(titleRow, label); button.append(number, body); card.append(button); grid.append(card);
      button.addEventListener('click', () => openProject(project));
    });
    if (!selection.length) { const empty = document.createElement('p'); empty.className = 'empty-state'; empty.textContent = 'No projects here yet. Check back for new experiments.'; grid.append(empty); }
    document.querySelector('#project-status').textContent = `${String(selection.length).padStart(2, '0')} PROJECT${selection.length === 1 ? '' : 'S'} / ${filter === 'all' ? 'ALL DISCIPLINES' : filter === 'code' ? 'CODE' : 'SOUND'}`;
    refreshTears();
  }
  document.querySelectorAll('.filter').forEach(button => {
    const filter = button.dataset.filter;
    document.querySelector(`#${filter}-count`).textContent = String(projects.filter(p => filter === 'all' || p.kind === filter).length).padStart(2, '0');
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(other => { const selected = other === button; other.classList.toggle('active', selected); other.setAttribute('aria-pressed', String(selected)); });
      render(filter);
    });
  });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  // A bounded particle pool keeps pointer movement independent of DOM allocation.
  const pointerMotion = matchMedia('(any-pointer: fine) and (prefers-reduced-motion: no-preference)');
  const cursorGlitch = document.createElement('div');
  cursorGlitch.className = 'cursor-glitch';
  cursorGlitch.setAttribute('aria-hidden', 'true');
  document.body.append(cursorGlitch);
  // Inert visual copies let narrow slices show displaced page content, including
  // text and artwork, without moving the actual controls or their hit targets.
  const tears = Array.from({ length: 2 }, () => {
    const layer = document.createElement('div');
    layer.className = 'cursor-tear';
    layer.setAttribute('aria-hidden', 'true');
    layer.inert = true;
    const copy = document.createElement('div');
    copy.className = 'cursor-copy';
    layer.append(copy);
    cursorGlitch.before(layer);
    return { layer, copy };
  });
  function refreshTears() {
    tears.forEach(({ copy }) => {
      copy.replaceChildren(...Array.from(document.querySelectorAll('body > header, body > main, body > footer'), source => {
        const clone = source.cloneNode(true);
        clone.querySelectorAll('[id]').forEach(element => {
          element.dataset.sourceId = element.id;
          element.removeAttribute('id');
        });
        if (clone.id) { clone.dataset.sourceId = clone.id; clone.removeAttribute('id'); }
        return clone;
      }));
    });
  }
  let tearBorn = -Infinity;
  const fragments = Array.from({ length: 16 }, () => {
    const element = document.createElement('span');
    cursorGlitch.append(element);
    return { element, born: -Infinity, x: 0, y: 0, width: 0, height: 0 };
  });
  let frame = 0;
  let nextFragment = 0;
  let pointer = null;
  let previousPointer = null;
  let moved = false;
  function clearCursorGlitch() {
    cancelAnimationFrame(frame);
    frame = 0;
    pointer = previousPointer = null;
    moved = false;
    tearBorn = -Infinity;
    tears.forEach(({ layer }) => { layer.style.opacity = '0'; });
    fragments.forEach(fragment => {
      fragment.born = -Infinity;
      fragment.element.style.opacity = '0';
    });
  }
  function drawCursorGlitch(now) {
    frame = 0;
    if (moved && pointer) {
      tearBorn = now;
      const distance = previousPointer ? Math.hypot(pointer.x - previousPointer.x, pointer.y - previousPointer.y) : 0;
      const strength = Math.min(distance / 35, 1);
      for (let i = 0; i < 3; i++) {
        const fragment = fragments[nextFragment++ % fragments.length];
        const trail = i / 3;
        fragment.x = pointer.x - (previousPointer ? (pointer.x - previousPointer.x) * trail : 0) + (Math.random() - .5) * 24;
        fragment.y = pointer.y - (previousPointer ? (pointer.y - previousPointer.y) * trail : 0) + (Math.random() - .5) * 32;
        fragment.width = 10 + Math.random() * 30 + strength * 35;
        fragment.height = i === 0 ? 1 : 2 + Math.floor(Math.random() * 5);
        fragment.born = now;
        fragment.element.style.width = `${fragment.width}px`;
        fragment.element.style.height = `${fragment.height}px`;
      }
      previousPointer = { ...pointer };
      moved = false;
    }
    let active = false;
    const tearLife = (now - tearBorn) / 240;
    tears.forEach(({ layer, copy }, index) => {
      if (!pointer || tearLife >= 1) { layer.style.opacity = '0'; return; }
      active = true;
      const phase = Math.floor((now - tearBorn) / 45);
      const shift = (index ? -1 : 1) * (9 + phase % 3 * 5);
      const x = pointer.x - 76;
      const y = pointer.y + (index ? 7 : -15);
      const width = 140 + (phase % 3) * 9;
      const height = index ? 7 : 12;
      layer.style.clipPath = `polygon(${x}px ${y}px, ${x + width}px ${y}px, ${x + width}px ${y + height}px, ${x}px ${y + height}px)`;
      layer.style.opacity = String(1 - tearLife);
      copy.style.transform = `translate3d(${shift}px, ${-window.scrollY}px, 0)`;
    });
    fragments.forEach((fragment, index) => {
      const life = (now - fragment.born) / 240;
      if (life >= 1) { fragment.element.style.opacity = '0'; return; }
      active = true;
      const jitter = ((Math.floor((now - fragment.born) / 45) + index) % 3 - 1) * 5;
      fragment.element.style.transform = `translate3d(${fragment.x - fragment.width / 2 + jitter}px, ${fragment.y}px, 0)`;
      fragment.element.style.opacity = String((1 - life) * .65);
    });
    if (active) frame = requestAnimationFrame(drawCursorGlitch);
  }
  window.addEventListener('pointermove', event => {
    if (!pointerMotion.matches || event.pointerType !== 'mouse' || dialog.open) { clearCursorGlitch(); return; }
    pointer = { x: event.clientX, y: event.clientY };
    moved = true;
    if (!frame) frame = requestAnimationFrame(drawCursorGlitch);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', clearCursorGlitch);
  window.addEventListener('blur', clearCursorGlitch);
  window.addEventListener('scroll', clearCursorGlitch, { passive: true });
  window.addEventListener('resize', () => { clearCursorGlitch(); refreshTears(); });
  document.addEventListener('visibilitychange', clearCursorGlitch);
  document.addEventListener('pointerdown', clearCursorGlitch, { passive: true });
  pointerMotion.addEventListener('change', clearCursorGlitch);
  render();
})();
