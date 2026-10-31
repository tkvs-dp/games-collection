/* Floating archipelago: one low-poly island per game. Drag sideways to spin, tap an island to enter. */
window.SP = window.SP || {};

SP.initArchipelago = function (root) {
  var labelsLayer = root.querySelector('.island-labels');
  var games = SP.games;

  function fallback() {
    root.querySelector('canvas') && root.querySelector('canvas').remove();
    var box = document.createElement('div');
    box.className = 'archipelago-fallback';
    box.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;max-width:360px">' +
      games.map(function (g) {
        return '<a href="game.html?id=' + g.id + '" style="display:grid;gap:8px;justify-items:center;font-weight:600;font-size:14px">' +
          '<span class="squircle" style="width:76px;height:76px">' + SP.icon(g.id) + '</span>' + g.short + '</a>';
      }).join('') + '</div>';
    root.appendChild(box);
    labelsLayer.innerHTML = '';
  }

  var THREE = window.THREE;
  if (!THREE) return fallback();
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) { return fallback(); }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0xffffff, 0);
  root.insertBefore(renderer.domElement, labelsLayer);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8dde6, 0.95));
  var sun = new THREE.DirectionalLight(0xffffff, 0.85);
  sun.position.set(4, 9, 6);
  scene.add(sun);

  var matCache = {};
  function mat(color, emissive) {
    var key = color + '|' + (emissive || '');
    if (!matCache[key]) {
      matCache[key] = new THREE.MeshStandardMaterial({
        color: color, flatShading: true, roughness: 0.85, metalness: 0,
        emissive: emissive ? new THREE.Color(emissive) : new THREE.Color(0x000000),
        emissiveIntensity: emissive ? 0.9 : 0
      });
    }
    return matCache[key];
  }
  function mesh(geo, color, emissive) { return new THREE.Mesh(geo, mat(color, emissive)); }
  function box(w, h, d, color, x, y, z, emissive) {
    var m = mesh(new THREE.BoxGeometry(w, h, d), color, emissive);
    m.position.set(x || 0, y || 0, z || 0);
    return m;
  }
  function rockBase(g, top, rock, r, seg, h) {
    var slab = mesh(new THREE.CylinderGeometry(r, r * 0.94, 0.32, seg), top);
    g.add(slab);
    var cone = mesh(new THREE.ConeGeometry(r * 0.92, h || 1.5, seg), rock);
    cone.rotation.x = Math.PI;
    cone.position.y = -0.16 - (h || 1.5) / 2;
    g.add(cone);
  }

  var builders = {
    minecraft: function (g, anim) {
      var s = 0.42;
      for (var x = -2; x < 2; x++) for (var z = -2; z < 2; z++) {
        g.add(box(s, s * 0.8, s, 0x8a5a33, (x + 0.5) * s, -s * 0.15, (z + 0.5) * s));
        g.add(box(s, s * 0.22, s, (x + z) % 2 ? 0x5fae3b : 0x6bbb45, (x + 0.5) * s, s * 0.35, (z + 0.5) * s));
      }
      for (x = -1.5; x < 1.5; x++) for (z = -1.5; z < 1.5; z++) g.add(box(s, s, s, 0x7a7a7a, (x + 0.5) * s, -s * 1.05, (z + 0.5) * s));
      g.add(box(s, s, s, 0x7fe3ff, s * 1.5, -s * 1.05, 0, 0x2aa8c8));
      for (x = -1; x < 1; x++) for (z = -1; z < 1; z++) g.add(box(s, s, s, 0x6a6a6a, (x + 0.5) * s, -s * 2.05, (z + 0.5) * s));
      g.add(box(s * 0.9, s * 0.9, s * 0.9, 0x5a5a5a, 0, -s * 3, 0));
      // tree
      g.add(box(0.2, 0.8, 0.2, 0x6b4a2b, -0.35, 0.86, -0.3));
      g.add(box(0.75, 0.55, 0.75, 0x3f8a2f, -0.35, 1.35, -0.3));
      g.add(box(0.45, 0.3, 0.45, 0x4e9e38, -0.35, 1.75, -0.3));
      // explorer
      var p = new THREE.Group();
      p.add(box(0.2, 0.2, 0.2, 0xc99a6e, 0, 0.62, 0));
      p.add(box(0.22, 0.24, 0.14, 0x2fa8a8, 0, 0.42, 0));
      p.add(box(0.2, 0.2, 0.12, 0x3a3fa8, 0, 0.2, 0));
      p.position.set(0.42, 0.28, 0.35);
      g.add(p);
      anim.push(function (t) { p.rotation.y = Math.sin(t * 0.8) * 0.8; });
    },
    sky: function (g, anim) {
      var puffs = [[0, 0, 0, 0.75], [0.6, -0.05, 0.25, 0.55], [-0.62, -0.08, 0.15, 0.6], [0.15, -0.1, -0.55, 0.55], [-0.25, 0.05, 0.5, 0.5], [0.05, -0.45, 0, 0.6]];
      puffs.forEach(function (c) {
        var m = mesh(new THREE.IcosahedronGeometry(c[3], 1), c[1] < -0.2 ? 0xb9a8e6 : 0xf6cdd5);
        m.position.set(c[0], c[1], c[2]);
        m.scale.y = 0.62;
        g.add(m);
      });
      var tint = mesh(new THREE.IcosahedronGeometry(0.45, 1), 0xa694dc);
      tint.position.set(-0.4, -0.35, -0.3); tint.scale.y = 0.6; g.add(tint);
      var kid = new THREE.Group();
      var cape = mesh(new THREE.ConeGeometry(0.2, 0.5, 6), 0x5a4fa0);
      cape.position.y = 0.25; kid.add(cape);
      var head = mesh(new THREE.IcosahedronGeometry(0.11, 1), 0xf3e1d4);
      head.position.y = 0.56; kid.add(head);
      kid.position.set(0, 0.35, 0.15);
      g.add(kid);
      var light = new THREE.Group();
      light.add(mesh(new THREE.OctahedronGeometry(0.16, 0), 0xfff2c0, 0xffc84d));
      var wingL = mesh(new THREE.ConeGeometry(0.07, 0.3, 4), 0xffe7a3, 0xffb84d);
      wingL.rotation.z = Math.PI / 2.4; wingL.position.x = -0.2; light.add(wingL);
      var wingR = wingL.clone(); wingR.rotation.z = -Math.PI / 2.4; wingR.position.x = 0.2; light.add(wingR);
      light.position.set(0.45, 1.05, 0.1);
      g.add(light);
      anim.push(function (t) {
        light.position.y = 1.05 + Math.sin(t * 1.6) * 0.12;
        light.rotation.y = t * 1.2;
        kid.rotation.y = Math.sin(t * 0.5) * 0.6;
      });
    },
    idv: function (g, anim) {
      rockBase(g, 0x3d3550, 0x2a2338, 1.15, 7, 1.6);
      var m = 0x2b2440;
      g.add(box(1.1, 0.7, 0.7, m, 0, 0.5, -0.1));
      var roof = mesh(new THREE.ConeGeometry(0.85, 0.55, 4), 0x1d1830);
      roof.rotation.y = Math.PI / 4; roof.scale.z = 0.62; roof.position.set(0, 1.12, -0.1); g.add(roof);
      [-0.62, 0.62].forEach(function (x) {
        g.add(box(0.26, 1.0, 0.26, m, x, 0.65, -0.1));
        var tr = mesh(new THREE.ConeGeometry(0.22, 0.5, 4), 0x1d1830);
        tr.rotation.y = Math.PI / 4; tr.position.set(x, 1.4, -0.1); g.add(tr);
      });
      [-0.3, 0, 0.3].forEach(function (x) { g.add(box(0.12, 0.18, 0.02, 0xffcf6b, x, 0.6, 0.26, 0xffb030)); });
      g.add(box(0.16, 0.26, 0.02, 0x120f20, 0, 0.29, 0.26));
      // balloon
      var bal = new THREE.Group();
      bal.add(mesh(new THREE.IcosahedronGeometry(0.17, 1), 0xb3283a));
      var str = mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.6, 3), 0xe8d9c4);
      str.position.y = -0.4; bal.add(str);
      bal.position.set(-0.75, 1.3, 0.55);
      g.add(bal);
      // cipher machine
      g.add(box(0.28, 0.24, 0.2, 0x6b5a4a, 0.62, 0.3, 0.6));
      var lamp = mesh(new THREE.IcosahedronGeometry(0.05, 0), 0xffcf6b, 0xffb030);
      lamp.position.set(0.62, 0.62, 0.6); g.add(lamp);
      g.add(box(0.025, 0.2, 0.025, 0x4a3f36, 0.62, 0.5, 0.6));
      anim.push(function (t) {
        bal.position.y = 1.3 + Math.sin(t * 1.3) * 0.08;
        bal.rotation.z = Math.sin(t * 0.9) * 0.15;
        lamp.visible = Math.sin(t * 5) > -0.3;
      });
    },
    aov: function (g, anim) {
      rockBase(g, 0x2f4a8f, 0x1f2a55, 1.2, 6, 1.4);
      var lane = 0xe8c26a;
      var l1 = box(2.0, 0.04, 0.14, lane, 0, 0.18, 0); l1.rotation.y = Math.PI / 4; g.add(l1);
      g.add(box(1.5, 0.04, 0.1, lane, 0, 0.18, 0.62));
      g.add(box(0.1, 0.04, 1.5, lane, -0.62, 0.18, 0));
      var ped = mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.2, 6), 0x3b4a7a);
      ped.position.y = 0.28; g.add(ped);
      var crystal = mesh(new THREE.OctahedronGeometry(0.3, 0), 0x9fd2ff, 0x3a7cff);
      crystal.scale.y = 1.5; crystal.position.y = 0.85; g.add(crystal);
      function tower(x, z, c, e) {
        g.add(box(0.14, 0.4, 0.14, 0x3b4a7a, x, 0.36, z));
        var tip = mesh(new THREE.OctahedronGeometry(0.1, 0), c, e);
        tip.position.set(x, 0.66, z); g.add(tip);
      }
      tower(0.7, -0.5, 0xff7f8f, 0xff3050); tower(-0.5, 0.7, 0x7fc4ff, 0x3a7cff);
      anim.push(function (t) { crystal.rotation.y = t * 0.9; crystal.position.y = 0.85 + Math.sin(t * 2) * 0.06; });
    },
    delta: function (g, anim) {
      rockBase(g, 0xd9a873, 0xa8743f, 1.15, 7, 1.5);
      g.add(box(0.36, 0.3, 0.36, 0x6b6a3a, -0.45, 0.31, 0.35));
      g.add(box(0.28, 0.24, 0.28, 0x7a5b34, -0.1, 0.28, 0.55));
      g.add(box(0.9, 0.34, 0.36, 0x4f5a3a, 0.25, 0.33, -0.45));
      var mast = mesh(new THREE.CylinderGeometry(0.03, 0.06, 1.4, 4), 0x2c2a26);
      mast.position.set(0.65, 0.86, 0.3); g.add(mast);
      var beacon = mesh(new THREE.IcosahedronGeometry(0.06, 0), 0xff4d3a, 0xff2a10);
      beacon.position.set(0.65, 1.6, 0.3); g.add(beacon);
      var heli = new THREE.Group();
      heli.add(box(0.36, 0.16, 0.16, 0x2f3324, 0, 0, 0));
      heli.add(box(0.36, 0.05, 0.05, 0x2f3324, -0.32, 0.03, 0));
      var rotor = box(0.7, 0.012, 0.05, 0x1d1f17, 0, 0.11, 0);
      heli.add(rotor);
      var orbit = new THREE.Group();
      heli.position.set(1.05, 1.3, 0);
      orbit.add(heli);
      g.add(orbit);
      anim.push(function (t) {
        orbit.rotation.y = t * 0.6;
        rotor.rotation.y = t * 30;
        heli.rotation.z = Math.sin(t) * 0.08;
        beacon.visible = Math.sin(t * 4) > 0;
      });
    }
  };

  var ring = new THREE.Group();
  scene.add(ring);
  var islands = [];
  var anims = [];
  games.forEach(function (game, i) {
    var g = new THREE.Group();
    builders[game.id](g, anims);
    g.userData.id = game.id;
    var holder = new THREE.Group();
    holder.add(g);
    ring.add(holder);
    var a = document.createElement('a');
    a.className = 'island-label';
    a.href = 'game.html?id=' + game.id;
    a.innerHTML = '<span class="squircle">' + SP.icon(game.id) + '</span>' + game.short;
    a.addEventListener('pointerenter', function () { setHot(i); });
    a.addEventListener('pointerleave', function () { setHot(-1); });
    a.addEventListener('focus', function () { setHot(i); focusTo(i); });
    a.addEventListener('blur', function () { setHot(-1); });
    labelsLayer.appendChild(a);
    islands.push({ holder: holder, inner: g, label: a, phase: i * 1.37, scale: 1, id: game.id });
  });

  var radius = 3.4;
  function layout() {
    var w = root.clientWidth, h = root.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    var aspect = w / h;
    camera.aspect = aspect;
    radius = aspect < 1 ? 2.5 : 3.3;
    islands.forEach(function (isl, i) {
      var ang = (i / islands.length) * Math.PI * 2;
      isl.holder.position.set(Math.sin(ang) * radius, 0, Math.cos(ang) * radius);
    });
    var extent = radius + 1.35;
    var halfTan = Math.tan((camera.fov / 2) * Math.PI / 180);
    var dist = Math.max(extent / (halfTan * aspect), (extent * 0.9) / halfTan, 8);
    var elev = aspect < 1 ? 0.78 : 0.42;
    camera.position.set(0, Math.sin(elev) * dist, Math.cos(elev) * dist);
    camera.lookAt(0, -0.2, 0);
    camera.updateProjectionMatrix();
  }

  var hot = -1;
  function setHot(i) {
    hot = i;
    islands.forEach(function (isl, k) { isl.label.classList.toggle('is-hot', k === i); });
    renderer.domElement.style.cursor = i >= 0 ? 'pointer' : '';
    kick();
  }

  // Rotation state
  var angle = 0, velocity = 0, target = null;
  var autoSpeed = reduce ? 0 : 0.12;

  function focusTo(i) {
    // Bring island i to the front (angle where its world z is max).
    var base = -(i / islands.length) * Math.PI * 2;
    var diff = ((base - angle) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
    target = angle + diff;
    kick();
  }

  // Pointer: horizontal drag spins, tap picks. Vertical gestures stay with page scroll (touch-action: pan-y).
  var raycaster = new THREE.Raycaster();
  var ndc = new THREE.Vector2();
  var down = null;
  var el = renderer.domElement;

  function pick(clientX, clientY) {
    var r = el.getBoundingClientRect();
    ndc.x = ((clientX - r.left) / r.width) * 2 - 1;
    ndc.y = -((clientY - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    var hits = raycaster.intersectObject(ring, true);
    if (!hits.length) return -1;
    var o = hits[0].object;
    while (o && o.userData.id === undefined) o = o.parent;
    if (!o) return -1;
    for (var i = 0; i < islands.length; i++) if (islands[i].inner === o) return i;
    return -1;
  }

  el.addEventListener('pointerdown', function (e) {
    if (down) return;
    down = { x: e.clientX, y: e.clientY, last: e.clientX, t: performance.now(), drag: false, id: e.pointerId };
    velocity = 0; target = null;
  });
  el.addEventListener('pointermove', function (e) {
    if (down && e.pointerType === 'mouse' && e.buttons === 0) { end(e); return; }
    if (!down) {
      if (e.pointerType === 'mouse') setHot(pick(e.clientX, e.clientY));
      return;
    }
    if (e.pointerId !== down.id) return;
    var dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (!down.drag && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      down.drag = true;
      root.classList.add('dragging');
      try { el.setPointerCapture(down.id); } catch (err) {}
    }
    if (down.drag) {
      var step = (e.clientX - down.last) * 0.009;
      angle += step;
      var now = performance.now();
      velocity = step / Math.max(1, now - down.t) * 16;
      down.t = now;
      down.last = e.clientX;
      kick();
    }
  });
  function end(e) {
    if (!down || (e.pointerId !== down.id && e.type !== 'pointermove')) return;
    var wasDrag = down.drag;
    var moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    down = null;
    root.classList.remove('dragging');
    if (!wasDrag && moved < 10 && e.type === 'pointerup') {
      var i = pick(e.clientX, e.clientY);
      if (i >= 0) window.location.href = 'game.html?id=' + islands[i].id;
    }
  }
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
  el.addEventListener('lostpointercapture', end);
  window.addEventListener('pointerup', function (e) { if (down && e.target !== el) end(e); });
  el.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !down) setHot(-1); });

  // Render loop: only while visible.
  var visible = true, running = false, last = 0, clock = 0, idleFrames = 0;
  var v3 = new THREE.Vector3();

  function frame(now) {
    if (!visible || document.hidden) { running = false; return; }
    var dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    if (!reduce) clock += dt;

    if (target !== null) {
      angle += (target - angle) * Math.min(1, dt * 6);
      if (Math.abs(target - angle) < 0.001) target = null;
    } else if (!down) {
      angle += velocity;
      velocity *= 0.94;
      if (Math.abs(velocity) < 0.0004) velocity = 0;
      if (hot < 0) angle += autoSpeed * dt;
    }
    ring.rotation.y = angle;

    var w = root.clientWidth, h = root.clientHeight;
    var depths = [];
    islands.forEach(function (isl, i) {
      isl.inner.position.y = reduce ? 0 : Math.sin(clock * 1.1 + isl.phase) * 0.12;
      var want = i === hot ? 1.1 : 1;
      isl.scale += (want - isl.scale) * Math.min(1, dt * 10 || 1);
      isl.inner.scale.setScalar(isl.scale);
      isl.inner.rotation.y = -angle * 0.4 + isl.phase;

      isl.holder.getWorldPosition(v3);
      var z = v3.z;
      v3.y += 1.95 + isl.inner.position.y;
      v3.project(camera);
      var x = (v3.x * 0.5 + 0.5) * w, y = (-v3.y * 0.5 + 0.5) * h;
      var front = (z + radius) / (2 * radius); // 0 back … 1 front
      var lab = isl.label;
      lab.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-50%) scale(' + (0.82 + front * 0.18).toFixed(3) + ')';
      lab.style.opacity = (0.45 + front * 0.55).toFixed(2);
      depths.push([front, lab]);
    });
    depths.sort(function (a, b) { return a[0] - b[0]; }).forEach(function (d, k) { d[1].style.zIndex = k + 1; });

    anims.forEach(function (fn) { fn(clock); });
    renderer.render(scene, camera);

    // With reduced motion and nothing moving, stop after a few frames.
    var still = reduce && !down && velocity === 0 && target === null;
    idleFrames = still ? idleFrames + 1 : 0;
    if (idleFrames > 20) { running = false; return; }
    requestAnimationFrame(frame);
  }
  function kick() {
    if (running || !visible || document.hidden) return;
    running = true; last = 0; idleFrames = 0;
    requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) kick();
    }).observe(root);
  }
  document.addEventListener('visibilitychange', kick);
  if ('ResizeObserver' in window) new ResizeObserver(function () { layout(); kick(); }).observe(root);
  else window.addEventListener('resize', function () { layout(); kick(); });

  layout();
  kick();
};
