let data; const modules = {}; let saved;try{saved=JSON.parse(localStorage.getItem('surgscope-saved')||'[]')}catch{saved=[]}const $=s=>document.querySelector(s);const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const uniq=a=>[...new Set(a)];const departments=x=>x.departments||[x.dept];const isChina=x=>x.country.includes('中国');const labels={overview:['GLOBAL PRODUCT ATLAS','全球智能外科产品库'],products:['GLOBAL PRODUCT ATLAS','全球产品图谱'],tech:['TECHNOLOGY FRONTIER','技术前沿'],design:['DESIGN RESEARCH','外科机器人产品设计研究'],pain:['CLINICAL INSIGHTS','从临床痛点发现设计机会']};
const siteHeader = $('body > header');
function syncHeaderHeight() {
  const height = Math.ceil(siteHeader.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--site-header-height', `${height}px`);
}
syncHeaderHeight();
new ResizeObserver(syncHeaderHeight).observe(siteHeader);

function goToModule(key) {
  if (key === 'products' && modules.products?.isSaved()) modules.products.reset();
  document.querySelectorAll('nav [data-page]').forEach(button => button.classList.toggle('active', button.dataset.page === key));
  document.getElementById(key).scrollIntoView({behavior: 'instant'});
}
document.querySelectorAll('[data-page]').forEach(button => {
  button.onclick = () => goToModule(button.dataset.page);
});

function createModule(page) {
  const $ = selector => document.querySelector(`#${page}-${selector.slice(1)}`);
  let category = '全部', sub = '全部', kind = '全部', region = '全部', onlySaved = false;
  function reset() {
    category = sub = kind = region = '全部';
    onlySaved = false;
    $('#search').value = '';
    render();
  }
function render(){
 $('#sectionEn').textContent=labels[page][0];$('#sectionTitle').textContent=onlySaved?'我的产品收藏':labels[page][1];document.querySelector('#savedCount').textContent=saved.length;const isProd=['overview','products'].includes(page);
 let base=isProd?data.products:page==='tech'?data.tech:page==='design'?data.design:data.pain;
 const counts=k=>data.products.filter(x=>k==='全部'||x.kind===k).length;
 $('#typeFilters').hidden=!isProd;$('#typeFilters').innerHTML=isProd?`<span>产品类型</span>${['全部',...uniq(data.products.map(x=>x.kind))].map(t=>`<button aria-pressed="${kind===t}" class="${kind===t?'active':''}" data-kind="${t}">${t==='全部'?'全部产品':t} <small>${counts(t)}</small></button>`).join('')}<select id="${page}-region" aria-label="来源地区"><option value="全部">全部地区</option><option value="中国" ${region==='中国'?'selected':''}>中国 / 中外合资</option><option value="海外" ${region==='海外'?'selected':''}>海外</option></select>`:'';
 $('#typeFilters').querySelectorAll('button').forEach(b=>b.onclick=()=>{kind=b.dataset.kind;category=sub='全部';render()});if($('#region'))$('#region').onchange=e=>{region=e.target.value;category=sub='全部';render()};
 if(isProd)base=base.filter(x=>(kind==='全部'||x.kind===kind)&&(region==='全部'||(region==='中国'?isChina(x):!isChina(x)))&&(!onlySaved||saved.includes(x.id)));
 const cats=['全部',...uniq(base.flatMap(x=>isProd?departments(x):[page==='tech'?x.status:x.tag]))];if(!cats.includes(category))category='全部';$('#tabs').innerHTML=cats.map(x=>`<button class="${category===x?'active':''}" data-cat="${esc(x)}">${esc(x)}</button>`).join('');$('#tabs').querySelectorAll('button').forEach(b=>b.onclick=()=>{category=b.dataset.cat;sub='全部';render()});
 let scoped=base.filter(x=>category==='全部'||(isProd?departments(x).includes(category):(page==='tech'?x.status:x.tag)===category));const subs=isProd&&category!=='全部'?['全部',...uniq(scoped.flatMap(x=>x.sub))]:[];if(!subs.includes(sub))sub='全部';$('#subtabs').innerHTML=subs.map(x=>`<button class="${sub===x?'active':''}" data-sub="${esc(x)}">${esc(x)}</button>`).join('');$('#subtabs').querySelectorAll('button').forEach(b=>b.onclick=()=>{sub=b.dataset.sub;render()});
 const q=$('#search').value.trim().toLowerCase();let items=scoped.filter(x=>(sub==='全部'||x.sub?.includes(sub))&&JSON.stringify(x).toLowerCase().includes(q));items.sort((a,b)=>$('#sort').value==='new'?b.date.localeCompare(a.date):a.date.localeCompare(b.date));$('#count').textContent=`${items.length} 条收录`;
 $('#results').innerHTML=(isProd?`<div class="catalog-notice"><b>${data.products.length} 条产品 / 代际 / 应用档案</b><span>按标注的事件时间排序；不是所有产品的首次上市时间。仅有年份或月份时不补造日期。</span></div>`:'')+(page==='design'?'<div class="catalog-notice"><b>按发表或案例发布年份排序</b><span>选择方向查看原始研究、设计参考与证据边界。</span></div>':'')+(items.length?(isProd?`<div class="grid">${items.map(productCard).join('')}</div>`:`<div class="list">${items.map(listCard).join('')}</div>`):`<div class="empty"><b>没有匹配的搜索结果</b><p>请尝试其他产品、厂商或关键词。</p><button class="primary" data-reset>重置筛选</button></div>`);$('#results').querySelector('[data-reset]')?.addEventListener('click', reset);$('#overview-extra').innerHTML=isProd?`<p class="coverage-note">${esc(data.catalogNote)} 图片未核实的档案保留文字卡片，不使用其他型号图片代替。</p>`:'';
}

  $('#search').oninput = render;
  $('#sort').onchange = render;
  return {render, reset, isSaved: () => onlySaved, showSaved() {
    reset();
    onlySaved = true;
    render();
  }};
}
function productCard(x){const clinical=x.feedback?.some(f=>f.angle.includes('临床研究'));const safety=x.feedback?.some(f=>f.tone==='安全信息');return `<article class="card"><div class="card-media ${x.id==='dv5'?'photo':''}" onclick="openItem('${x.id}')"><span class="pill">${esc(x.dept)} · ${esc(x.sub.join(' / '))}</span><button class="bookmark ${saved.includes(x.id)?'on':''}" aria-label="${saved.includes(x.id)?'取消收藏':'收藏'} ${esc(x.name)}" onclick="event.stopPropagation();toggleSave('${x.id}')">${saved.includes(x.id)?'★':'☆'}</button>${x.images.length?`<img loading="lazy" src="${esc(coverImage(x))}" alt="${esc(x.name)} 产品图片" onerror="retryCover(this,'${x.id}')">`:`<div class="placeholder"><small>${esc(x.country)} / ${esc(x.kind)}</small><b>${esc(x.name)}</b><small>官方产品图片待核实</small></div>`}</div><div class="card-body"><div class="brandline">${esc(x.brand)}<span>${esc(x.status)}</span></div><h3><button onclick="openItem('${x.id}')">${esc(x.name)}</button></h3><p>${esc(x.principle||x.desc)}</p><div class="pain-preview"><b>解决什么</b> ${esc(x.pain)}</div><div class="tags"><span>${esc(x.country)}</span><span>${esc(x.kind)}</span>${clinical?'<span>有临床研究</span>':''}${safety?'<span class="safety-tag">含监管安全信息</span>':''}</div><div class="card-bottom"><span>${esc(x.date.replaceAll('-','.'))}<br><small>${esc(x.event)}</small></span><button onclick="openItem('${x.id}')">原理与反馈 ↗</button></div></div></article>`}
function listCard(x){return `<article class="list-item" tabindex="0" onclick="openItem('${x.id}')" onkeydown="if(event.key==='Enter')openItem('${x.id}')"><time>${esc(x.date)}</time><div><span class="pill ${x.status==='研究中'?'research':''}">${esc(x.status)}</span> <small>${esc(x.tag)}</small><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p></div><button aria-label="查看详情">↗</button></article>`}
function coverImage(product) {
  return product.cover || product.images.find(url => !url.startsWith('https://')) || product.images[0];
}
function retryCover(img, id) {
  const product = data.products.find(item => item.id === id);
  const images = [coverImage(product), ...product.images.filter(url => url !== coverImage(product))];
  const next = Number(img.dataset.attempt || 0) + 1;
  if (images[next]) {
    img.dataset.attempt = next;
    img.src = images[next];
  } else {
    img.replaceWith(fallback(id));
  }
}
function fallback(id){const d=document.createElement('div');d.className='placeholder';d.innerHTML=`<b>${esc(data.products.find(x=>x.id===id)?.name||'产品图片')}</b><small>图片未能加载 · 请查看官方来源</small>`;return d}
function toggleSave(id){saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];try{localStorage.setItem('surgscope-saved',JSON.stringify(saved))}catch{}modules.products.render();toast('收藏已更新 · 保存在当前浏览器')}
function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2300)}
function renderDesignAnalysis(item) {
  const analysis = item.analysis;
  if (!analysis) return '';
  const chart = item.chart;
  const figure = chart ? `<figure class="design-chart"><figcaption>${esc(chart.title)}</figcaption>${chart.bars.map(([label, value]) => `<div class="design-bar"><span>${esc(label)}</span><meter min="0" max="3" value="${Number(value)}" aria-label="${esc(label)}"></meter><b>${Number(value).toFixed(2)}</b></div>`).join('')}<small>根据原文数据绘制</small></figure>` : '';
  const photos = (item.figures || []).map(({url, caption, source}) => `<figure><img loading="lazy" src="${esc(url)}" alt="${esc(caption)}" onerror="this.hidden=true"><figcaption>${esc(caption)} <a href="${esc(source)}" target="_blank" rel="noopener">查看图源 ↗</a></figcaption></figure>`).join('');
  return `<section class="design-analysis"><h3>设计亮点与解决的问题</h3><p>${esc(analysis.highlight)}</p>${photos ? `<div class="design-figures">${photos}</div>` : ''}<h3>研究发现与适用范围</h3><p>${esc(analysis.evidence)}</p>${figure}<h3>如何用于产品设计</h3><p>${esc(analysis.application)}</p></section>`;
}
function openItem(id){let x=[...data.products,...data.tech,...data.pain,...(data.design||[])].find(x=>x.id===id);if(!x)return;const prod=!!x.kind;const design=id.startsWith('design-');$('#detail').innerHTML=`<div class="eyebrow">${esc(x.brand||x.tag)}</div><h2>${esc(x.name||x.title)}</h2><span class="pill ${x.status==='研究中'?'research':''}">${esc(x.status)}</span>${prod?` <span class="pill">${esc(x.country)} · ${esc(x.kind)}</span>`:''}${x.images?.length?`<div class="gallery">${x.images.map((im,i)=>`<figure><img src="${esc(im)}" alt="${esc(x.name)} 产品图片 ${i+1}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><p hidden class="coverage-note">图片暂时无法加载，可通过下方图源查看。</p><figcaption>${x.imageCaptions?.[i] ? `${esc(x.imageCaptions[i])} · ` : ''}${i+1} / ${x.images.length} · ${x.imageSources?.[i]?`<a href="${esc(x.imageSources[i])}" target="_blank" rel="noopener">图片来源 ↗</a>`:`图片 © ${esc(x.brand)}`}</figcaption></figure>`).join('')}</div>`:prod?'<p class="coverage-note">官方图片待核实，暂以可追溯文字资料呈现。</p>':''}<div class="facts"><span>${x.event?'时间节点':'资料日期'}<b>${esc(x.date)}</b></span><span>${x.event?'事件性质':'证据状态'}<b>${esc(x.event||x.status)}</b></span><span>核验日期<b>${data.updated}</b></span></div>${prod?`<h3>01 · 主要原理</h3><p>${esc(x.principle)}</p><h3>02 · 解决的痛点</h3><p>${esc(x.pain)}</p><h3>03 · 多方反馈与证据</h3><p class="coverage-note">区分真实研究、厂商表述和编辑分析，不以推测填充好评或差评。</p><div class="feedback-list">${x.feedback.map(f=>`<article class="feedback-item"><div><b>${esc(f.angle)}</b><span class="pill ${f.tone==='安全信息'?'warning-pill':''}">${esc(f.tone)}</span></div><p>${esc(f.text)}</p>${f.url?`<a href="${esc(f.url)}" target="_blank" rel="noopener">原始证据 ↗</a>`:'<small>未作为已验证的产品评价</small>'}</article>`).join('')}</div>`:`<p>${esc(x.desc)}</p>`}${design&&x.analysis?renderDesignAnalysis(x):`<h3>${prod?'04 · 时间与适用范围':'解读与边界'}</h3><p>${esc(x.detail)}</p>`}<a href="${esc(x.source)}" target="_blank" rel="noopener">${design?'查看原始资料':'产品 / 事件原始来源'} ↗</a>${prod?'<p class="coverage-note">历史召回仅适用于公告所列部件和版本。上市、扩展适应证和研究节点分开解读。</p>':''}`;$('#modal').showModal()}
$('#modal .close').onclick=()=>$('#modal').close();$('#modal').onclick=e=>{if(e.target===$('#modal'))$('#modal').close()};$('#saved').onclick=()=>{if(!modules.products)return;modules.products.showSaved();document.getElementById('products').scrollIntoView({behavior:'instant'})};
function methodology(){$('#detail').innerHTML=`<div class="eyebrow">EDITORIAL PRINCIPLES</div><h2>资料可查，结论有边界。</h2><h3>覆盖范围</h3><p>${esc(data.catalogNote)}</p><h3>按事件时间排序</h3><p>每条明确是首次上市、地区获批、版本发布或研究进展。同一年和月的记录不虚构具体日期。研究中与历史停产平台明确标识。</p><h3>只保留有产品的分类</h3><p>科室及子方向由产品档案生成；跨科室产品在有来源支持时出现在多个分类中。产品类型及地区切换后，自动隐藏空分类。</p><h3>反馈分层</h3><p>临床研究、医生个体使用报告、厂商主张、监管安全信息分别标注。编辑提出的医院实施问题不会冒充医生差评。没有独立研究、患者反馈或成本数据时明确标为待补充。</p><h3>每周更新</h3><p>自动写入与定时更新尚未启用。当前页面为人工核验后发布的资料快照。</p>`;$('#modal').showModal()}$('#method').onclick=methodology;$('#method2').onclick=methodology;
$('#weekly').onclick=()=>{$('#detail').innerHTML=`<div class="eyebrow">CATALOG UPDATE · ${data.updated}</div><h2>本期产品库扩充</h2><div class="facts"><span>产品 / 代际 / 应用<b>${data.products.length} 条</b></span><span>科室分类<b>${uniq(data.products.flatMap(departments)).length} 个</b></span><span>中国及合资条目<b>${data.products.filter(isChina).length} 条</b></span></div><p>覆盖史赛克、强生、Intuitive、美敦力、捷迈邦美、施乐辉，以及微创、天智航、精锋、康多、术锐、威高等国内外厂商。</p><p>${esc(data.catalogNote)}</p><p>不是本周新品清单。每周自动更新尚未启用。</p>`;$('#modal').showModal()};document.addEventListener('keydown', e => {
  if (e.key !== '/' || document.activeElement.matches('input,textarea,[contenteditable]') || $('#modal').open) return;
  const sections = [...document.querySelectorAll('.content-module')];
  const section = sections.findLast(el => el.getBoundingClientRect().top <= 140) || sections[0];
  e.preventDefault();
  section.querySelector('input').focus();
});
const moduleKeys = ['products', 'tech', 'pain', 'design'];
fetch('data.json', { cache: 'no-cache' }).then(response => {
  if (!response.ok) throw new Error('Data request failed');
  return response.json();
}).then(dataset => {
  data = dataset;
  for (const key of moduleKeys) {
    modules[key] = createModule(key);
    modules[key].render();
  }
}).catch(() => {
  for (const key of moduleKeys) $(`#${key}-results`).textContent = '资料加载失败，请刷新重试。';
});
