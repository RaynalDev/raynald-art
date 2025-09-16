

  // Sélection
const thumbs = Array.from(document.querySelectorAll<HTMLButtonElement>('.thumb'));

// Révèle instantanément ce qui est déjà visible au premier rendu (évite l’escalier)
function revealInitial(){
  const vh = window.innerHeight;
  thumbs.forEach(t=>{
    const r = t.getBoundingClientRect();
    if(r.top < vh && r.bottom > 0) t.classList.add('in');
  });
}
revealInitial();
window.addEventListener('load', revealInitial);
window.addEventListener('resize', revealInitial);

// Observer “nerveux” (seuil très bas)
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting) (e.target as HTMLElement).classList.add('in'); });
},{
  rootMargin: '64px 0px',   // pré-révèle un peu avant d’entrer
  threshold: 0.01
});
thumbs.forEach(t=> io.observe(t));

  // Lightbox
  const images = thumbs
    .map((t) => t.querySelector('img'))
    .filter(Boolean); // Array<HTMLImageElement>

   const dialog = document.querySelector<HTMLDialogElement>('#lightbox')!;
  const lbImg  = dialog.querySelector<HTMLImageElement>('#lb-img')!;
  const lbCap  = dialog.querySelector<HTMLParagraphElement>('#lb-cap')!;
  const btnPrev = dialog.querySelector<HTMLButtonElement>('.prev')!;
  const btnNext = dialog.querySelector<HTMLButtonElement>('.next')!;
  const btnClose = dialog.querySelector<HTMLButtonElement>('.close')!;

  let i = 0;
  function show(idx: number) {
    i = (idx + images.length) % images.length;
    const im = images[i];
    lbImg.src = im?.src || '';
    lbImg.alt = im?.alt || "";
    lbCap.textContent = im?.alt || "";
  }

  function openAt(idx: number) {
    show(idx);
    if (dialog.showModal) dialog.showModal();
    else dialog.setAttribute('open','');
    document.documentElement.style.overflow = 'hidden';
  }

  function closeLb() {
    if (dialog.close) dialog.close();
    else dialog.removeAttribute('open');
    document.documentElement.style.overflow = '';
  }

  thumbs.forEach((t, idx) => t.addEventListener('click', () => openAt(idx)));
  btnPrev.addEventListener('click', (e) => { e.stopPropagation(); show(i - 1); });
btnNext.addEventListener('click', (e) => { e.stopPropagation(); show(i + 1); });
btnClose.addEventListener('click', (e) => { e.stopPropagation(); closeLb(); });


  // fermer si clic hors de l’image
  dialog.addEventListener('click', (e) => {
    const stage = dialog.querySelector('.stage');
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const inside =
      e.clientX >= r.left && e.clientX <= r.right &&
      e.clientY >= r.top  && e.clientY <= r.bottom;
    if (!inside) closeLb();
  });

  // clavier
  window.addEventListener('keydown', (e) => {
    if (!dialog.open) return;
    if (e.key === 'Escape')     closeLb();
    if (e.key === 'ArrowLeft')  show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
