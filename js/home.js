/* Home: archipelago, save-slot shelf, arcade list. */
(function () {
  var sorted = SP.games.slice().sort(function (a, b) { return b.hours - a.hours; });

  document.getElementById('shelf').innerHTML = sorted.map(function (g) {
    return '<a class="slot" href="game.html?id=' + g.id + '">' +
      '<div class="slot-scene">' + SP.scene(g.id, 'slot-' + g.id) +
        '<span class="badge-overlay">' + g.genre + '</span></div>' +
      '<div class="slot-row">' +
        '<span class="squircle">' + SP.icon(g.id) + '</span>' +
        '<div><div class="slot-title">' + g.name + '</div><div class="caption">' + g.dev + '，' + g.year + '</div></div>' +
        '<div class="slot-hours"><b>' + SP.fmt(g.hours) + '</b><span class="caption">小時</span></div>' +
      '</div>' +
      '<p class="slot-quote">' + g.tagline + '</p>' +
    '</a>';
  }).join('');

  function renderArcade() {
    document.getElementById('arcade-list').innerHTML = SP.games.map(function (g) {
      var best = SP.best.get(g.id);
      return '<div class="arcade-row">' +
        '<span class="squircle">' + SP.icon(g.id) + '</span>' +
        '<div class="arcade-text"><strong>' + g.challenge.title.replace(/。$/, '') + '</strong>' +
        '<span>' + g.short + (best ? '，最佳 ' + SP.fmt(best) : '，還沒有紀錄') + '</span></div>' +
        '<a class="btn btn-primary" href="game.html?id=' + g.id + '#challenge" aria-label="開始' + g.challenge.title.replace(/。$/, '') + '">開始</a>' +
      '</div>';
    }).join('');
  }
  renderArcade();
  window.addEventListener('pageshow', renderArcade);

  document.getElementById('footer-links').innerHTML = SP.games.map(function (g) {
    return '<a href="game.html?id=' + g.id + '">' + g.name + '</a>';
  }).join('');

  SP.initArchipelago(document.getElementById('archipelago'));
})();
