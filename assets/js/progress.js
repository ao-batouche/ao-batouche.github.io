(() => {
  const progress = document.getElementById('progress');
  const navbar = document.getElementById('navbar');
  if (!progress || !navbar) return;
  let scheduled = false;
  function update() {
    scheduled = false;
    const height = navbar.getBoundingClientRect().height;
    const distance = document.documentElement.scrollHeight - innerHeight;
    progress.style.top = height + 'px';
    progress.max = Math.max(1, distance);
    progress.value = Math.max(0, Math.min(scrollY, distance));
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', schedule);
  addEventListener('load', schedule);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    observer.observe(navbar);
    observer.observe(document.body);
  }
  update();
})();
