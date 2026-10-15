const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const WHATSAPP_NUMBER = '5547996004771';

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name.value.trim();
  const interest = form.elements.interest.value;
  const message = form.elements.message.value.trim();

  let text = `Olá! Meu nome é ${name}.`;
  text += `\nInteresse: ${interest}`;
  if (message) {
    text += `\nMensagem: ${message}`;
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank');
  form.reset();
  return false;
}

document.querySelectorAll('[data-interest]').forEach(link => link.addEventListener('click', () => {
  const select = document.querySelector('.contact-form select[name="interest"]');
  if (select) select.value = link.dataset.interest;
}));

const galleryTrack = document.querySelector('.gallery-track');
if (galleryTrack) {
  document.querySelectorAll('.gallery-arrow').forEach(btn => btn.addEventListener('click', () => {
    const dir = parseInt(btn.dataset.dir, 10);
    galleryTrack.scrollBy({ left: dir * 320, behavior: 'smooth' });
  }));
  galleryTrack.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      galleryTrack.scrollLeft += event.deltaY;
    }
  }, { passive: false });
}

const revealItems = document.querySelectorAll('.experience-card, .frozen-visual, .frozen-copy, .process-copy, .chef-copy, .chef-portrait, .contact-form');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach(item => observer.observe(item));
