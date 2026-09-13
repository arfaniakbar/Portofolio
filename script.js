const body=document.body;
const loader=document.querySelector('.loader');
const nav=document.querySelector('.nav');
const menu=document.querySelector('.menu');
const theme=document.querySelector('.theme');

window.addEventListener('load',()=>setTimeout(()=>loader.classList.add('hide'),450));

menu?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

theme?.addEventListener('click',()=>{
  body.classList.toggle('dark');
  localStorage.setItem('portfolio-theme',body.classList.contains('dark')?'dark':'light');
});
if(localStorage.getItem('portfolio-theme')==='dark') body.classList.add('dark');

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const tabs=document.querySelectorAll('.tab');
tabs.forEach(tab=>{
  tab.addEventListener('click',()=>{
    tabs.forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');
    document.querySelectorAll('.panel.active .reveal').forEach(el=>{
      el.classList.remove('visible');
      requestAnimationFrame(()=>el.classList.add('visible'));
    });
  });
});

const sections=[...document.querySelectorAll('main section[id]')];
const links=[...document.querySelectorAll('.nav nav a')];
const activeObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));
    }
  });
},{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s=>activeObserver.observe(s));



// Image slots: change only the data-* filename in index.html.
document.querySelectorAll('[data-project-image]').forEach(slot=>{
  const src=slot.dataset.projectImage;
  if(!src) return;
  const img=document.createElement('img');
  img.className='project-photo';
  img.src=src;
  img.alt=slot.dataset.projectAlt || 'Project image';
  img.loading='lazy';
  img.onerror=()=>{ img.remove(); slot.classList.add('image-missing'); };
  slot.appendChild(img);
});

document.querySelectorAll('.paper[data-cert-image]').forEach(paper=>{
  const src=paper.dataset.certImage;
  if(!src) return;
  const img=document.createElement('img');
  img.className='certificate-photo';
  img.src=src;
  img.alt=paper.dataset.certTitle || 'Certificate';
  img.loading='lazy';
  img.onerror=()=>{ img.remove(); paper.classList.add('image-missing'); };
  paper.appendChild(img);
});

const certModal=document.querySelector('.cert-modal');
const certModalTitle=document.querySelector('#cert-modal-title');
const certModalCard=document.querySelector('.cert-modal-card');
const certClose=document.querySelector('.cert-close');

function openCertificate(card){
  const paper=card.querySelector('.paper');
  const title=paper?.dataset.certTitle || 'Certificate';
  const image=paper?.dataset.certImage;
  certModalTitle.textContent=title.toUpperCase();
  const old=certModalCard.querySelector('.placeholder-large, img');
  if(old) old.remove();
  if(image){
    const img=document.createElement('img');
    img.src=image;
    img.alt=title;
    certModalCard.appendChild(img);
  }else{
    const ph=document.createElement('div');
    ph.className='placeholder-large';
    ph.innerHTML='<div><b>AK</b><span>'+title.toUpperCase()+'</span><span style="margin-top:14px">Tambahkan path gambar sertifikat pada data-cert-image</span></div>';
    certModalCard.appendChild(ph);
  }
  certModal.classList.add('open');
  certModal.setAttribute('aria-hidden','false');
  body.classList.add('modal-open');
}
document.querySelectorAll('.certificate').forEach(card=>{
  card.addEventListener('click',()=>openCertificate(card));
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openCertificate(card)}});
});
function closeCertificate(){
  certModal?.classList.remove('open');
  certModal?.setAttribute('aria-hidden','true');
  body.classList.remove('modal-open');
}
certClose?.addEventListener('click',closeCertificate);
certModal?.addEventListener('click',e=>{if(e.target===certModal)closeCertificate()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&certModal?.classList.contains('open'))closeCertificate()});
