(() => {
  'use strict';
  const fortunes = [["留一点空白", "今天可以给日程留一个不命名的小角落。它不必产出什么。"], ["先有草稿", "不妨把“做漂亮”暂时换成“先做出来”。第一版有点笨，也算登场。"], ["好奇心散步", "找一个你平时忽略的细节，认真看半分钟。世界不一定变了，镜头可以换。"], ["少猜一句", "如果你正在替某个人补写内心独白，可以试着问一个具体问题。"], ["把喜欢说具体", "比起“挺好的”，试试说出究竟喜欢哪一点。小小的准确，也很动人。"], ["允许没答案", "有些问题今天不必结案。先把问题写下来，也是一种整理。"], ["完成一个小句号", "挑一件五分钟内能收尾的小事。今天的满足感可以很小。"], ["保留一点古怪", "给普通的一天加一个无害的小变化：换首歌，换个杯子，换一句开场白。"], ["温柔地说不", "“这次我先不参加”也可以是一句完整的话。无需为每个边界写长篇说明。"], ["重读自己的喜欢", "翻翻旧照片、收藏或书页。看看哪些喜欢一直陪着你，哪些已经悄悄改变。"], ["不用抢答", "如果被问住了，可以说：“让我想一下。”停顿不是故障。"], ["计划留个活口", "写下一个必要步骤，再留一个可选步骤。今天不用把每条支线都通关。"], ["把感受写成天气", "如果难以形容心情，试试写“多云”“微风”或“局部闷热”。不需要标准答案。"], ["找回一句自己的话", "暂时放下“大家都说”。这件小事，你自己究竟怎么想？"], ["认真玩一会儿", "可以做点没有用途的小东西：一张涂鸦、一句怪诗、一段乱哼的旋律。"], ["给变化留位置", "昨天喜欢的，今天可以不喜欢。更新偏好不需要递交申请。"], ["从具体处开始", "把“我要整理一下”缩小成“先收好桌上的三样东西”。入口小一点也很好。"], ["不用把自己讲完", "一次聊天只表达一个真实想法，也足够。你不用立刻交出完整的自我介绍。"], ["留住一个普通瞬间", "记下今天一个不起眼的画面。记录的价值，不必靠大事证明。"], ["今天没有隐藏任务", "抽到这张，就允许自己不从它身上学到任何道理。玩一下，本来就可以。"]];
  const output = document.getElementById('fortune-output');
  const refresh = document.getElementById('fortune-refresh');
  const select = document.getElementById('type-select');
  const form = document.getElementById('type-form');
  const go = document.getElementById('type-go');
  const reset = document.getElementById('type-reset');
  const format = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Shanghai', year:'numeric', month:'2-digit', day:'2-digit'});
  const dayMs = 86400000;
  let displayedDate = '';
  let timer;
  function updateFortune() {
    const now = new Date();
    const parts = Object.fromEntries(format.formatToParts(now).map(p => [p.type,p.value]));
    const date = `${parts.year}-${parts.month}-${parts.day}`;
    const day = Date.UTC(Number(parts.year),Number(parts.month)-1,Number(parts.day));
    const offset = Math.round((day-Date.UTC(2026,0,1))/dayMs);
    const index = ((offset % fortunes.length) + fortunes.length) % fortunes.length;
    if (date !== displayedDate) {
      const stamp = document.createElement('p');
      stamp.textContent = `${date} · 北京时间 · 第 ${index+1} / ${fortunes.length} 签`;
      const title = document.createElement('h3');
      title.textContent = fortunes[index][0];
      const text = document.createElement('p');
      text.textContent = fortunes[index][1];
      output.replaceChildren(stamp,title,text);
      displayedDate = date;
    }
    clearTimeout(timer);
    // The next Beijing midnight expressed in UTC; recompute after visibility/focus changes.
    const nextMidnight = day + dayMs - 8*3600000;
    timer = setTimeout(updateFortune, Math.max(1000,nextMidnight-now.getTime()+100));
  }
  refresh.disabled = false;
  select.disabled = false;
  reset.disabled = false;
  refresh.addEventListener('click', updateFortune);
  select.addEventListener('change', () => {go.disabled = !select.value;});
  form.addEventListener('reset', () => {go.disabled = true;});
  form.addEventListener('submit', event => {
    event.preventDefault();
    const heading = document.getElementById(`type-${select.value}`);
    if (!heading) return;
    window.location.hash = heading.id;
    heading.focus({preventScroll:true});
  });
  document.addEventListener('visibilitychange', () => {if (!document.hidden) updateFortune();});
  window.addEventListener('focus', updateFortune);
  updateFortune();
})();
