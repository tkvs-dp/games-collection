/* 三角洲行動 — 撤離前清點: tap hostiles fast, spare friendlies, survive 30 seconds. */
(function () {
  var DURATION = 30;

  function drawField(ctx, w, h, t) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#e2b07e');
    g.addColorStop(0.45, '#f0cfa0');
    g.addColorStop(1, '#b98450');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(201,152,104,.7)';
    ctx.beginPath(); ctx.moveTo(0, h * 0.42);
    for (var i = 0; i <= 8; i++) ctx.lineTo(i / 8 * w, h * (0.36 + (i % 3) * 0.04));
    ctx.lineTo(w, h * 0.5); ctx.lineTo(0, h * 0.5); ctx.fill();
    // Cover: walls and crates where targets peek out
    ctx.fillStyle = '#8f6a40';
    ctx.fillRect(0, h * 0.5, w, h * 0.5);
    covers(w, h).forEach(function (c) {
      ctx.fillStyle = c.col;
      ctx.fillRect(c.x - c.w / 2, c.y, c.w, c.h);
      ctx.fillStyle = 'rgba(0,0,0,.15)';
      ctx.fillRect(c.x - c.w / 2, c.y, c.w, 4);
    });
    // Drifting dust
    for (i = 0; i < 10; i++) {
      var dx = (i * 83 + t * 30) % (w + 40) - 20, dy = h * 0.2 + (i * 47) % (h * 0.7);
      ctx.fillStyle = 'rgba(255,240,215,.35)';
      ctx.beginPath(); ctx.arc(dx, dy, 1.6, 0, Math.PI * 2); ctx.fill();
    }
  }

  function covers(w, h) {
    return [
      { x: w * 0.18, y: h * 0.4, w: w * 0.24, h: h * 0.1, col: '#6b6a3a' },
      { x: w * 0.55, y: h * 0.38, w: w * 0.18, h: h * 0.12, col: '#7a5b34' },
      { x: w * 0.85, y: h * 0.41, w: w * 0.2, h: h * 0.09, col: '#4f5a3a' },
      { x: w * 0.3, y: h * 0.66, w: w * 0.3, h: h * 0.1, col: '#4f5a3a' },
      { x: w * 0.74, y: h * 0.7, w: w * 0.26, h: h * 0.1, col: '#6b6a3a' },
      { x: w * 0.12, y: h * 0.86, w: w * 0.22, h: h * 0.12, col: '#7a5b34' },
      { x: w * 0.55, y: h * 0.88, w: w * 0.3, h: h * 0.1, col: '#6b6a3a' }
    ];
  }

  function drawTarget(ctx, tg) {
    var rise = Math.min(1, tg.age / 0.12) * (tg.hitT > 0 ? Math.max(0, tg.hitT / 0.25) : 1);
    var hgt = 46 * rise;
    ctx.save();
    ctx.beginPath();
    ctx.rect(tg.x - 40, tg.y - 70, 80, 70);
    ctx.clip();
    ctx.translate(tg.x, tg.y - hgt + 46);
    var body = tg.friend ? '#2f6fd6' : '#d9532b';
    var dark = tg.friend ? '#1d4a99' : '#8a2f14';
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(-14, -26); ctx.lineTo(14, -26); ctx.lineTo(16, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e8c9a8';
    ctx.beginPath(); ctx.arc(0, -34, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.arc(0, -37, 10, Math.PI, 0); ctx.fill();
    if (tg.friend) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(-3, -22, 6, 14); ctx.fillRect(-7, -18, 14, 6);
    } else {
      ctx.fillStyle = '#2c2a26'; ctx.fillRect(10, -20, 22, 5);
    }
    ctx.restore();
    // Lifetime ring
    if (tg.hitT <= 0) {
      ctx.strokeStyle = tg.friend ? 'rgba(47,111,214,.8)' : 'rgba(255,255,255,.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(tg.x, tg.y - 30, 30, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0, 1 - tg.age / tg.life));
      ctx.stroke();
    }
  }

  function drawCross(ctx, c) {
    if (!c) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, c.t / 0.4);
    ctx.strokeStyle = c.hit ? '#ffffff' : '#ff4d3a';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(c.x, c.y, 14, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(c.x - 22, c.y); ctx.lineTo(c.x - 8, c.y); ctx.moveTo(c.x + 8, c.y); ctx.lineTo(c.x + 22, c.y);
    ctx.moveTo(c.x, c.y - 22); ctx.lineTo(c.x, c.y - 8); ctx.moveTo(c.x, c.y + 8); ctx.lineTo(c.x, c.y + 22);
    ctx.stroke();
    ctx.restore();
  }

  SP.minigames.delta = {
    preview: function (api) {
      var v = api.canvas(), t = 0;
      var demo = [{ x: v.w * 0.55, y: v.h * 0.38, age: 1, life: 2, friend: false, hitT: 0 }];
      api.loop(function (dt) {
        t += dt;
        drawField(v.ctx, v.w, v.h, t);
        demo[0].x = v.w * 0.55; demo[0].y = v.h * 0.38;
        demo.forEach(function (d) { drawTarget(v.ctx, d); });
      });
    },
    start: function (api) {
      api.stage.classList.add('is-playing');
      api.cleanup(function () { api.stage.classList.remove('is-playing'); });
      var v = api.canvas(), ctx = v.ctx;
      var t = 0, left = DURATION, score = 0, shots = 0, hits = 0, streak = 0, spawnIn = 0.6;
      var targets = [], cross = null;

      function spawn() {
        var cs = covers(v.w, v.h);
        var free = cs.filter(function (c) { return !targets.some(function (tg) { return tg.cover === c.x; }); });
        if (!free.length) return;
        var c = free[Math.floor(Math.random() * free.length)];
        var progress = (DURATION - left) / DURATION;
        targets.push({
          cover: c.x,
          x: c.x + (Math.random() - 0.5) * c.w * 0.5,
          y: c.y,
          age: 0,
          life: 1.5 - progress * 0.75,
          friend: Math.random() < 0.22,
          hitT: 0
        });
      }

      api.on(window, 'keydown', function (e) {
        if ((e.code !== 'Space' && e.key !== 'Enter') || e.repeat || SP.isControl(e.target)) return;
        e.preventDefault();
        var live = targets.filter(function (tg) { return tg.hitT <= 0; });
        var tg = live[0];
        var r = api.stage.getBoundingClientRect();
        var x = tg ? tg.x : v.w / 2, y = tg ? tg.y - 30 : v.h / 2;
        api.stage.dispatchEvent(new PointerEvent('pointerdown', { cancelable: true, clientX: r.left + x, clientY: r.top + y }));
      });

      api.on(api.stage, 'pointerdown', function (e) {
        e.preventDefault();
        var p = api.point(e);
        shots++;
        var hit = null;
        for (var i = targets.length - 1; i >= 0; i--) {
          var tg = targets[i];
          if (tg.hitT > 0) continue;
          if (Math.abs(p.x - tg.x) < 30 && p.y > tg.y - 62 && p.y < tg.y + 8) { hit = tg; break; }
        }
        cross = { x: p.x, y: p.y, t: 0.4, hit: !!hit };
        if (!hit) { score = Math.max(0, score - 20); streak = 0; return; }
        hit.hitT = 0.25;
        if (hit.friend) {
          score = Math.max(0, score - 200); streak = 0;
          api.toast('誤擊友軍 -200'); api.shake();
        } else {
          hits++; streak++;
          var pts = Math.round(50 + 100 * Math.max(0, 1 - hit.age / hit.life)) + Math.min(streak, 8) * 10;
          score += pts;
          if (streak > 0 && streak % 5 === 0) api.toast('連續擊倒 ' + streak);
        }
      });

      api.loop(function (dt, real) {
        t += dt; left -= real;
        spawnIn -= dt;
        if (spawnIn <= 0) {
          spawn();
          if (Math.random() < 0.3 + (DURATION - left) / DURATION * 0.3) spawn();
          spawnIn = 0.55 + Math.random() * 0.5;
        }
        targets = targets.filter(function (tg) {
          tg.age += dt;
          if (tg.hitT > 0) { tg.hitT -= dt; return tg.hitT > 0; }
          if (tg.age > tg.life) { if (!tg.friend) streak = 0; return false; }
          return true;
        });
        if (cross) { cross.t -= dt; if (cross.t <= 0) cross = null; }

        drawField(ctx, v.w, v.h, t);
        targets.forEach(function (tg) { drawTarget(ctx, tg); });
        drawCross(ctx, cross);

        api.left('分數 ' + score);
        api.right(Math.ceil(Math.max(0, left)) + ' 秒');
        if (left <= 0) {
          var acc = shots ? Math.round(hits / shots * 100) : 0;
          api.end(score, '撤離成功。擊倒 ' + hits + ' 名敵人，命中率 ' + acc + '%。');
        }
      });
    }
  };
})();
