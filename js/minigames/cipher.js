/* 第五人格 — 校準密碼機: tap while the needle crosses the gold zone. Three misses and the hunter finds you. */
(function () {
  var TAU = Math.PI * 2;

  function drawMachine(ctx, w, h, s) {
    ctx.fillStyle = '#1d1830';
    ctx.fillRect(0, 0, w, h);
    var fog = ctx.createRadialGradient(w / 2, h * 0.42, 10, w / 2, h * 0.42, Math.max(w, h) * 0.7);
    fog.addColorStop(0, 'rgba(122,84,104,.55)');
    fog.addColorStop(1, 'rgba(29,24,48,0)');
    ctx.fillStyle = fog;
    ctx.fillRect(0, 0, w, h);

    var cx = w / 2, cy = h * 0.46, R = Math.min(w, h) * 0.3;
    // Heartbeat vignette grows as the hunter approaches
    if (s.danger > 0) {
      var beat = (Math.sin(s.t * (4 + s.danger * 3)) * 0.5 + 0.5) * s.danger;
      var red = ctx.createRadialGradient(cx, cy, R, cx, cy, Math.max(w, h) * 0.75);
      red.addColorStop(0, 'rgba(179,40,58,0)');
      red.addColorStop(1, 'rgba(179,40,58,' + (0.25 + beat * 0.4).toFixed(2) + ')');
      ctx.fillStyle = red;
      ctx.fillRect(0, 0, w, h);
    }
    // Dial body
    ctx.fillStyle = '#2a2236';
    ctx.beginPath(); ctx.arc(cx, cy, R + 18, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#6b5a4a'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(cx, cy, R + 15, 0, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
    // Ticks
    ctx.strokeStyle = 'rgba(232,217,196,.35)'; ctx.lineWidth = 2;
    for (var i = 0; i < 24; i++) {
      var a = i / 24 * TAU;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (R - 12), cy + Math.sin(a) * (R - 12));
      ctx.lineTo(cx + Math.cos(a) * (R - 20), cy + Math.sin(a) * (R - 20));
      ctx.stroke();
    }
    if (s.zone) {
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#c9a46a';
      ctx.beginPath(); ctx.arc(cx, cy, R, s.zone.a, s.zone.a + s.zone.good); ctx.stroke();
      var pm = s.zone.a + (s.zone.good - s.zone.perfect) / 2;
      ctx.strokeStyle = '#fff1c9';
      ctx.beginPath(); ctx.arc(cx, cy, R, pm, pm + s.zone.perfect); ctx.stroke();
    }
    // Needle
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(s.needle);
    ctx.strokeStyle = s.flash > 0 ? s.flashCol : '#e8d9c4';
    ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(R + 8, 0); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = '#6b5a4a';
    ctx.beginPath(); ctx.arc(cx, cy, 10, 0, TAU); ctx.fill();

    if (s.preview) return;
    // Decode progress bar
    var bw = Math.min(w - 48, 360), bx = (w - bw) / 2, by = cy + R + 48;
    ctx.fillStyle = 'rgba(255,255,255,.12)';
    roundRect(ctx, bx, by, bw, 12, 6); ctx.fill();
    ctx.fillStyle = '#7fffb0';
    roundRect(ctx, bx, by, Math.max(12, bw * s.progress / 100), 12, 6); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.78)';
    ctx.font = '600 14px Inter, "Noto Sans TC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('破譯進度 ' + Math.floor(s.progress) + '%', w / 2, by + 34);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  SP.minigames.idv = {
    preview: function (api) {
      var v = api.canvas(), t = 0;
      api.loop(function (dt) {
        t += dt;
        drawMachine(v.ctx, v.w, v.h, { t: t, needle: t * 1.2 - Math.PI / 2, progress: 0, danger: 0, zone: { a: 0.6, good: 0.7, perfect: 0.2 }, flash: 0, preview: true });
      });
    },
    start: function (api) {
      api.stage.classList.add('is-playing');
      api.cleanup(function () { api.stage.classList.remove('is-playing'); });
      var v = api.canvas();
      var s = { t: 0, needle: -Math.PI / 2, progress: 0, danger: 0, zone: null, flash: 0, flashCol: '#fff' };
      var misses = 0, perfects = 0, round = 0, wait = 0.6, travelled = 0, speed = 0, elapsed = 0;

      function newZone() {
        round++;
        speed = Math.min(2.1 + round * 0.18, 5.2) * Math.PI; // rad/s
        var good = Math.max(0.42, 0.85 - round * 0.04);
        // Zone starts at least a quarter turn ahead of the needle.
        var a = s.needle + Math.PI * 0.55 + Math.random() * Math.PI * 0.9;
        s.zone = { a: a, good: good, perfect: good * 0.3 };
        travelled = 0;
      }
      function rel(angle) { return ((angle - s.zone.a) % TAU + TAU) % TAU; }

      function result(kind) {
        if (kind === 'perfect') { s.progress += 14; perfects++; s.flashCol = '#fff1c9'; api.toast('完美校準 +14%'); }
        else if (kind === 'good') { s.progress += 8; s.flashCol = '#c9a46a'; api.toast('校準成功 +8%'); }
        else {
          misses++; s.progress = Math.max(0, s.progress - 6); s.flashCol = '#ff5a6e';
          s.danger = misses / 3;
          api.toast(misses >= 3 ? '監管者來了' : '校準失敗，心跳加速');
          api.shake();
        }
        s.flash = 0.35;
        s.zone = null;
        wait = 0.55;
        hud();
        if (s.progress >= 100) {
          s.progress = 100;
          var bonus = Math.max(0, Math.round((60 - elapsed) * 3));
          setTimeout(function () { api.end(100 + perfects * 10 + bonus, '密碼機破譯完成，大門通電了。'); }, 350);
        } else if (misses >= 3) {
          setTimeout(function () { api.end(Math.floor(s.progress), '被監管者發現了。最後的破譯進度'); }, 350);
        }
      }
      function hud() {
        api.left('完美 ' + perfects);
        api.right('失誤 ' + misses + ' / 3');
      }
      hud();

      api.on(api.stage, 'pointerdown', function (e) {
        e.preventDefault();
        if (!s.zone) return;
        var r = rel(s.needle);
        var pStart = (s.zone.good - s.zone.perfect) / 2;
        if (r <= s.zone.good) result(r >= pStart && r <= pStart + s.zone.perfect ? 'perfect' : 'good');
        else result('miss');
      });
      api.on(window, 'keydown', function (e) {
        if (e.code !== 'Space' && e.key !== 'Enter') return;
        if (e.repeat || SP.isControl(e.target)) return;
        e.preventDefault();
        api.stage.dispatchEvent(new PointerEvent('pointerdown', { cancelable: true }));
      });

      api.loop(function (dt, real) {
        s.t += dt; elapsed += real;
        if (s.flash > 0) s.flash -= dt;
        if (s.zone) {
          s.needle += speed * dt;
          travelled += speed * dt;
          // Needle passed the zone without a tap.
          if (rel(s.needle) > s.zone.good && rel(s.needle - speed * dt) <= s.zone.good && travelled > 0.1) result('miss');
          else if (travelled > TAU * 1.05) result('miss');
        } else if (s.progress < 100 && misses < 3) {
          wait -= dt;
          if (wait <= 0) newZone();
        }
        drawMachine(v.ctx, v.w, v.h, s);
      });
    }
  };
})();
