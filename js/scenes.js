/* Hand-drawn SVG worlds (viewBox 400×250) and squircle icons. Original fan illustrations, no official assets. */
window.SP = window.SP || {};

(function () {
  // Repeat a group twice, 400 units apart, so a -400 translate loops seamlessly.
  function loop(cls, inner) {
    return '<g class="' + cls + '">' + inner + '<g transform="translate(400 0)">' + inner + '</g></g>';
  }

  function pixelCloud(x, y, s, fill) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="' + fill + '">' +
      '<rect x="0" y="8" width="56" height="12"/><rect x="10" y="0" width="30" height="8"/><rect x="8" y="20" width="40" height="6"/></g>';
  }

  var scenes = {};

  scenes.minecraft = function (p) {
    var hills = '';
    // Back hill row of blocks
    var back = [3, 4, 4, 5, 5, 4, 3, 3, 4, 6, 6, 5, 4, 4, 3, 3, 4, 5, 5, 4];
    back.forEach(function (h, i) {
      var y = 250 - h * 20 - 60;
      hills += '<rect x="' + i * 20 + '" y="' + y + '" width="20" height="' + (250 - y) + '" fill="#6f9b4f"/>' +
        '<rect x="' + i * 20 + '" y="' + y + '" width="20" height="6" fill="#88b860"/>';
    });
    var front = '';
    var fh = [2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2];
    fh.forEach(function (h, i) {
      var y = 250 - h * 20 - 10;
      front += '<rect x="' + i * 20 + '" y="' + y + '" width="20" height="' + (250 - y) + '" fill="#8a5a33"/>' +
        '<rect x="' + i * 20 + '" y="' + y + '" width="20" height="9" fill="#5fae3b"/>' +
        '<rect x="' + (i * 20 + 4) + '" y="' + (y + 9) + '" width="4" height="4" fill="#5fae3b"/>' +
        '<rect x="' + (i * 20 + 12) + '" y="' + (y + 22) + '" width="4" height="4" fill="#6e4628"/>' +
        '<rect x="' + (i * 20 + 6) + '" y="' + (y + 34) + '" width="4" height="4" fill="#6e4628"/>';
    });
    var water = '<rect x="160" y="196" width="80" height="54" fill="#3d7fd9"/><rect x="160" y="196" width="80" height="5" fill="#6fa6f0" class="pulse"/>';
    var tree = '<g transform="translate(64 108)">' +
      '<rect x="18" y="40" width="12" height="44" fill="#6b4a2b"/><rect x="18" y="52" width="4" height="8" fill="#55391f"/>' +
      '<rect x="0" y="8" width="48" height="36" fill="#3f8a2f"/><rect x="10" y="0" width="28" height="12" fill="#4e9e38"/>' +
      '<rect x="4" y="16" width="8" height="8" fill="#56a83e"/><rect x="32" y="28" width="8" height="8" fill="#347826"/></g>';
    var tree2 = '<g transform="translate(300 116) scale(.8)">' +
      '<rect x="18" y="40" width="12" height="44" fill="#6b4a2b"/>' +
      '<rect x="0" y="8" width="48" height="36" fill="#3f8a2f"/><rect x="10" y="0" width="28" height="12" fill="#4e9e38"/></g>';
    // A little blocky explorer
    var hero = '<g transform="translate(250 168)" class="bob">' +
      '<rect x="0" y="0" width="14" height="14" fill="#c99a6e"/><rect x="0" y="0" width="14" height="5" fill="#4a3222"/>' +
      '<rect x="3" y="7" width="3" height="2" fill="#3b2a7a"/><rect x="9" y="7" width="3" height="2" fill="#3b2a7a"/>' +
      '<rect x="-1" y="14" width="16" height="14" fill="#2fa8a8"/><rect x="2" y="28" width="5" height="10" fill="#3a3fa8"/><rect x="8" y="28" width="5" height="10" fill="#3a3fa8"/>' +
      '<rect x="15" y="15" width="4" height="12" fill="#c99a6e"/><rect x="17" y="8" width="3" height="12" fill="#8a6b45"/><rect x="14" y="5" width="10" height="4" fill="#9fe7ff"/></g>';
    var ores = '<rect x="24" y="222" width="6" height="6" fill="#7fe3ff"/><rect x="330" y="228" width="6" height="6" fill="#f2c94c"/><rect x="104" y="232" width="6" height="6" fill="#2b2b2b"/>';
    return '<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><linearGradient id="' + p + 'mcsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4ff"/><stop offset="1" stop-color="#c8ecff"/></linearGradient></defs>' +
      '<rect width="400" height="250" fill="url(#' + p + 'mcsky)"/>' +
      '<rect x="318" y="26" width="34" height="34" fill="#fff7c2"/><rect x="324" y="32" width="22" height="22" fill="#ffe96b"/>' +
      loop('drift-slow', pixelCloud(30, 30, 1, '#fff') + pixelCloud(190, 54, .8, '#f4fbff') + pixelCloud(290, 92, .6, '#fff')) +
      hills + tree2 + tree + water + front + hero + ores + '</svg>';
  };

  scenes.sky = function (p) {
    var lights = '';
    [[70, 88, 0], [128, 60, 1.2], [300, 70, .6], [342, 120, 2], [220, 40, 1.6]].forEach(function (l) {
      lights += '<g transform="translate(' + l[0] + ' ' + l[1] + ')"><g class="pulse" style="animation-delay:' + l[2] + 's">' +
        '<circle r="9" fill="#fff3c4" opacity=".35"/><path d="M0 -5 L4 0 L0 5 L-4 0Z" fill="#fff8de"/>' +
        '<path d="M-4 0 Q-12 -6 -14 2 Q-9 0 -4 2Z M4 0 Q12 -6 14 2 Q9 0 4 2Z" fill="#ffe7a3"/></g></g>';
    });
    var cloudsBack = '<g fill="#f7d9d6" opacity=".9"><ellipse cx="40" cy="170" rx="70" ry="22"/><ellipse cx="150" cy="176" rx="80" ry="20"/><ellipse cx="270" cy="168" rx="76" ry="24"/><ellipse cx="370" cy="174" rx="60" ry="18"/></g>';
    var cloudsMid = '<g fill="#fde9e4"><ellipse cx="0" cy="196" rx="90" ry="26"/><ellipse cx="120" cy="204" rx="80" ry="24"/><ellipse cx="230" cy="198" rx="90" ry="28"/><ellipse cx="340" cy="206" rx="80" ry="22"/></g>';
    var cloudsFront = '<g fill="#fff3ef"><ellipse cx="60" cy="236" rx="110" ry="30"/><ellipse cx="200" cy="240" rx="90" ry="26"/><ellipse cx="330" cy="234" rx="110" ry="32"/></g>';
    var temple = '<g fill="#b9a2c9" opacity=".75"><rect x="296" y="112" width="6" height="56"/><path d="M290 112 L299 92 L308 112Z"/><rect x="314" y="128" width="5" height="40"/><path d="M309 128 L316.5 112 L324 128Z"/><rect x="280" y="132" width="4" height="36"/></g>';
    var child = '<g transform="translate(176 156)">' +
      '<g class="flicker"><circle cx="18" cy="-10" r="16" fill="#ffd76a" opacity=".22"/><circle cx="18" cy="-10" r="7" fill="#ffe9a8" opacity=".6"/></g>' +
      '<path d="M0 0 Q-10 26 -14 34 L14 34 Q10 26 8 0Z" fill="#5a4fa0"/>' +
      '<path d="M-14 34 L-8 30 L-4 35 L1 30 L5 35 L10 30 L14 34Z" fill="#433a82"/>' +
      '<circle cx="4" cy="-4" r="7" fill="#f3e1d4"/><path d="M-3 -6 Q4 -15 11 -6 Q4 -9 -3 -6Z" fill="#2c2550"/>' +
      '<rect x="16" y="-6" width="4" height="9" rx="1" fill="#fff6e0"/><path d="M18 -12 Q21 -8 18 -6 Q15 -8 18 -12Z" fill="#ffb84d" class="flicker"/></g>';
    return '<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><linearGradient id="' + p + 'skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f7fd0"/><stop offset=".55" stop-color="#e8a7b5"/><stop offset="1" stop-color="#ffd6b0"/></linearGradient>' +
      '<radialGradient id="' + p + 'sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6d8"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="400" height="250" fill="url(#' + p + 'skyg)"/>' +
      '<circle cx="110" cy="150" r="90" fill="url(#' + p + 'sun)"/>' +
      '<g fill="#fff" opacity=".7"><circle cx="40" cy="30" r="1"/><circle cx="90" cy="18" r="1.2"/><circle cx="180" cy="26" r="1"/><circle cx="260" cy="14" r="1.3"/><circle cx="360" cy="34" r="1"/></g>' +
      temple + loop('drift-slow', cloudsBack) + lights + loop('drift', cloudsMid) + child + loop('drift-fast', cloudsFront) + '</svg>';
  };

  scenes.idv = function (p) {
    var windows = '';
    [[150, 120], [176, 120], [214, 120], [240, 120], [150, 150], [240, 150], [195, 98]].forEach(function (w, i) {
      windows += '<rect x="' + w[0] + '" y="' + w[1] + '" width="10" height="16" rx="5" fill="#ffcf6b"' + (i % 3 === 0 ? ' class="pulse"' : '') + '/>';
    });
    var manor = '<g fill="#1d1830">' +
      '<rect x="136" y="110" width="128" height="90"/><path d="M128 112 L200 66 L272 112Z"/>' +
      '<rect x="186" y="80" width="28" height="40"/><path d="M182 82 L200 44 L218 82Z"/>' +
      '<rect x="120" y="96" width="22" height="104"/><path d="M116 98 L131 64 L146 98Z"/>' +
      '<rect x="258" y="96" width="22" height="104"/><path d="M254 98 L269 64 L284 98Z"/>' +
      '<rect x="190" y="164" width="20" height="36" rx="10" fill="#120f20"/></g>';
    var cipher = '<g transform="translate(296 168)">' +
      '<rect x="0" y="0" width="34" height="30" rx="3" fill="#6b5a4a"/><rect x="4" y="4" width="26" height="12" rx="2" fill="#2a2420"/>' +
      '<rect x="6" y="20" width="4" height="4" fill="#c9a46a"/><rect x="13" y="20" width="4" height="4" fill="#c9a46a"/><rect x="20" y="20" width="4" height="4" fill="#c9a46a"/>' +
      '<rect x="15" y="-22" width="3" height="22" fill="#4a3f36"/><circle cx="16.5" cy="-24" r="4" fill="#ffcf6b" class="blink"/>' +
      '<path d="M6 10 L10 6 L14 12 L18 7 L22 11 L28 8" stroke="#7fffb0" stroke-width="1.5" fill="none" class="pulse"/></g>';
    var balloon = '<g class="bob"><path d="M92 120 Q96 150 90 186" stroke="#e8d9c4" stroke-width="1" fill="none"/><ellipse cx="92" cy="110" rx="13" ry="16" fill="#b3283a"/><ellipse cx="88" cy="104" rx="3" ry="5" fill="#e0606f"/></g>';
    var crows = '<g fill="#0f0c18" class="drift-slow"><path d="M60 50 q6 -6 12 0 q6 -6 12 0 q-6 -2 -12 2 q-6 -4 -12 -2Z"/><path d="M300 36 q5 -5 10 0 q5 -5 10 0 q-5 -2 -10 2 q-5 -4 -10 -2Z"/><path d="M460 50 q6 -6 12 0 q6 -6 12 0 q-6 -2 -12 2 q-6 -4 -12 -2Z"/></g>';
    var fence = '';
    for (var i = 0; i < 20; i++) fence += '<rect x="' + (i * 20 + 4) + '" y="196" width="4" height="22" fill="#15111f"/><path d="M' + (i * 20 + 4) + ' 196 L' + (i * 20 + 6) + ' 190 L' + (i * 20 + 8) + ' 196Z" fill="#15111f"/>';
    return '<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><linearGradient id="' + p + 'idvg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2147"/><stop offset=".7" stop-color="#5a3f63"/><stop offset="1" stop-color="#7a5468"/></linearGradient>' +
      '<radialGradient id="' + p + 'moon" cx=".5" cy=".5" r=".5"><stop offset=".55" stop-color="#f7ecd2"/><stop offset=".6" stop-color="#f7ecd2" stop-opacity=".25"/><stop offset="1" stop-color="#f7ecd2" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + p + 'fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9b6c6" stop-opacity="0"/><stop offset="1" stop-color="#c9b6c6" stop-opacity=".55"/></linearGradient></defs>' +
      '<rect width="400" height="250" fill="url(#' + p + 'idvg)"/>' +
      '<circle cx="300" cy="64" r="56" fill="url(#' + p + 'moon)"/>' + crows +
      '<path d="M0 200 Q100 186 200 196 T400 192 V250 H0Z" fill="#2a2036"/>' +
      manor + windows + balloon + cipher + fence +
      '<rect x="0" y="210" width="400" height="40" fill="#1a1424"/>' +
      loop('drift', '<rect x="0" y="170" width="400" height="80" fill="url(#' + p + 'fog)"/>') + '</svg>';
  };

  scenes.aov = function (p) {
    var lane = 'stroke="#e8c26a" stroke-width="10" stroke-linecap="round" fill="none" opacity=".85"';
    var trees = '';
    [[90, 70], [120, 160], [260, 70], [300, 170], [190, 200], [210, 40], [60, 130], [340, 110]].forEach(function (t) {
      trees += '<circle cx="' + t[0] + '" cy="' + t[1] + '" r="16" fill="#1f5a4a"/><circle cx="' + (t[0] - 5) + '" cy="' + (t[1] - 5) + '" r="8" fill="#2b7a62"/>';
    });
    function tower(x, y, c) {
      return '<g transform="translate(' + x + ' ' + y + ')"><ellipse cx="0" cy="10" rx="12" ry="5" fill="#000" opacity=".25"/><rect x="-6" y="-14" width="12" height="24" rx="3" fill="#3b4a7a"/>' +
        '<path d="M0 -30 L8 -16 L0 -10 L-8 -16Z" fill="' + c + '" class="pulse"/></g>';
    }
    var sparks = '';
    for (var i = 0; i < 10; i++) {
      var x = 40 + (i * 37) % 330, y = 220 - (i * 23) % 60;
      sparks += '<circle cx="' + x + '" cy="' + y + '" r="2" fill="#ffe39a" class="rise" style="animation-delay:' + (i * .7) + 's"/>';
    }
    return '<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><radialGradient id="' + p + 'aovg" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#3a63c9"/><stop offset=".6" stop-color="#22306e"/><stop offset="1" stop-color="#140f38"/></radialGradient>' +
      '<radialGradient id="' + p + 'core" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#b8a6ff"/><stop offset="1" stop-color="#b8a6ff" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="400" height="250" fill="url(#' + p + 'aovg)"/>' +
      '<path d="M20 240 L380 10" stroke="#2c3f86" stroke-width="40" opacity=".5"/>' +
      trees +
      '<path d="M40 225 L40 40 L370 40" ' + lane + '/><path d="M40 225 L370 225 L370 40" ' + lane + '/><path d="M40 225 L370 40" ' + lane + '/>' +
      '<circle cx="205" cy="132" r="22" fill="#5a3fb3" opacity=".6"/><path d="M196 132 q9 -10 18 0 q-9 10 -18 0Z" fill="#c9b4ff" class="pulse"/>' +
      tower(110, 186, '#6fb4ff') + tower(160, 160, '#6fb4ff') + tower(250, 100, '#ff6f7f') + tower(300, 74, '#ff6f7f') +
      '<g transform="translate(40 225)"><circle r="40" fill="url(#' + p + 'core)" class="pulse"/><path d="M0 -26 L14 0 L0 18 L-14 0Z" fill="#7fc4ff"/><path d="M0 -26 L14 0 L0 0Z" fill="#c4e4ff"/></g>' +
      '<g transform="translate(370 40)"><circle r="36" fill="#ff6f7f" opacity=".25" class="pulse"/><path d="M0 -24 L13 0 L0 16 L-13 0Z" fill="#ff7f8f"/><path d="M0 -24 L13 0 L0 0Z" fill="#ffc4cb"/></g>' +
      sparks + '</svg>';
  };

  scenes.delta = function (p) {
    var tower = '<g transform="translate(318 70)" stroke="#2c2a26" stroke-width="2" fill="none">' +
      '<path d="M0 120 L14 0 L28 120"/><path d="M4 90 L24 90 M7 60 L21 60 M10 30 L18 30 M4 90 L21 60 M24 90 L7 60 M7 60 L18 30 M21 60 L10 30"/>' +
      '<circle cx="14" cy="-4" r="3.5" fill="#ff4d3a" stroke="none" class="blink"/></g>';
    var heli = '<g class="fly"><g transform="translate(0 56)">' +
      '<path d="M0 10 Q2 0 18 0 L34 2 Q40 6 36 12 L8 14Z" fill="#2f3324"/><rect x="34" y="5" width="34" height="4" fill="#2f3324"/><rect x="64" y="-2" width="3" height="12" fill="#2f3324"/>' +
      '<rect x="4" y="3" width="10" height="6" rx="2" fill="#9fb3b8"/><rect x="6" y="14" width="26" height="2" fill="#2f3324"/>' +
      '<rect class="spin" x="-12" y="-4" width="56" height="2" fill="#1d1f17"/></g></g>';
    var smoke = '';
    for (var i = 0; i < 5; i++) smoke += '<circle cx="' + (92 + i * 5) + '" cy="176" r="' + (10 + i * 4) + '" fill="#e8823a" opacity=".45" class="rise" style="animation-delay:' + (i * 1.3) + 's"/>';
    var crates = '<g transform="translate(150 178)"><rect width="34" height="26" fill="#6b6a3a"/><path d="M0 0 L34 26 M34 0 L0 26" stroke="#4e4d29" stroke-width="2"/>' +
      '<rect x="30" y="-18" width="26" height="44" fill="#7a5b34"/><rect x="34" y="-14" width="18" height="4" fill="#f2b33d"/></g>' +
      '<g transform="translate(212 186)"><rect width="70" height="22" fill="#4f5a3a"/><rect x="0" y="0" width="70" height="4" fill="#64704a"/><path d="M8 4 V22 M18 4 V22 M28 4 V22 M38 4 V22 M48 4 V22 M58 4 V22" stroke="#3e4730" stroke-width="2"/></g>';
    return '<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><linearGradient id="' + p + 'dfg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9b98a"/><stop offset=".6" stop-color="#f3d3a6"/><stop offset="1" stop-color="#d9a873"/></linearGradient></defs>' +
      '<rect width="400" height="250" fill="url(#' + p + 'dfg)"/>' +
      '<circle cx="90" cy="92" r="28" fill="#fff1d6" opacity=".9"/>' +
      '<path d="M0 160 L60 120 L110 150 L170 104 L240 146 L300 118 L400 156 V250 H0Z" fill="#c99868" opacity=".7"/>' +
      heli + tower + smoke +
      '<path d="M0 196 Q80 176 160 192 T320 186 T400 190 V250 H0Z" fill="#c08a58"/>' +
      crates +
      '<path d="M0 220 Q120 206 220 222 T400 216 V250 H0Z" fill="#a8743f"/>' +
      '<g fill="#5c4a2e"><rect x="40" y="222" width="30" height="8" rx="4"/><rect x="48" y="214" width="30" height="8" rx="4"/><rect x="330" y="224" width="28" height="8" rx="4"/></g>' +
      '</svg>';
  };

  // Squircle icons (rounded by the .squircle container)
  var icons = {
    minecraft: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" fill="#8a5a33"/><rect width="64" height="22" fill="#5fae3b"/><rect x="0" y="22" width="8" height="8" fill="#5fae3b"/><rect x="24" y="22" width="8" height="6" fill="#5fae3b"/><rect x="48" y="22" width="8" height="10" fill="#5fae3b"/><rect x="14" y="40" width="8" height="8" fill="#6e4628"/><rect x="40" y="48" width="8" height="8" fill="#6e4628"/><rect x="36" y="8" width="8" height="8" fill="#7cc95a"/></svg>',
    sky: '<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="isky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f7fd0"/><stop offset="1" stop-color="#f3b6a6"/></linearGradient></defs><rect width="64" height="64" fill="url(#isky)"/><circle cx="32" cy="30" r="14" fill="#fff3c4" opacity=".35"/><path d="M32 20 L38 30 L32 40 L26 30Z" fill="#fff8de"/><path d="M26 30 Q14 22 10 34 Q18 30 26 33Z M38 30 Q50 22 54 34 Q46 30 38 33Z" fill="#ffe7a3"/><ellipse cx="32" cy="58" rx="30" ry="8" fill="#fff" opacity=".8"/></svg>',
    idv: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" fill="#2b2147"/><circle cx="44" cy="18" r="9" fill="#f7ecd2"/><rect x="16" y="26" width="32" height="26" rx="3" fill="#6b5a4a"/><rect x="20" y="30" width="24" height="10" rx="2" fill="#1a1612"/><path d="M22 36 L26 32 L30 38 L34 33 L38 37 L42 34" stroke="#7fffb0" stroke-width="1.6" fill="none"/><rect x="21" y="44" width="5" height="4" fill="#c9a46a"/><rect x="29" y="44" width="5" height="4" fill="#c9a46a"/><rect x="37" y="44" width="5" height="4" fill="#c9a46a"/><rect x="30" y="14" width="3" height="12" fill="#4a3f36"/><circle cx="31.5" cy="13" r="3" fill="#ffcf6b"/></svg>',
    aov: '<svg viewBox="0 0 64 64" aria-hidden="true"><defs><radialGradient id="iaov" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#3a63c9"/><stop offset="1" stop-color="#140f38"/></radialGradient></defs><rect width="64" height="64" fill="url(#iaov)"/><path d="M12 52 L52 12" stroke="#e8c26a" stroke-width="5" stroke-linecap="round"/><path d="M12 52 L12 14 M12 52 L50 52" stroke="#e8c26a" stroke-width="3" stroke-linecap="round" opacity=".6"/><path d="M32 16 L42 32 L32 46 L22 32Z" fill="#7fc4ff"/><path d="M32 16 L42 32 L32 32Z" fill="#d6ecff"/></svg>',
    delta: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" fill="#d9a873"/><path d="M0 44 Q20 36 36 42 T64 40 V64 H0Z" fill="#a8743f"/><circle cx="32" cy="28" r="15" fill="none" stroke="#2c2a26" stroke-width="3"/><path d="M32 8 V20 M32 36 V48 M12 28 H24 M40 28 H52" stroke="#2c2a26" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="28" r="2.5" fill="#ff4d3a"/></svg>'
  };

  SP.scene = function (id, prefix) { return scenes[id] ? scenes[id](prefix || id) : ''; };
  SP.icon = function (id) { return icons[id] || ''; };
})();
