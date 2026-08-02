document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('nav.links');
  menuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  const contactForm = document.querySelector('.contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = (id) => (document.getElementById(id)?.value || '').trim();
    const nama = val('nama');
    const perusahaan = val('perusahaan');
    const email = val('email');
    const telepon = val('telepon');
    const layanan = document.getElementById('layanan')?.value || '';
    const pesan = val('pesan');

    let lines = [`Halo AD SNI Consultant, saya ${nama}${perusahaan ? ' dari ' + perusahaan : ''}.`];
    lines.push(`Saya ingin konsultasi mengenai layanan: ${layanan}.`);
    if (pesan) lines.push(`Detail kebutuhan: ${pesan}`);
    lines.push(`Email: ${email}`);
    lines.push(`No. WhatsApp: ${telepon}`);

    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/6281119469678?text=${text}`, '_blank');
  });

  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q?.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';
      document.querySelectorAll('.faq-item').forEach(i => {
        i.setAttribute('data-open','false');
        i.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){
        item.setAttribute('data-open','true');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
});
