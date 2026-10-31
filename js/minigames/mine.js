/* Minecraft — 挖到鑽石: minesweeper-style hints lead you to diamonds before the pickaxe breaks. */
(function () {
  var N = 6, SWINGS = 20, DIAMONDS = 4;
  var ORE = {
    coal: { pts: 1, svg: '<svg viewBox="0 0 8 8"><rect x="1" y="1" width="2" height="2" fill="#1d1d1d"/><rect x="4" y="2" width="3" height="2" fill="#2b2b2b"/><rect x="2" y="5" width="3" height="2" fill="#1d1d1d"/></svg>' },
    iron: { pts: 3, svg: '<svg viewBox="0 0 8 8"><rect x="1" y="1" width="2" height="2" fill="#e8b48a"/><rect x="5" y="1" width="2" height="2" fill="#d79a6a"/><rect x="3" y="4" width="2" height="2" fill="#e8b48a"/><rect x="1" y="6" width="2" height="1" fill="#d79a6a"/><rect x="5" y="5" width="2" height="2" fill="#e8b48a"/></svg>' },
    diamond: { pts: 10, svg: '<svg viewBox="0 0 8 8"><rect x="2" y="1" width="4" height="1" fill="#bff6ff"/><rect x="1" y="2" width="6" height="2" fill="#4fe0f0"/><rect x="2" y="4" width="4" height="1" fill="#2bc4d8"/><rect x="3" y="5" width="2" height="2" fill="#1aa3b8"/><rect x="2" y="2" width="1" height="1" fill="#fff"/></svg>' },
    lava: { pts: 0, svg: '<svg viewBox="0 0 8 8"><rect width="8" height="8" fill="#ff7a1a"/><rect x="1" y="1" width="3" height="2" fill="#ffc23d"/><rect x="5" y="4" width="2" height="3" fill="#ffc23d"/><rect x="0" y="5" width="3" height="2" fill="#d94a0a"/></svg>' }
  };
  var STONE = 'url("data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" shape-rendering="crispEdges"><rect width="8" height="8" fill="#8b8b8b"/>' +
    '<rect x="1" y="1" width="2" height="1" fill="#9d9d9d"/><rect x="5" y="0" width="2" height="1" fill="#777"/><rect x="0" y="4" width="1" height="2" fill="#777"/>' +
    '<rect x="3" y="3" width="2" height="1" fill="#a4a4a4"/><rect x="6" y="5" width="2" height="1" fill="#9d9d9d"/><rect x="2" y="6" width="2" height="1" fill="#777"/><rect x="5" y="2" width="1" height="1" fill="#6e6e6e"/></svg>') + '")';

  function layoutBoard() {
    var cells = [];
    for (var i = 0; i < N * N; i++) cells.push('stone');
    var bag = [];
    for (i = 0; i < DIAMONDS; i++) bag.push('diamond');
    for (i = 0; i < 5; i++) bag.push('iron');
    for (i = 0; i < 6; i++) bag.push('coal');
    for (i = 0; i < 3; i++) bag.push('lava');
    var idx = cells.map(function (_, k) { return k; });
    for (i = idx.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
    bag.forEach(function (o, k) { cells[idx[k]] = o; });
    return cells;
  }

  function neighbours(k) {
    var r = Math.floor(k / N), c = k % N, out = [];
    for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      var rr = r + dr, cc = c + dc;
      if (rr >= 0 && rr < N && cc >= 0 && cc < N) out.push(rr * N + cc);
    }
    return out;
  }

  function build(api, interactive) {
    var grid = document.createElement('div');
    grid.className = 'mine-grid';
    grid.style.setProperty('--stone', STONE);
    for (var i = 0; i < N * N; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'block';
      b.dataset.k = i;
      b.setAttribute('aria-label', '石頭方塊 ' + (Math.floor(i / N) + 1) + ' 列 ' + (i % N + 1) + ' 行');
      if (!interactive) b.tabIndex = -1;
      grid.appendChild(b);
    }
    api.stage.appendChild(grid);
    api.cleanup(function () { grid.remove(); });
    return grid;
  }

  SP.minigames.minecraft = {
    preview: function (api) { build(api, false); },
    start: function (api) {
      var cells = layoutBoard();
      var grid = build(api, true);
      var swings = SWINGS, score = 0, found = 0, over = false;
      function hud() { api.left('分數 ' + score); api.right('鎬子 ' + swings + ' 次'); }
      hud();

      api.on(grid, 'click', function (e) {
        var b = e.target.closest('.block');
        if (over || !b || b.classList.contains('is-open') || swings <= 0) return;
        var k = +b.dataset.k, kind = cells[k];
        swings--;
        b.classList.add('is-open', 'pop');
        b.disabled = true;
        if (kind === 'stone') {
          var n = neighbours(k).filter(function (q) { return cells[q] === 'diamond'; }).length;
          b.innerHTML = n ? '<span class="hint">' + n + '</span>' : '';
          b.setAttribute('aria-label', n ? '周圍有 ' + n + ' 顆鑽石' : '空洞');
        } else {
          b.innerHTML = ORE[kind].svg;
          b.setAttribute('aria-label', { coal: '煤礦', iron: '鐵礦', diamond: '鑽石', lava: '岩漿' }[kind]);
          score += ORE[kind].pts;
          if (kind === 'diamond') { found++; api.toast('鑽石！+10'); }
          else if (kind === 'lava') { swings = Math.max(0, swings - 3); api.toast('岩漿！鎬子 -3'); api.shake(); }
          else api.toast((kind === 'iron' ? '鐵礦' : '煤礦') + ' +' + ORE[kind].pts);
        }
        hud();
        if (found === DIAMONDS) {
          over = true;
          var bonus = swings * 2, final = score + bonus;
          setTimeout(function () { api.end(final, '四顆鑽石全部到手，剩下的耐久換成 ' + bonus + ' 分。'); }, 500);
        } else if (swings <= 0) {
          over = true;
          var total = score;
          setTimeout(function () { api.end(total, '鎬子壞了。找到 ' + found + ' 顆鑽石。'); }, 500);
        }
      });
    }
  };
})();
