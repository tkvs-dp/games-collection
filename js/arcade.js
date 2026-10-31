/* Shared challenge shell: start/end overlay, HUD, canvas sizing, frame loop, best score. */
window.SP = window.SP || {};
SP.minigames = SP.minigames || {};

// True when a key event belongs to some other focused control on the page.
SP.isControl = function (el) {
  return !!(el && el.closest && el.closest('a, button, input, select, textarea, [role="tab"]'));
};

SP.mountChallenge = function (root, game) {
  var impl = SP.minigames[game.id];
  root.innerHTML =
    '<div class="stage" tabindex="-1" aria-label="' + game.challenge.title + '" style="--stage-bg:' + game.stageBg + '">' +
      '<div class="hud"><span class="badge-overlay hud-left"></span><span class="badge-overlay hud-right"></span></div>' +
      '<div class="stage-overlay"><div class="stage-card"></div></div>' +
    '</div>' +
    '<p class="caption stage-tip">' + game.challenge.tip + '</p>';
  var stage = root.querySelector('.stage');
  var overlay = root.querySelector('.stage-overlay');
  var card = root.querySelector('.stage-card');
  var hudL = root.querySelector('.hud-left');
  var hudR = root.querySelector('.hud-right');
  var session = null;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function showIntro() {
    var best = SP.best.get(game.id);
    card.innerHTML =
      '<h3>' + game.challenge.title + '</h3>' +
      '<p>' + game.challenge.rules + '</p>' +
      (best ? '<div class="stage-meta"><span>最佳紀錄 ' + SP.fmt(best) + '</span></div>' : '') +
      '<button class="btn btn-primary btn-lg" type="button">開始挑戰</button>';
    card.querySelector('button').addEventListener('click', start);
    overlay.hidden = false;
    hudL.hidden = hudR.hidden = true;
    if (impl.preview) {
      var p = api();
      p.still = reduceMotion.matches;
      impl.preview(p);
    }
  }

  function showEnd(score, line) {
    var isBest = SP.best.set(game.id, score);
    card.innerHTML =
      '<p>' + line + '</p>' +
      '<div class="result">' + SP.fmt(score) + '</div>' +
      '<div class="stage-meta"><span>' + (isBest ? '新的最佳紀錄。' : '最佳紀錄 ' + SP.fmt(SP.best.get(game.id))) + '</span></div>' +
      '<button class="btn btn-primary btn-lg" type="button">再玩一次</button>';
    card.querySelector('button').addEventListener('click', start);
    overlay.hidden = false;
    card.querySelector('button').focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent('sp:score', { detail: { id: game.id } }));
  }

  function api() {
    var raf = 0, alive = true, cleanups = [];
    var a = {
      stage: stage,
      left: function (t) { hudL.textContent = t; },
      right: function (t) { hudR.textContent = t; },
      toast: function (t) {
        var el = document.createElement('div');
        el.className = 'toast';
        el.textContent = t;
        stage.appendChild(el);
        setTimeout(function () { el.remove(); }, 900);
      },
      shake: function () {
        stage.classList.remove('shake'); void stage.offsetWidth; stage.classList.add('shake');
        if (navigator.vibrate) try { navigator.vibrate(40); } catch (e) {}
      },
      canvas: function () {
        var c = document.createElement('canvas');
        stage.insertBefore(c, stage.firstChild);
        var ctx = c.getContext('2d');
        var view = { c: c, ctx: ctx, w: 0, h: 0 };
        function fit() {
          var dpr = Math.min(window.devicePixelRatio || 1, 2);
          view.w = stage.clientWidth; view.h = stage.clientHeight;
          c.width = Math.round(view.w * dpr); c.height = Math.round(view.h * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          a.redraw();
        }
        fit();
        var ro = 'ResizeObserver' in window ? new ResizeObserver(fit) : null;
        if (ro) ro.observe(stage); else window.addEventListener('resize', fit);
        cleanups.push(function () { if (ro) ro.disconnect(); else window.removeEventListener('resize', fit); c.remove(); });
        return view;
      },
      // Pointer position in stage CSS pixels.
      point: function (e) {
        var r = stage.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      },
      on: function (target, type, fn, opts) {
        target.addEventListener(type, fn, opts);
        cleanups.push(function () { target.removeEventListener(type, fn, opts); });
      },
      // fn(dt, real): dt is capped for smooth physics; real follows the wall clock for countdowns.
      loop: function (fn) {
        var last = 0;
        function step(now) {
          if (!alive) return;
          var raw = last ? (now - last) / 1000 : 0;
          last = now;
          fn(Math.min(0.05, raw), Math.min(0.25, raw));
          if (a.still) return; // reduced-motion preview: one frame only
          raf = requestAnimationFrame(step);
        }
        a.redraw = function () { if (alive) { cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(step); } };
        raf = requestAnimationFrame(step);
      },
      redraw: function () {},
      still: false,
      cleanup: function (fn) { cleanups.push(fn); },
      end: function (score, line) {
        if (!alive) return;
        a.dispose();
        showEnd(Math.max(0, Math.round(score)), line);
      },
      dispose: function () {
        alive = false;
        cancelAnimationFrame(raf);
        cleanups.splice(0).forEach(function (f) { f(); });
      }
    };
    if (session) session.dispose();
    session = a;
    return a;
  }

  function start() {
    overlay.hidden = true;
    hudL.hidden = hudR.hidden = false;
    hudL.textContent = ''; hudR.textContent = '';
    stage.focus({ preventScroll: true });
    impl.start(api());
  }

  showIntro();
};
