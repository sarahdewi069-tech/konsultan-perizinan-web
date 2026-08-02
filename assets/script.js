document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('nav.links');
  menuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
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
