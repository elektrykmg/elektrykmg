(() => {
  const viewer = document.getElementById('photo-viewer');
  if (!viewer || typeof viewer.showModal !== 'function') return;
  const full = document.getElementById('photo-full');
  const caption = document.getElementById('photo-caption');
  const close = viewer.querySelector('.photo-close');
  let source = null;
  let savedX = 0;
  let savedY = 0;
  let previousOverflow = '';
  document.querySelectorAll('.project-card > a').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const image = link.querySelector('img');
      if (!image || viewer.open) return;
      event.preventDefault();
      source = link;
      savedX = window.scrollX;
      savedY = window.scrollY;
      previousOverflow = document.documentElement.style.overflow;
      full.src = link.getAttribute('href');
      full.alt = image.alt;
      caption.textContent = link.closest('.project-card').querySelector('h3').textContent;
      viewer.showModal();
      document.documentElement.style.overflow = 'hidden';
      close.focus({ preventScroll: true });
    });
  });
  close.addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close();
  });
  // Escape closes the native dialog and uses the same restoration path.
  viewer.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow;
    if (source) source.focus({ preventScroll: true });
    window.scrollTo({ left: savedX, top: savedY, behavior: 'instant' });
    full.removeAttribute('src');
    full.alt = '';
    caption.textContent = '';
  });
})();
