// Game pictures open full size. Each picture is a link to its largest file
// (a.zoom), which already works without JavaScript; this upgrades the link to a
// full-screen viewer with close, previous and next. The pictures of one game
// form one set, in page order. Escape, the backdrop or Close shuts it; the
// arrow keys and a sideways swipe step through the set.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('a.zoom'));
  if (!links.length || typeof HTMLDialogElement !== 'function') return;

  var dialog = document.createElement('dialog');
  dialog.className = 'viewer';
  dialog.setAttribute('aria-label', 'Picture, full size');
  dialog.innerHTML =
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button type="button" class="viewer-close" aria-label="Close">Close</button>' +
    '<button type="button" class="viewer-prev" aria-label="Previous picture"><svg viewBox="0 0 64 32" width="40" height="20" aria-hidden="true"><polyline points="40,6 28,16 40,26" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
    '<button type="button" class="viewer-next" aria-label="Next picture"><svg viewBox="0 0 64 32" width="40" height="20" aria-hidden="true"><polyline points="24,6 36,16 24,26" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
  document.body.appendChild(dialog);
  var img = dialog.querySelector('figure img');
  var caption = dialog.querySelector('figcaption');
  var prev = dialog.querySelector('.viewer-prev');
  var next = dialog.querySelector('.viewer-next');
  var set = [], index = 0, opener = null;

  function setOf(link) {
    var group = link.closest('article, .featured, section') || document.body;
    return links.filter(function (l) { return group.contains(l); });
  }
  function show(i) {
    index = (i + set.length) % set.length;
    var link = set[index], thumb = link.querySelector('img');
    img.src = link.href;
    img.alt = thumb ? thumb.alt : '';
    caption.textContent = (set.length > 1 ? (index + 1) + ' of ' + set.length + ' · ' : '') + img.alt;
    prev.hidden = next.hidden = set.length < 2;
  }
  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button) return;
      event.preventDefault();
      opener = link;
      set = setOf(link);
      show(set.indexOf(link));
      dialog.showModal();
    });
  });
  dialog.querySelector('.viewer-close').addEventListener('click', function () { dialog.close(); });
  prev.addEventListener('click', function () { show(index - 1); });
  next.addEventListener('click', function () { show(index + 1); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });
  dialog.addEventListener('close', function () { if (opener) opener.focus(); });
  var startX = null;
  dialog.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX; startX = null;
    if (Math.abs(dx) > 50 && set.length > 1) show(index + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
