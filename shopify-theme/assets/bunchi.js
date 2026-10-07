(()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=false;try{paused=sessionStorage.getItem('bunchi-motion')==='off'}catch{}
function setMotion(){document.documentElement.classList.toggle('b-motion-off',paused);document.querySelectorAll('[data-b-motion]').forEach(b=>{b.setAttribute('aria-pressed',String(paused));b.textContent=paused?b.dataset.resume:b.dataset.pause})}setMotion();
document.addEventListener('click',e=>{const b=e.target.closest('[data-b-motion]');if(b){paused=!paused;try{sessionStorage.setItem('bunchi-motion',paused?'off':'on')}catch{}setMotion()}});
let messages={};try{messages=JSON.parse(document.getElementById('bunchi-messages')?.textContent||'{}')}catch{}
async function syncCart(){if(!messages.cart)return;const r=await fetch(messages.cart,{credentials:'same-origin'});if(!r.ok)return;const cart=await r.json();document.querySelectorAll('[data-b-count]').forEach(n=>n.textContent=cart.item_count)}
document.addEventListener('submit',async e=>{const form=e.target.closest('.b-add-form');if(!form||!messages.cartAdd)return;e.preventDefault();const button=form.querySelector('button[type=submit]'),status=form.querySelector('[role=status]');if(button.disabled)return;button.disabled=true;button.setAttribute('aria-busy','true');status.textContent='';try{const response=await fetch(messages.cartAdd,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'},credentials:'same-origin'});const data=await response.json();if(!response.ok)throw new Error(data.description||messages.error);status.textContent=messages.added;try{await syncCart()}catch{}if(!reduced.matches&&!paused)button.animate([{transform:'scale(.975)'},{transform:'scale(1)'}],{duration:240})}catch(error){status.textContent=error.message||messages.error}finally{button.disabled=false;button.removeAttribute('aria-busy')}});
addEventListener('pageshow',e=>{if(e.persisted)syncCart().catch(()=>{})});
import('https://cdn.shopify.com/storefront/standard-events.js').then(({StandardEvents})=>{document.addEventListener(StandardEvents.cartLinesUpdate,()=>syncCart().catch(()=>{}));}).catch(()=>{});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.b-menu[open]').forEach(m=>{m.open=false;m.querySelector('summary').focus()})});
document.addEventListener('click',e=>document.querySelectorAll('.b-menu[open]').forEach(m=>{if(!m.contains(e.target))m.open=false}));
})();

document.addEventListener('change',event=>{const select=event.target.closest('.b-add-form select[name="id"]');if(!select)return;const price=select.closest('.b-card')?.querySelector('[data-b-card-price]');if(price)price.textContent=select.selectedOptions[0]?.dataset.formattedPrice||'';select.closest('.b-card')?.querySelectorAll('a[href*="/products/"]').forEach(link=>{const url=new URL(link.href);url.searchParams.set('variant',select.value);link.href=url.href});});

(()=>{const panels=[...document.querySelectorAll('[data-retail-panel]')];panels.forEach(panel=>panel.addEventListener('toggle',()=>{if(panel.open){panels.forEach(other=>{if(other!==panel)other.open=false});panel.querySelector('input[type="search"]')?.focus()}}));document.addEventListener('keydown',event=>{if(event.key==='Escape')panels.filter(p=>p.open).forEach(p=>{p.open=false;p.querySelector('summary').focus()})});document.addEventListener('click',event=>panels.forEach(p=>{if(p.open&&!p.contains(event.target))p.open=false}));document.addEventListener('focusin',event=>panels.forEach(p=>{if(p.open&&!p.contains(event.target))p.open=false}));})();

(()=>{const field=document.getElementById('ContactBody');if(!field||field.value)return;const product=new URLSearchParams(location.search).get('product');if(product)field.value=product.slice(0,300)+'\n\n';})();
