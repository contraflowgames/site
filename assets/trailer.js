// The NeCity trailer: a poster and a play button until it is pressed, so
// nothing from Google loads with the page. Pressing it swaps in the
// youtube-nocookie player. The video ID is read from the figure's "Watch on
// YouTube" link, its one place on the page, which also serves visitors
// without JavaScript (the button stays hidden for them).
(function () {
  document.querySelectorAll('figure.trailer').forEach(function (figure) {
    var link = figure.querySelector('a.trailer-link');
    var button = figure.querySelector('button.trailer-play');
    var frame = figure.querySelector('.trailer-frame');
    var match = link && /youtu\.be\/([\w-]{11})/.exec(link.href);
    if (!button || !frame || !match) return;
    button.hidden = false;
    button.addEventListener('click', function () {
      var player = document.createElement('iframe');
      player.src = 'https://www.youtube-nocookie.com/embed/' + match[1] + '?autoplay=1&rel=0';
      player.title = 'NeCity trailer';
      player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      player.allowFullscreen = true;
      // YouTube refuses to play an embed that sends no referrer.
      player.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.replaceChildren(player);
      player.focus();
    });
  });
})();
