/* 傳說對決 — 補刀大師: land the killing blow when a minion's HP drops below your damage tick. */
(function () {
  var DURATION = 40, DAMAGE = 24, COOLDOWN = 0.55, SLOTS = 5;

  function drawLane(ctx, w, h, t) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#1b2a5c');
    g.addColorStop(1, '#122046');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(232,194,106,.18)';
    ctx.fillRect(0, h * 0.2, w, h * 0.66);
    ctx.strokeStyle = 'rgba(232,194,106,.35)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 12]);
    ctx.beginPath(); ctx.moveTo(0, h * 0.53); ctx.lineTo(w, h * 0.53); ctx.stroke();
    ctx.setLineDash([]);
    for (var i = 0; i < 8; i++) {
      var x = (i * 97 + 30) % w, y = i % 2 ? h * 0.12 : h * 0.93;
      ctx.fillStyle = '#1f5a4a';
      ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
    }
    for (i = 0; i < 6; i++) {
      var sx = (i * 71 + t * 14) % w, sy = h * 0.25 + ((i * 53) % (h * 0.5));
      ctx.fillStyle = 'rgba(255,227,154,' + (0.25 + 0.25 * Math.sin(t * 3 + i)).toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(sx, sy, 2, 0, Math.PI * 2); ctx.fill();
    }
  }

  function slotPos(i, w, h) {
    var cols = [0.22, 0.5, 0.78, 0.36, 0.64];
    var rows = [0.34, 0.3, 0.34, 0.66, 0.66];
    return { x: cols[i] * w, y: rows[i] * h };
  }

  function drawMinion(ctx, m, p, t) {
    if (m.dead > 0) {
      ctx.globalAlpha = Math.max(0, m.dead / 0.5);
      ctx.fillStyle = m.lastHit ? '#ffd76a' : '#ff6f7f';
      ctx.font = '700 18px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(m.lastHit ? '+' + m.gold : '漏刀', p.x, p.y - 40 - (0.5 - m.dead) * 40);
      ctx.globalAlpha = 1;
      return;
    }
    var bob = Math.sin(t * 5 + m.ph) * 2;
    ctx.save();
    ctx.translate(p.x + (m.hit > 0 ? (Math.random() - 0.5) * 4 : 0), p.y + bob);
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.beginPath(); ctx.ellipse(0, 22, 20, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = m.type ? '#b84a7a' : '#c0394f';
    ctx.beginPath(); ctx.moveTo(-16, 18); ctx.lineTo(-12, -6); ctx.lineTo(12, -6); ctx.lineTo(16, 18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e8d6c4';
    ctx.beginPath(); ctx.arc(0, -12, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = m.type ? '#7a3cc4' : '#7a2030';
    ctx.beginPath(); ctx.moveTo(-12, -12); ctx.lineTo(0, -28); ctx.lineTo(12, -12); ctx.closePath(); ctx.fill();
    if (m.type) { ctx.fillStyle = '#c9b4ff'; ctx.beginPath(); ctx.arc(16, -2, 4, 0, Math.PI * 2); ctx.fill(); }
    if (m.hit > 0) { ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    // HP bar with the last-hit tick
    var bw = 54, bx = p.x - bw / 2, by = p.y - 46;
    ctx.fillStyle = 'rgba(0,0,0,.55)';
    ctx.fillRect(bx - 2, by - 2, bw + 4, 10);
    ctx.fillStyle = '#e04a5a';
    ctx.fillRect(bx, by, bw * Math.max(0, m.hp) / 100, 6);
    ctx.fillStyle = '#fff';
    ctx.fillRect(bx + bw * DAMAGE / 100 - 1, by - 3, 2, 12);
    ctx.fillStyle = 'rgba(255,255,255,.45)';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(m.slot + 1, p.x, p.y + 40);
  }

  function fresh(i) {
    return { hp: 100, type: Math.random() < 0.35 ? 1 : 0, next: 0.4 + Math.random() * 0.8, dead: 0, hit: 0, respawn: 0, ph: Math.random() * 6, lastHit: false, gold: 0, slot: i };
  }

  SP.minigames.aov = {
    preview: function (api) {
      var v = api.canvas(), t = 0, ms = [];
      for (var i = 0; i < SLOTS; i++) { ms.push(fresh(i)); ms[i].hp = 40 + i * 12; }
      api.loop(function (dt) {
        t += dt;
        drawLane(v.ctx, v.w, v.h, t);
        ms.forEach(function (m, k) { drawMinion(v.ctx, m, slotPos(k, v.w, v.h), t); });
      });
    },
    start: function (api) {
      api.stage.classList.add('is-playing');
      api.cleanup(function () { api.stage.classList.remove('is-playing'); });
      var v = api.canvas(), ctx = v.ctx;
      var t = 0, left = DURATION, gold = 0, cd = 0, combo = 0, missed = 0, hits = 0;
      var ms = [];
      for (var i = 0; i < SLOTS; i++) ms.push(fresh(i));

      function hud() {
        api.left('金錢 ' + gold + (combo > 1 ? '  連續 ' + combo : ''));
        api.right(Math.ceil(Math.max(0, left)) + ' 秒');
      }

      function kill(m, byMe) {
        m.dead = 0.5;
        m.lastHit = byMe;
        m.respawn = 0.6 + Math.random() * 0.6;
        if (byMe) {
          combo++; hits++;
          m.gold = (m.type ? 40 : 30) + Math.min(combo, 10) * 4;
          gold += m.gold;
        } else { combo = 0; missed++; }
      }

      function attack(i) {
        var m = ms[i];
        if (cd > 0 || !m || m.dead > 0 || m.respawn > 0) return;
        cd = COOLDOWN;
        m.hit = 0.12;
        m.hp -= DAMAGE;
        if (m.hp <= 0) kill(m, true);
        hud();
      }

      api.on(api.stage, 'pointerdown', function (e) {
        e.preventDefault();
        var p = api.point(e), bestI = -1, bestD = 52;
        ms.forEach(function (m, k) {
          if (m.dead > 0 || m.respawn > 0) return;
          var q = slotPos(k, v.w, v.h);
          var d = Math.hypot(q.x - p.x, q.y - 4 - p.y);
          if (d < bestD) { bestD = d; bestI = k; }
        });
        if (bestI >= 0) attack(bestI);
      });
      api.on(window, 'keydown', function (e) {
        if (e.repeat || SP.isControl(e.target) || !/^[1-5]$/.test(e.key)) return;
        e.preventDefault();
        attack(+e.key - 1);
      });

      api.loop(function (dt, real) {
        t += dt; left -= real;
        if (cd > 0) cd -= dt;
        ms.forEach(function (m, k) {
          if (m.hit > 0) m.hit -= dt;
          if (m.dead > 0) { m.dead -= dt; return; }
          if (m.respawn > 0 && m.hp <= 0) {
            m.respawn -= dt;
            if (m.respawn <= 0) ms[k] = fresh(k);
            return;
          }
          m.next -= dt;
          if (m.next <= 0) {
            var speedUp = 1 + (DURATION - left) / DURATION * 0.6;
            m.hp -= 5 + Math.random() * 11;
            m.next = (0.45 + Math.random() * 0.6) / speedUp;
            m.hit = 0.06;
            if (m.hp <= 0) kill(m, false);
          }
        });

        drawLane(ctx, v.w, v.h, t);
        ms.forEach(function (m, k) { drawMinion(ctx, m, slotPos(k, v.w, v.h), t); });
        // Attack cooldown ring at the bottom
        var cx = v.w / 2, cy = v.h - 40;
        ctx.fillStyle = 'rgba(0,0,0,.35)';
        ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = cd > 0 ? 'rgba(255,255,255,.35)' : '#ffd76a';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(cx, cy, 20, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - Math.max(0, cd) / COOLDOWN)); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = '600 12px Inter, "Noto Sans TC", sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('攻擊', cx, cy + 4);

        hud();
        if (left <= 0) {
          var rate = hits + missed ? Math.round(hits / (hits + missed) * 100) : 0;
          api.end(gold, '補刀 ' + hits + ' 次，漏刀 ' + missed + ' 次，補刀率 ' + rate + '%。');
        }
      });
    }
  };
})();
