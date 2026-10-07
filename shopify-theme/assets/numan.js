(()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function setup(scope=document){
 scope.querySelectorAll('[data-n-day]').forEach(button=>{if(button.dataset.nReady)return;button.dataset.nReady='true';button.addEventListener('click',()=>{const group=button.closest('[role=group]');group.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));group.closest('.n-routine').querySelectorAll('[data-n-step-link]').forEach(link=>{const url=new URL(link.href);url.searchParams.set('routine',button.dataset.nDay);link.href=url.href;link.classList.toggle('n-daytime-only',button.dataset.nDay==='Evening'&&link.dataset.nStepLink==='protect')})})});
 scope.querySelectorAll('[data-n-shelf]').forEach(shelf=>{
  if(shelf.dataset.nReady)return;shelf.dataset.nReady='true';
  const checks=[...shelf.querySelectorAll('[data-n-compare]')],bar=shelf.querySelector('[data-n-compare-bar]'),dialog=shelf.querySelector('[data-n-compare-dialog]');if(!dialog)return;
  const open=shelf.querySelector('[data-n-compare-open]'),status=shelf.querySelector('[data-n-compare-status]');
  const chosen=()=>checks.filter(c=>c.checked);
  const update=()=>{const count=chosen().length;bar.hidden=count===0;open.disabled=count<2;shelf.querySelector('[data-n-compare-count]').textContent=count};
  checks.forEach(check=>check.addEventListener('change',()=>{status.textContent='';if(chosen().length>3){check.checked=false;status.textContent=status.dataset.limitMessage}update()}));
  shelf.querySelector('[data-n-compare-clear]').addEventListener('click',()=>{checks.forEach(c=>c.checked=false);status.textContent='';update();checks[0]?.focus()});
  open.addEventListener('click',()=>{const ids=new Set(chosen().map(c=>c.value));dialog.querySelectorAll('[data-n-compare-item]').forEach(item=>item.hidden=!ids.has(item.dataset.nCompareItem));dialog.showModal()});
  shelf.querySelector('[data-n-compare-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close()});
  update();
 });
 if(!('IntersectionObserver' in window))return;
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;if(!reduced.matches&&!document.documentElement.classList.contains('b-motion-off'))entry.target.animate([{opacity:.7,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,easing:'cubic-bezier(.2,.7,.2,1)'});observer.unobserve(entry.target)}),{threshold:.12});
 scope.querySelectorAll('.b-card,.n-routine-intro,.n-quiz-preview,.n-quiz-copy,.n-rose-edit-copy').forEach(e=>observer.observe(e));
}
setup();document.addEventListener('shopify:section:load',event=>setup(event.target));
document.addEventListener('click',event=>{if(event.target.closest('[data-b-motion]')&&document.documentElement.classList.contains('b-motion-off'))document.getAnimations().forEach(a=>a.cancel())});
})();
