(() => {
  'use strict';

  function makeIcon(kind) {
    const icon = document.createElement('span');
    icon.setAttribute('class', `icon icon-${kind}`);
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }

  const lampToggle = document.getElementById('lamp-toggle');
  const lampLabel = document.getElementById('lamp-label');
  const lampState = document.getElementById('lamp-state');
  const lampHint = document.getElementById('lamp-hint');
  const openSign = document.querySelector('.open-sign');
  let lampOn = true;
  lampToggle.addEventListener('click', () => {
    lampOn = !lampOn;
    document.body.classList.toggle('lights-out', !lampOn);
    lampToggle.setAttribute('aria-pressed', String(lampOn));
    lampToggle.setAttribute('aria-label', lampOn ? '桌灯已开启，点击关灯' : '桌灯已关闭，点击开灯');
    lampLabel.textContent = lampOn ? '留一盏灯' : '借一点月光';
    lampState.textContent = lampOn ? 'ON' : 'OFF';
    lampHint.textContent = lampOn ? '夜再深一点，也没关系。' : '月亮会暂时接班。';
    openSign.replaceChildren();
    openSign.append(document.createElement('i'), document.createTextNode(lampOn ? '灯还亮着' : '月亮值班'));
  });

  const quotes = [
    ['不是每一次走神，', '都需要被纠正。'],
    ['先把种子埋下。', '答案可以晚一点发芽。'],
    ['给今天留一点空白，', '让明天有地方落脚。'],
    ['绕一点远路，', '也许会捡到一颗星星。'],
    ['慢慢来也很好。', '月亮从来不赶末班车。'],
    ['有些微小的喜欢，', '本身就是很好的理由。']
  ];
  let quoteIndex = 0;
  const paperQuote = document.getElementById('paper-quote');
  const slipNumber = document.getElementById('slip-number');
  document.getElementById('paper-button').addEventListener('click', () => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    paperQuote.replaceChildren(document.createTextNode(quotes[quoteIndex][0]), document.createElement('br'), document.createTextNode(quotes[quoteIndex][1]));
    slipNumber.textContent = `第 ${String(quoteIndex + 1).padStart(2, '0')} 张 / 共 06 张`;
  });

  const foxThoughts = ['嘘，今天的月亮是半糖的。', '我没有发呆。我在等一个念头路过。', '尾巴负责保暖，好奇心负责迷路。', '如果星星掉下来，就种在花盆里。', '这个鼻尖只接收善意和小饼干。'];
  let foxThoughtIndex = 0;
  document.getElementById('fox-nose-button').addEventListener('click', () => {
    const thought = document.getElementById('fox-thought');
    thought.textContent = foxThoughts[foxThoughtIndex];
    thought.classList.toggle('is-visible', true);
    foxThoughtIndex = (foxThoughtIndex + 1) % foxThoughts.length;
  });

  const seedStages = [
    { story: ['它还没有决定，', '要成为一片叶子，还是一颗小星星。'], label: '借它一点月光', description: '一粒种子在月光下，等待发芽' },
    { story: ['先伸一个小小的懒腰，', '不着急向整个世界介绍自己。'], label: '再陪它待一会儿', description: '种子发芽了，长出两片小叶子' },
    { story: ['原来它想种出的，', '是属于自己的那一点光。'], label: '让它重新做梦', description: '小芽的顶端开出一颗金色的星星花' }
  ];
  let seedStage = 0;
  const seedButton = document.getElementById('seed-button');
  seedButton.addEventListener('click', () => {
    seedStage = (seedStage + 1) % seedStages.length;
    const stage = seedStages[seedStage];
    document.getElementById('seed-window').setAttribute('data-stage', String(seedStage));
    document.getElementById('seed-art').setAttribute('aria-label', stage.description);
    document.getElementById('seed-story').replaceChildren(document.createTextNode(stage.story[0]), document.createElement('br'), document.createTextNode(stage.story[1]));
    const arrow = makeIcon('arrow');
    seedButton.replaceChildren(document.createTextNode(stage.label), arrow);
  });

  const canvas = document.getElementById('constellation');
  const ctx = canvas.getContext('2d');
  const orderButton = document.getElementById('order-button');
  const scatterButton = document.getElementById('scatter-button');
  const motionButton = document.getElementById('motion-button');
  const status = document.getElementById('experiment-status');
  const mapLabel = document.getElementById('map-label');
  const map = document.querySelector('.star-map');
  if (!ctx) {
    status.textContent = '这台浏览器没有画布，今晚先用想象力连起星星。';
    for (const button of [orderButton, scatterButton, motionButton]) button.disabled = true;
    return;
  }

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motionPreference.matches;
  let ordered = false;
  let width = 0;
  let height = 0;
  let frame = 0;
  let animationId = 0;
  let previousTime = 0;
  let elapsed = 0;
  let visible = true;
  let ripple = null;
  let cursor = { x: .5, y: .45 };
  const count = 24;
  // A tiny fox, drawn only from stars. Coordinates occupy the upper 80% of the chart.
  const shape = [[.26,.21],[.39,.32],[.50,.29],[.61,.32],[.74,.21],[.71,.51],[.66,.64],[.50,.79],[.34,.64],[.29,.51],[.26,.21],[.34,.45],[.40,.47],[.60,.47],[.66,.45],[.50,.63],[.43,.59],[.57,.59],[.36,.32],[.64,.32],[.14,.42],[.86,.39],[.19,.71],[.82,.68]];
  const edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,0],[9,15],[15,5],[11,12],[13,14],[16,15],[15,17],[17,16],[0,18],[18,1],[3,19],[19,4]];
  const stars = Array.from({ length: count }, (_, i) => ({ x: .08 + Math.random() * .84, y: .12 + Math.random() * .62, tx: .08 + Math.random() * .84, ty: .12 + Math.random() * .62, size: i < 20 ? 1.25 + Math.random() : 1.1, phase: Math.random() * Math.PI * 2 }));
  stars.forEach(star => { star.tx = star.x; star.ty = star.y; });
  const backdrop = Array.from({ length: 42 }, () => ({ x: Math.random(), y: Math.random(), alpha: .13 + Math.random() * .3 }));

  function syncMotionButton() {
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', paused ? '开始星星漂浮' : '暂停星星漂浮');
    motionButton.replaceChildren(makeIcon(paused ? 'play' : 'pause'));
    const label = document.createElement('span');
    label.textContent = paused ? '开始漂浮' : '暂停漂浮';
    motionButton.append(label);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }

  function position(star) {
    const drift = paused || motionPreference.matches ? 0 : 2;
    return { x: star.x * width + Math.sin(elapsed * .00035 + star.phase) * drift, y: star.y * height + Math.cos(elapsed * .00025 + star.phase) * drift };
  }

  function draw() {
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);
    backdrop.forEach(star => {
      ctx.fillStyle = `rgba(173,194,203,${star.alpha})`;
      ctx.beginPath(); ctx.arc(star.x * width, star.y * height, .6, 0, Math.PI * 2); ctx.fill();
    });
    const positions = stars.map(position);
    if (ordered) {
      ctx.lineWidth = .8;
      ctx.strokeStyle = 'rgba(225,181,121,.47)';
      edges.forEach(([a, b]) => {
        ctx.beginPath(); ctx.moveTo(positions[a].x, positions[a].y); ctx.lineTo(positions[b].x, positions[b].y); ctx.stroke();
      });
    } else {
      ctx.lineWidth = .7;
      for (let a = 0; a < count; a++) for (let b = a + 1; b < count; b++) {
        const distance = Math.hypot(positions[a].x - positions[b].x, positions[a].y - positions[b].y);
        const limit = Math.min(width * .17, 95);
        if (distance < limit) {
          ctx.strokeStyle = `rgba(139,168,184,${.15 * (1 - distance / limit)})`;
          ctx.beginPath(); ctx.moveTo(positions[a].x, positions[a].y); ctx.lineTo(positions[b].x, positions[b].y); ctx.stroke();
        }
      }
    }
    positions.forEach((p, i) => {
      const alpha = paused || motionPreference.matches ? .9 : .7 + Math.sin(elapsed * .001 + stars[i].phase) * .2;
      ctx.fillStyle = ordered ? `rgba(240,199,138,${alpha})` : `rgba(205,219,219,${alpha})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, stars[i].size, 0, Math.PI * 2); ctx.fill();
      if (i % 5 === 0) {
        ctx.strokeStyle = ordered ? 'rgba(225,181,121,.35)' : 'rgba(186,204,212,.3)'; ctx.lineWidth = .7;
        ctx.beginPath(); ctx.moveTo(p.x - 5, p.y); ctx.lineTo(p.x + 5, p.y); ctx.moveTo(p.x, p.y - 5); ctx.lineTo(p.x, p.y + 5); ctx.stroke();
      }
    });
    if (ripple) {
      const age = paused || motionPreference.matches ? 320 : elapsed - ripple.started;
      if (age < 950) {
        const progress = age / 950;
        ctx.strokeStyle = `rgba(231,181,120,${(1 - progress) * .5})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(ripple.x * width, ripple.y * height, 7 + progress * 48, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#e7b578'; ctx.beginPath(); ctx.arc(ripple.x * width, ripple.y * height, 2, 0, Math.PI * 2); ctx.fill();
      } else ripple = null;
    }
  }

  function animate(time) {
    animationId = 0;
    if (paused || document.hidden || !visible) return;
    const delta = previousTime ? Math.min(time - previousTime, 50) : 16;
    previousTime = time;
    elapsed += delta;
    const easing = 1 - Math.exp(-delta * .0045);
    stars.forEach(star => { star.x += (star.tx - star.x) * easing; star.y += (star.ty - star.y) * easing; });
    draw();
    frame++;
    animationId = requestAnimationFrame(animate);
  }

  function run() {
    if (animationId) cancelAnimationFrame(animationId);
    animationId = 0;
    previousTime = 0;
    if (!paused && !document.hidden && visible) animationId = requestAnimationFrame(animate);
    else draw();
  }

  function moveToTargets() {
    if (paused || motionPreference.matches) stars.forEach(star => { star.x = star.tx; star.y = star.ty; });
    draw();
    run();
  }

  function setOrder(next) {
    ordered = next;
    map.classList.toggle('is-ordered', ordered);
    orderButton.setAttribute('aria-pressed', String(ordered));
    orderButton.replaceChildren(document.createTextNode(ordered ? '让它们自由' : '让星星归位'));
    orderButton.append(makeIcon('arrow'));
    stars.forEach((star, i) => { star.tx = ordered ? shape[i][0] : .08 + Math.random() * .84; star.ty = ordered ? shape[i][1] : .12 + Math.random() * .62; });
    status.textContent = ordered ? '发现了：一只藏在星星里的狐狸。' : '当前状态：自由散步中';
    mapLabel.replaceChildren();
    const sparkle = makeIcon('star'); mapLabel.append(sparkle, document.createTextNode(ordered ? '原来，混沌里也住着一只狐狸。' : '所有偶然，都还没有名字。'));
    canvas.setAttribute('aria-label', ordered ? '星星连成了一只狐狸。按回车或空格让它们重新散开，方向键移动涟漪位置。' : '互动星图。按回车或空格让星星连成狐狸，方向键移动涟漪位置。');
    ripple = null;
    moveToTargets();
  }
  orderButton.addEventListener('click', () => setOrder(!ordered));
  scatterButton.addEventListener('click', () => { setOrder(false); status.textContent = '换了一片星空。偶然也可以重来。'; });
  motionButton.addEventListener('click', () => { paused = !paused; if (paused) stars.forEach(star => { star.x = star.tx; star.y = star.ty; }); syncMotionButton(); run(); });
  motionPreference.addEventListener('change', event => { paused = event.matches; if (paused) stars.forEach(star => { star.x = star.tx; star.y = star.ty; }); syncMotionButton(); run(); });

  function makeRipple(x, y) { cursor = { x, y }; ripple = { x, y, started: elapsed }; draw(); }
  canvas.addEventListener('click', event => {
    const rect = canvas.getBoundingClientRect();
    makeRipple(Math.max(0, Math.min(1, (event.clientX - rect.left) / width)), Math.max(0, Math.min(1, (event.clientY - rect.top) / height)));
  });
  canvas.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setOrder(!ordered); }
    const directions = { ArrowLeft: [-.05, 0], ArrowRight: [.05, 0], ArrowUp: [0, -.05], ArrowDown: [0, .05] };
    if (directions[event.key]) { event.preventDefault(); const [dx, dy] = directions[event.key]; makeRipple(Math.max(.05, Math.min(.95, cursor.x + dx)), Math.max(.05, Math.min(.95, cursor.y + dy))); }
  });
  document.addEventListener('visibilitychange', run);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; run(); }, { rootMargin: '100px' }).observe(canvas);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);
  syncMotionButton();
  resize();
  run();
})();
