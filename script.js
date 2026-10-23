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

// Conversões do Google Ads. Quando as ações de conversão forem criadas no
// Google Ads, colar aqui o rótulo de cada uma (a parte depois da barra em
// "AW-18531132535/rótulo"). Enquanto estiver vazio, o evento é enviado mesmo
// assim e pode ser usado como conversão pelo GA4.
const GOOGLE_ADS_ID = 'AW-18531132535';
const CONVERSOES = {
  orcamento_evento: '',
  pedido_congelados: ''
};

function registrarConversao(nomeEvento, interesse) {
  if (typeof gtag !== 'function') return;
  gtag('event', nomeEvento, { interesse });
  const rotulo = CONVERSOES[nomeEvento];
  if (rotulo) {
    gtag('event', 'conversion', { send_to: `${GOOGLE_ADS_ID}/${rotulo}` });
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name.value.trim();
  const interest = form.elements.interest.value;
  const message = form.elements.message.value.trim();

  if (interest === 'Experiência para evento') {
    registrarConversao('orcamento_evento', interest);
  } else if (interest === 'Congelados') {
    registrarConversao('pedido_congelados', interest);
  }

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

// Sitelink "Encomendar congelados" do Google Ads: #contato?c=congelados
// já abre o formulário com "Congelados" selecionado.
function aplicarInteresseDaUrl() {
  const hash = window.location.hash;
  if (!hash.startsWith('#contato')) return;
  const params = new URLSearchParams(hash.split('?')[1] || '');
  const select = document.querySelector('.contact-form select[name="interest"]');
  if (select && params.get('c') === 'congelados') select.value = 'Congelados';
  if (select && params.get('c') === 'evento') select.value = 'Experiência para evento';
  const contato = document.getElementById('contato');
  if (contato && hash !== '#contato') contato.scrollIntoView();
}
aplicarInteresseDaUrl();
window.addEventListener('hashchange', aplicarInteresseDaUrl);

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

// Vídeo da seção "O impasto": só baixa quando a pessoa chega perto da seção,
// para não pesar o carregamento da página no celular.
const lazyVideo = document.querySelector('video[data-src]');
if (lazyVideo) {
  const carregarVideo = () => {
    if (lazyVideo.src) return;
    lazyVideo.src = lazyVideo.dataset.src;
    lazyVideo.play().catch(() => {});
  };
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        carregarVideo();
        videoObserver.disconnect();
      }
    }, { rootMargin: '300px 0px' });
    videoObserver.observe(lazyVideo);
  } else {
    carregarVideo();
  }
}
