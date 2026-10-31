/* 光遇 — 收集光之翼: fly toward your finger, collect winged light, dodge the krill's searchlight. */
(function () {
  var DURATION = 45;

  function drawBackdrop(ctx, w, h, t, clouds) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#5f6fc4');
    g.addColorStop(0.55, '#d99fb4');
    g.addColorStop(1, '#ffd6b0');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    clouds.forEach(function (c) {
      var x = ((c.x - t * c.v) % (w + 260) + w + 260) % (w + 260) - 130;
      ctx.fillStyle = c.col;
      ctx.beginPath();
      ctx.ellipse(x, c.y * h, c.rx, c.ry, 0, 0, Math.PI * 2);
      ctx.ellipse(x + c.rx * 0.6, c.y * h + 6, c.rx * 0.7, c.ry * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function makeClouds() {
    var out = [];
    for (var i = 0; i < 9; i++) {
      var layer = i % 3;
      out.push({ x: Math.random() * 600, y: 0.55 + layer * 0.16 + Math.random() * 0.05, rx: 60 + layer * 30, ry: 16 + layer * 6, v: 8 + layer * 10, col: ['rgba(247,217,214,.75)', 'rgba(253,233,228,.85)', '#ffffff'][layer] });
    }
    return out;
  }

  function drawChild(ctx, x, y, t, hurt) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = hurt > 0 && Math.floor(hurt * 12) % 2 ? 0.35 : 1;
    var glow = ctx.createRadialGradient(10, -14, 0, 10, -14, 26);
    glow.addColorStop(0, 'rgba(255,225,140,.75)');
    glow.addColorStop(1, 'rgba(255,225,140,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(10, -14, 26, 0, Math.PI * 2); ctx.fill();
    var sway = Math.sin(t * 6) * 3;
    ctx.fillStyle = '#5a4fa0';
    ctx.beginPath();
    ctx.moveTo(-4, -8); ctx.quadraticCurveTo(-14 + sway, 10, -16 + sway, 20);
    ctx.lineTo(14 + sway, 20); ctx.quadraticCurveTo(12 + sway, 10, 6, -8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f3e1d4';
    ctx.beginPath(); ctx.arc(1, -12, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2c2550';
    ctx.beginPath(); ctx.ellipse(1, -16, 8, 4, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#fff6e0'; ctx.fillRect(9, -12, 3, 8);
    ctx.fillStyle = '#ffb84d';
    ctx.beginPath(); ctx.ellipse(10.5, -15, 2, 3.5 + Math.sin(t * 14) * 0.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawLight(ctx, l, t) {
    var p = 1 + Math.sin(t * 4 + l.ph) * 0.12;
    ctx.save();
    ctx.translate(l.x, l.y + Math.sin(t * 2 + l.ph) * 4);
    ctx.scale(p, p);
    var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 22);
    g.addColorStop(0, 'rgba(255,243,196,.9)');
    g.addColorStop(1, 'rgba(255,243,196,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffe7a3';
    ctx.beginPath();
    ctx.moveTo(-4, 0); ctx.quadraticCurveTo(-14, -8, -17, 3); ctx.quadraticCurveTo(-10, 0, -4, 3);
    ctx.moveTo(4, 0); ctx.quadraticCurveTo(14, -8, 17, 3); ctx.quadraticCurveTo(10, 0, 4, 3);
    ctx.fill();
    ctx.fillStyle = '#fffaf0';
    ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(5, 0); ctx.lineTo(0, 7); ctx.lineTo(-5, 0); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function drawKrill(ctx, k) {
    ctx.save();
    // Searchlight cone
    var g = ctx.createLinearGradient(k.x, k.y, k.x, k.y + k.reach);
    g.addColorStop(0, 'rgba(255,90,70,.55)');
    g.addColorStop(1, 'rgba(255,90,70,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(k.x + k.dir * 26, k.y + 4);
    ctx.lineTo(k.x + k.dir * 26 - k.spread, k.y + k.reach);
    ctx.lineTo(k.x + k.dir * 26 + k.spread, k.y + k.reach);
    ctx.closePath(); ctx.fill();
    // Body
    ctx.translate(k.x, k.y);
    ctx.scale(k.dir, 1);
    ctx.fillStyle = '#1d1a2e';
    ctx.beginPath();
    ctx.moveTo(-70, 0); ctx.quadraticCurveTo(-30, -18, 20, -10); ctx.quadraticCurveTo(40, -4, 34, 8);
    ctx.quadraticCurveTo(0, 14, -70, 0); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-20, -8); ctx.lineTo(-44, -30); ctx.lineTo(-4, -12); ctx.fill();
    ctx.fillStyle = '#ff5a46';
    ctx.beginPath(); ctx.arc(26, 0, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function inCone(px, py, k) {
    var ox = k.x + k.dir * 26, oy = k.y + 4;
    if (py < oy || py > oy + k.reach) return false;
    var half = ((py - oy) / k.reach) * k.spread;
    return Math.abs(px - ox) <= half;
  }

  SP.minigames.sky = {
    preview: function (api) {
      var v = api.canvas(), clouds = makeClouds(), t = 0;
      api.loop(function (dt) {
        t += dt;
        drawBackdrop(v.ctx, v.w, v.h, t, clouds);
        drawChild(v.ctx, v.w * 0.5, v.h * 0.42 + Math.sin(t * 1.5) * 6, t, 0);
      });
    },
    start: function (api) {
      api.stage.classList.add('is-playing');
      api.cleanup(function () { api.stage.classList.remove('is-playing'); });
      var v = api.canvas(), ctx = v.ctx, clouds = makeClouds();
      var t = 0, left = DURATION, score = 0;
      var kid = { x: v.w / 2, y: v.h * 0.45, tx: v.w / 2, ty: v.h * 0.45, hurt: 0 };
      var lights = [], krill = null, nextKrill = 5, pointerOn = false;

      function spawnLight() {
        lights.push({ x: 30 + Math.random() * (v.w - 60), y: 70 + Math.random() * (v.h * 0.72 - 70), ph: Math.random() * 6 });
      }
      for (var i = 0; i < 3; i++) spawnLight();

      function move(e) {
        var p = api.point(e);
        kid.tx = p.x; kid.ty = p.y - 36; // stay visible above the finger
      }
      api.on(api.stage, 'pointerdown', function (e) { pointerOn = true; move(e); e.preventDefault(); });
      api.on(api.stage, 'pointermove', function (e) { if (pointerOn || e.pointerType === 'mouse') move(e); });
      api.on(window, 'pointerup', function () { pointerOn = false; });
      var keys = {};
      api.on(window, 'keydown', function (e) {
        if (!/^Arrow/.test(e.key) || SP.isControl(e.target)) return;
        keys[e.key] = true; e.preventDefault();
      });
      api.on(window, 'keyup', function (e) { keys[e.key] = false; });

      api.loop(function (dt, real) {
        t += dt; left -= real;
        var kx = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0), ky = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);
        if (kx || ky) { kid.tx = kid.x + kx * 60; kid.ty = kid.y + ky * 60; }
        lights.forEach(function (l) {
          l.x = Math.max(30, Math.min(v.w - 30, l.x));
          l.y = Math.max(70, Math.min(v.h * 0.72, l.y));
        });
        var k = Math.min(1, dt * 7);
        kid.x += (kid.tx - kid.x) * k;
        kid.y += (kid.ty - kid.y) * k;
        kid.x = Math.max(16, Math.min(v.w - 16, kid.x));
        kid.y = Math.max(60, Math.min(v.h - 24, kid.y));
        if (kid.hurt > 0) kid.hurt -= dt;

        lights = lights.filter(function (l) {
          if (Math.hypot(l.x - kid.x, l.y - (kid.y - 4)) < 30) {
            score++;
            api.toast('光之翼 +1');
            return false;
          }
          return true;
        });
        while (lights.length < 3) spawnLight();

        nextKrill -= dt;
        if (!krill && nextKrill <= 0) {
          var dir = Math.random() < 0.5 ? 1 : -1;
          krill = { dir: dir, x: dir > 0 ? -90 : v.w + 90, y: 70 + Math.random() * v.h * 0.25, speed: 70 + (DURATION - left) * 2.4, reach: v.h * 0.62, spread: 70 };
        }
        if (krill) {
          krill.x += krill.dir * krill.speed * dt;
          if (kid.hurt <= 0 && inCone(kid.x, kid.y, krill)) {
            var lost = Math.min(score, 2);
            score -= lost;
            kid.hurt = 1.4;
            api.toast(lost ? '被冥龍照到了，光之翼 -' + lost : '被冥龍照到了');
            api.shake();
          }
          if ((krill.dir > 0 && krill.x > v.w + 120) || (krill.dir < 0 && krill.x < -120)) {
            krill = null;
            nextKrill = Math.max(2, 5 - (DURATION - left) * 0.06);
          }
        }

        drawBackdrop(ctx, v.w, v.h, t, clouds);
        lights.forEach(function (l) { drawLight(ctx, l, t); });
        if (krill) drawKrill(ctx, krill);
        drawChild(ctx, kid.x, kid.y, t, kid.hurt);

        api.left('光之翼 ' + score);
        api.right(Math.ceil(Math.max(0, left)) + ' 秒');
        if (left <= 0) api.end(score, (score >= 15 ? '斗篷亮得像星星。' : '天空暗下來了。') + '帶回的光之翼');
      });
    }
  };
})();
