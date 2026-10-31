/* Game page: hero scene, verdict, tabbed write-up, challenge, other worlds. */
(function () {
  var params = new URLSearchParams(location.search);
  var g = SP.byId(params.get('id'));
  var main = document.getElementById('game');

  document.getElementById('footer-links').innerHTML = SP.games.map(function (x) {
    return '<a href="game.html?id=' + x.id + '">' + x.name + '</a>';
  }).join('');

  if (!g) {
    main.innerHTML = '<section class="wrap section"><div class="section-head"><h1 class="h2">找不到這個存檔。</h1>' +
      '<p class="lead muted">網址裡的遊戲不在清單上。回首頁挑一座島吧。</p></div>' +
      '<a class="btn btn-primary btn-lg" href="index.html">回到首頁</a></section>';
    return;
  }

  document.title = g.name + '｜存檔點';
  var idx = SP.games.indexOf(g);

  var tabs = [
    { id: 'intro', label: '介紹', html: '<h2 class="h3">遊戲介紹。</h2><div class="prose">' + g.intro.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>' },
    { id: 'howto', label: '玩法', html: '<h2 class="h3">怎麼玩。</h2><ol class="steps">' + g.howto.map(function (s) { return '<li><div><strong>' + s.t + '</strong><span>' + s.d + '</span></div></li>'; }).join('') + '</ol>' },
    { id: 'why', label: '推薦原因', html: '<h2 class="h3">為什麼推薦。</h2><div class="reasons">' + g.why.map(function (r) { return '<div class="reason"><h3>' + r.t + '</h3><p>' + r.d + '</p></div>'; }).join('') + '</div>' },
    { id: 'review', label: '心得', html:
      '<h2 class="h3">我的遊玩心得。</h2><div class="review">' +
        '<div class="review-card">' +
          '<div class="verdict-top"><span class="badge-rec">' + thumb() + '推薦</span><span class="verdict-hours">遊玩時數 <b>' + SP.fmt(g.hours) + '</b> 小時</span></div>' +
          '<div class="prose">' + g.review.body.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>' +
        '</div>' +
        '<div class="pc-list">' +
          '<div class="pc"><h3>喜歡的地方</h3><ul>' + g.review.pros.map(li).join('') + '</ul></div>' +
          '<div class="pc"><h3>要有心理準備</h3><ul>' + g.review.cons.map(li).join('') + '</ul></div>' +
        '</div>' +
      '</div>' }
  ];

  function li(t) { return '<li>' + t + '</li>'; }
  function thumb() {
    return '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 21h4V9H2v12zm20-11a2 2 0 0 0-2-2h-6.3l1-4.6v-.3c0-.4-.2-.8-.4-1.1L13.2 1 6.6 7.6C6.2 8 6 8.5 6 9v10a2 2 0 0 0 2 2h9c.8 0 1.5-.5 1.8-1.2l3-7.1c.1-.2.2-.5.2-.7v-2z"/></svg>';
  }

  var others = SP.games.slice(idx + 1).concat(SP.games.slice(0, idx));

  main.innerHTML =
    '<section class="wrap g-hero" aria-labelledby="g-title">' +
      '<div class="g-scene">' + SP.scene(g.id, 'hero-' + g.id) +
        '<div class="g-tags">' + g.tags.map(function (t) { return '<span class="badge-overlay">' + t + '</span>'; }).join('') + '</div></div>' +
      '<div class="g-title"><span class="squircle">' + SP.icon(g.id) + '</span>' +
        '<div><h1 class="h2" id="g-title">' + g.name + '</h1></div></div>' +
      '<p class="lead">' + g.tagline + '</p>' +
      '<dl class="g-meta">' +
        '<div><dt>開發</dt><dd>' + g.dev + '</dd></div>' +
        '<div><dt>推出</dt><dd>' + g.year + '</dd></div>' +
        '<div><dt>類型</dt><dd>' + g.genre + '</dd></div>' +
        '<div><dt>平台</dt><dd>' + g.platforms + '</dd></div>' +
      '</dl>' +
      '<div class="verdict">' +
        '<div class="verdict-top"><span class="badge-rec">' + thumb() + '推薦</span><span class="verdict-hours">遊玩時數 <b>' + SP.fmt(g.hours) + '</b> 小時</span></div>' +
        '<blockquote>' + g.review.quote + '</blockquote>' +
      '</div>' +
    '</section>' +

    '<section class="wrap" aria-label="遊戲內容">' +
      '<div class="seg" role="tablist" aria-label="內容分頁">' +
        tabs.map(function (t, i) {
          return '<button role="tab" type="button" id="tab-' + t.id + '" aria-controls="panel-' + t.id + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' + t.label + '</button>';
        }).join('') +
      '</div>' +
      tabs.map(function (t, i) {
        return '<div class="panel" role="tabpanel" id="panel-' + t.id + '" aria-labelledby="tab-' + t.id + '"' + (i ? ' hidden' : '') + '>' + t.html + '</div>';
      }).join('') +
    '</section>' +

    '<section class="wrap section challenge" id="challenge" aria-labelledby="ch-title">' +
      '<div class="section-head"><h2 class="h2" id="ch-title">迷你挑戰。</h2>' +
        '<p class="lead muted">一分鐘內玩完，手機單手就能操作。</p></div>' +
      '<div class="stage-wrap" id="stage-root"></div>' +
    '</section>' +

    '<section class="wrap section" aria-labelledby="more-title">' +
      '<div class="section-head"><h2 class="h3" id="more-title">其他世界。</h2></div>' +
      '<div class="other-worlds">' + others.map(function (x) {
        return '<a class="world-chip" href="game.html?id=' + x.id + '"><span class="squircle">' + SP.icon(x.id) + '</span><span>' + x.name + '</span></a>';
      }).join('') + '</div>' +
    '</section>';

  // Segmented tabs
  var tabEls = Array.prototype.slice.call(main.querySelectorAll('[role="tab"]'));
  var seg = main.querySelector('.seg');
  function select(i, focus) {
    tabEls.forEach(function (b, k) {
      var on = k === i;
      b.setAttribute('aria-selected', on);
      b.tabIndex = on ? 0 : -1;
      document.getElementById(b.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tabEls[i].focus();
    // Keep the panel top in view when switching from far down the page.
    var top = seg.getBoundingClientRect().top;
    var panelTop = document.getElementById(tabEls[i].getAttribute('aria-controls')).getBoundingClientRect().top;
    if (panelTop < top) window.scrollBy({ top: panelTop - top - 72, behavior: 'smooth' });
  }
  tabEls.forEach(function (b, i) {
    b.addEventListener('click', function () { select(i); });
    b.addEventListener('keydown', function (e) {
      var n = tabEls.length;
      if (e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % n, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); select((i - 1 + n) % n, true); }
      if (e.key === 'Home') { e.preventDefault(); select(0, true); }
      if (e.key === 'End') { e.preventDefault(); select(n - 1, true); }
    });
  });

  SP.mountChallenge(document.getElementById('stage-root'), g);

  if (location.hash === '#challenge') {
    requestAnimationFrame(function () { document.getElementById('challenge').scrollIntoView(); });
  }
})();
