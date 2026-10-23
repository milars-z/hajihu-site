/* Two fixed mathematical candidates. All readings are local and synthetic. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const position = byId('sampling-position');
  if (!position) return;
  const toggle = byId('sampling-toggle');
  const reset = byId('sampling-reset');
  const observe = byId('sampling-observe');
  const result = byId('sampling-result');
  const bLayer = byId('sampling-b-layer');
  const reading = byId('sampling-reading');
  const tolerance = 1e-10;
  const curveA = x => Math.sin(2 * Math.PI * x);
  const curveB = x => curveA(x) + .55 * Math.sin(8 * Math.PI * x);
  const format = value => (Math.abs(value) < tolerance ? 0 : value).toFixed(4);
  const formatX = value => value.toFixed(5);
  const plotX = x => 52 + 644 * x;
  const plotY = y => 172 - 92.5 * y;
  let showB = false;
  let measured = false;
  let currentX = .0625;
  const setVisible = (element, visible) => visible ? element.removeAttribute('hidden') : element.setAttribute('hidden', '');

  function render() {
    const raw = Number(position.value);
    currentX = Math.max(0, Math.min(100, Number.isFinite(raw) ? raw : 50)) / 800;
    const a = curveA(currentX);
    const b = curveB(currentX);
    const gap = Math.abs(b - a);
    const x = plotX(currentX);
    const yA = plotY(a);
    const yB = plotY(b);
    byId('sampling-position-value').textContent = `x = ${formatX(currentX)}`;
    position.setAttribute('aria-valuetext', `x 等于 ${formatX(currentX)}，范围 0 到 0.1250`);
    byId('sampling-value-a').textContent = format(a);
    byId('sampling-value-b').textContent = format(b);
    byId('sampling-gap').textContent = format(gap);
    byId('sampling-probe-line').setAttribute('x1', x);
    byId('sampling-probe-line').setAttribute('x2', x);
    byId('sampling-probe-a').setAttribute('cx', x);
    byId('sampling-probe-a').setAttribute('cy', yA);
    byId('sampling-probe-b').setAttribute('d', `M${x} ${yB - 8} ${x + 8} ${yB} ${x} ${yB + 8} ${x - 8} ${yB}Z`);
    byId('sampling-reading-ring').setAttribute('cx', x);
    byId('sampling-reading-ring').setAttribute('cy', yA);
    setVisible(bLayer, showB);
    setVisible(reading, measured);
    toggle.setAttribute('aria-pressed', String(showB));
    toggle.textContent = showB ? '隐藏候选曲线 B' : '显示候选曲线 B';
    byId('sampling-chart-desc').textContent = `九个旧样本始终不变，A 与 B 都经过它们。当前${showB ? '同时显示实线 A 与虚线 B' : '只显示实线 A，候选曲线 B 隐藏'}。待观察位置 x = ${formatX(currentX)}，A 预测 ${format(a)}，B 预测 ${format(b)}，预测差的绝对值 ${format(gap)}。${measured ? '白色圆环表示由 A 生成的模拟读数。' : '尚未在此处补充模拟观测。'}`;
    if (measured) {
      result.textContent = gap < tolerance
        ? `在 x = ${formatX(currentX)}，模拟读数为 ${format(a)}，由 A 生成。这里是已有样本的位置，A 与 B 都吻合，仍无法区分。试着把观察位置移到间隔内部。`
        : `在 x = ${formatX(currentX)}，模拟读数为 ${format(a)}，由 A 生成。A 吻合；B 预测 ${format(b)}，相差 ${format(gap)}，不能通过这次无误差检验。这只区分了 A 与 B，不证明 A 是唯一可能的曲线。`;
    }
  }

  toggle.addEventListener('click', () => { showB = !showB; render(); });
  position.addEventListener('input', () => {
    measured = false;
    result.textContent = '观察位置已更新，旧的模拟读数已清除。请在新位置重新补一次观测。';
    render();
  });
  observe.addEventListener('click', () => { measured = true; render(); });
  reset.addEventListener('click', () => {
    position.value = '50';
    showB = false;
    measured = false;
    result.textContent = '已回到最初：九个旧样本不变，探针位于第一格中点。还没有补充观测。';
    render();
  });
  render();
  [position, toggle, reset, observe].forEach(control => { control.disabled = false; });
})();
