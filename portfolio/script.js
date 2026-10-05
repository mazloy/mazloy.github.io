const dialog = document.querySelector('.film-dialog');
const filmLinks = document.querySelectorAll('[data-film]');
let activeFilmLink;
const mount = document.querySelector('#player-mount');
const loading = document.querySelector('.player-loading');
let loadingTimer;

filmLinks.forEach((filmLink) => filmLink.addEventListener('click', (event) => {
  // Preserve open-in-new-tab gestures and the direct link as a no-JS fallback.
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !dialog.showModal) return;
  event.preventDefault();
  activeFilmLink = filmLink;
  const { film, title, year, duration } = filmLink.dataset;
  document.querySelector('#film-title').textContent = title;
  document.querySelector('.dialog-footer > span').textContent = `${year} · ${duration}`;
  document.querySelector('.dialog-footer a').href = filmLink.href;
  loading.hidden = false;
  const player = document.createElement('iframe');
  player.title = title;
  player.src = `https://player.vimeo.com/video/${film}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`;
  player.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
  player.allowFullscreen = true;
  player.referrerPolicy = 'strict-origin-when-cross-origin';
  player.addEventListener('load', () => { loading.hidden = true; });
  mount.replaceChildren(player);
  dialog.showModal();
  document.body.classList.add('player-open');
  loadingTimer = setTimeout(() => { loading.hidden = true; }, 12000);
}));

document.querySelector('.close-film')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog?.addEventListener('close', () => {
  clearTimeout(loadingTimer);
  mount.replaceChildren(); // Removing the player stops audio and playback.
  document.body.classList.remove('player-open');
  activeFilmLink?.focus({ preventScroll: true });
});

document.querySelector('#year').textContent = new Date().getFullYear();
