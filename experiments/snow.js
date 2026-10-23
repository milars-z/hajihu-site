/* Original drawing rules, not a model of crystal physics. No time or randomness. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const arms = byId('snow-arms');
  if (!arms) return;
  const selectors = [1, 2, 3].map(n => byId(`snow-choice-${n}`));
  const grow = byId('snow-grow');
  const demo = byId('snow-demo');
  const reset = byId('snow-reset');
  const status = byId('snow-status');
  const defaults = ['extend', 'branch', 'taper'];
  const rules = {
    extend: { name: '伸长', length: 65, hint: '向外添一段较长的主枝，不增加侧枝。', done: '每条主枝都向外长了一截。' },
    branch: { name: '分枝', length: 55, hint: '添一段主枝，再画出三对带小叉的侧枝。', done: '六个方向都多了三对侧枝，轮廓变得蓬松。' },
    taper: { name: '收束', length: 36, hint: '补一段短细枝和小尖端；不会让旧枝条缩回。', done: '末端添了短细枝和小尖，旧枝条没有缩回。' }
  };
  const colors = ['#acc9c4', '#d3dfd1', '#e6c68e'];
  let completed = 0;
  const selectedRules = () => selectors.map(select => Object.prototype.hasOwnProperty.call(rules, select.value) ? select.value : 'extend');
  function element(tag, attributes) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  }
  function line(parent, x1, y1, x2, y2, width) {
    parent.append(element('path', { d: `M${x1.toFixed(3)} ${y1.toFixed(3)}L${x2.toFixed(3)} ${y2.toFixed(3)}`, 'stroke-width': width }));
  }
  function drawStage(parent, key, stage, arm, start) {
    // These small, repeatable offsets are drawing choices, not measured variability.
    const scale = .95 + ((arm * 7) % 9) / 100;
    const length = rules[key].length * scale;
    const end = start + length;
    const group = element('g', { 'data-rule': key, 'data-stage': stage + 1, stroke: colors[stage], fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    parent.append(group);
    line(group, 0, -start, 0, -end, key === 'taper' ? 1.6 : 2.8 - stage * .3);
    if (key === 'branch') {
      [.35, .64, .88].forEach((fraction, pair) => {
        const root = start + length * fraction;
        [-1, 1].forEach(side => {
          const smallOffset = 1 + (((arm + stage + pair + (side > 0 ? 1 : 0)) % 5) - 2) * .025;
          const twig = (22 + stage * 5 - pair * 3) * smallOffset;
          const x = side * twig * .8;
          const y = -(root + twig * .6);
          line(group, 0, -root, x, y, 1.8);
          line(group, x * .58, -root + (y + root) * .58, x * .58 + side * 7, -root + (y + root) * .58 - 12, 1.1);
        });
      });
    }
    if (key === 'taper') {
      [-1, 1].forEach(side => line(group, 0, -(start + length * .55), side * 9 * scale, -(start + length * .55 + 12 * scale), 1.2));
      group.append(element('path', { d: `M0 ${(-end - 6).toFixed(3)}L3 ${(-end).toFixed(3)}L0 ${(-end + 4).toFixed(3)}L-3 ${(-end).toFixed(3)}Z`, 'stroke-width': 1.2 }));
    }
    return end;
  }
  function render() {
    const sequence = selectedRules();
    arms.replaceChildren();
    for (let arm = 0; arm < 6; arm++) {
      const group = element('g', { transform: `translate(280 280) rotate(${arm * 60})`, 'data-arm': arm + 1 });
      let radius = 20;
      for (let stage = 0; stage < completed; stage++) radius = drawStage(group, sequence[stage], stage, arm, radius);
      arms.append(group);
    }
    selectors.forEach((select, i) => {
      byId(`snow-hint-${i + 1}`).textContent = rules[sequence[i]].hint;
      byId(`snow-step-state-${i + 1}`).textContent = i < completed ? '已画' : i === completed ? '下一段' : '等待';
    });
    byId('snow-count').textContent = `${completed} / 3 段`;
    grow.disabled = completed === 3;
    grow.textContent = completed === 3 ? '三段已经长完' : `长下一段：${rules[sequence[completed]].name}`;
    byId('snow-scene-desc').textContent = completed === 0
      ? '一枚小小的六角种子，尚未长出枝条。下方三段画法可选择，长下一段会同时作用于六个方向。'
      : `原创六枝图案，已完成 ${completed} 段：${sequence.slice(0, completed).map(key => rules[key].name).join('、')}。六枝读取相同画法，长度与小叉位置带有程序预设的细微差别；颜色区分阶段。这不是物理模拟。`;
  }
  demo.addEventListener('click', () => {
    selectors.forEach((select, i) => { select.value = defaults[i]; });
    completed = 3;
    render();
    status.textContent = '示范长好了：先伸长主枝，再添三对侧枝，最后补上短细尖端。六个方向用了同一顺序，所以相似；小差别是预设的绘图偏移，不是自然测量。';
  });
  grow.addEventListener('click', () => {
    if (completed >= 3) return;
    const key = selectedRules()[completed];
    completed++;
    render();
    status.textContent = `第 ${completed} 段「${rules[key].name}」画好了。${rules[key].done}${completed === 3 ? '三段完成。可以回到种子，换一种共同的经历。' : '再点一次，六枝会一起读取下一段画法。'}`;
  });
  reset.addEventListener('click', () => {
    completed = 0;
    render();
    status.textContent = '已回到种子，保留你选的三段画法。可以重新逐段画，也可以点一键示范。';
  });
  selectors.forEach(select => select.addEventListener('change', () => {
    completed = 0;
    render();
    status.textContent = '画法已改变，图案回到种子，避免把两套顺序混在一起。点「长下一段」开始这一片。';
  }));
  render();
  [...selectors, demo, reset].forEach(control => { control.disabled = false; });
})();
