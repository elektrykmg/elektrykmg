(() => {
  const viewer = document.getElementById('photo-viewer');
  if (!viewer || typeof viewer.showModal !== 'function') return;
  const full = viewer.querySelector('#photo-full');
  const caption = viewer.querySelector('#photo-caption');
  const close = viewer.querySelector('.photo-close');
  const prev = viewer.querySelector('.photo-prev');
  const next = viewer.querySelector('.photo-next');
  const counter = viewer.querySelector('.photo-counter');
  const groups = new Map();
  let items = [], index = 0, source = null, savedX = 0, savedY = 0, previousOverflow = '';
  document.querySelectorAll('a[data-gallery]').forEach(link => {
    const group = link.dataset.gallery;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(link);
  });
  function display(i) {
    if (!items.length) return;
    index = (i + items.length) % items.length;
    const link = items[index];
    const img = link.querySelector('img');
    full.src = link.href;
    full.alt = img?.alt || '';
    caption.textContent = link.dataset.caption || link.closest('.project-card')?.querySelector('h3')?.textContent || img?.alt || '';
    counter.textContent = (index + 1) + ' / ' + items.length;
    prev.hidden = next.hidden = items.length < 2;
  }
  groups.forEach(group => group.forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0 || viewer.open) return;
    event.preventDefault();
    items = group;
    source = link;
    savedX = window.scrollX;
    savedY = window.scrollY;
    previousOverflow = document.documentElement.style.overflow;
    display(items.indexOf(link));
    viewer.showModal();
    document.documentElement.style.overflow = 'hidden';
    close.focus({ preventScroll: true });
  })));
  prev.addEventListener('click', () => display(index - 1));
  next.addEventListener('click', () => display(index + 1));
  close.addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && items.length > 1) { event.preventDefault(); display(index - 1); }
    if (event.key === 'ArrowRight' && items.length > 1) { event.preventDefault(); display(index + 1); }
  });
  let startX = null, startY = null;
  viewer.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) return;
    startX = event.touches[0].clientX; startY = event.touches[0].clientY;
  }, { passive: true });
  viewer.addEventListener('touchend', event => {
    if (startX === null || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - startX;
    const dy = event.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3 && items.length > 1) display(index + (dx < 0 ? 1 : -1));
    startX = startY = null;
  }, { passive: true });
  viewer.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow;
    if (source) source.focus({ preventScroll: true });
    window.scrollTo({ left: savedX, top: savedY, behavior: 'instant' });
    full.removeAttribute('src'); full.alt = ''; caption.textContent = '';
    items = []; source = null;
  });
})();
