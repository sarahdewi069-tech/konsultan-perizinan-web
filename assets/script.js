document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  // Scroll-reveal animation for the redesigned sections
  const revealSelectors = '.service-card, .why-item, .process-step, .faq-item, .credential-card, .mock-card, .blog-card, .stat-strip, .reg-row, .cta-band .wrap';
  const revealTargets = document.querySelectorAll(revealSelectors);
  if ('IntersectionObserver' in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = ((idx % 6) * 60) + 'ms';
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in'));
  }

  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('nav.links');
  menuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Document checklist per service + file upload UI
  const DOC_CHECKLIST = {
    id: {
      sni: ["Spesifikasi teknis produk", "NIB dan NPWP perusahaan", "Hasil uji produk sebelumnya (jika ada)"],
      "import-license": ["NIB dan akta perusahaan", "NPWP perusahaan", "Data produk yang akan diimpor"],
      tkdn: ["Data proses produksi / struktur biaya", "NIB perusahaan"],
      bpom: ["Formulasi & bahan baku produk", "Desain label kemasan", "NIB dan NPWP perusahaan"],
      npb: ["Spesifikasi teknis produk", "NIB perusahaan"],
      "rkp-rpl": ["Data kegiatan usaha", "Izin lokasi (jika ada)"],
      lainnya: ["NIB dan akta perusahaan", "NPWP perusahaan", "Dokumen pendukung sesuai kebutuhan"],
    },
    en: {
      sni: ["Product technical specification", "Business ID (NIB) and Tax ID (NPWP)", "Previous test results (if any)"],
      "import-license": ["NIB and deed of establishment", "Company Tax ID (NPWP)", "Data on goods to be imported"],
      tkdn: ["Production process / cost structure data", "Company NIB"],
      bpom: ["Product formulation & raw materials", "Packaging label design", "NIB and NPWP"],
      npb: ["Product technical specification", "Company NIB"],
      "rkp-rpl": ["Business activity data", "Location permit (if any)"],
      lainnya: ["NIB and deed of establishment", "Company NPWP", "Supporting documents as needed"],
    },
    zh: {
      sni: ["产品技术规格", "营业执照编号(NIB)及税号(NPWP)", "既往检测结果（如有）"],
      "import-license": ["NIB及公司设立契约", "公司税号(NPWP)", "拟进口产品数据"],
      tkdn: ["生产流程/成本结构数据", "公司NIB"],
      bpom: ["产品配方与原材料", "包装标签设计", "NIB及NPWP"],
      npb: ["产品技术规格", "公司NIB"],
      "rkp-rpl": ["经营活动数据", "选址许可（如有）"],
      lainnya: ["NIB及公司设立契约", "公司NPWP", "其他所需支持文件"],
    },
  };
  const DOC_CHECKLIST_TITLE = {
    id: "Dokumen yang umumnya dibutuhkan untuk kategori ini",
    en: "Documents generally needed for this category",
    zh: "此类别通常所需的文件",
  };

  const layananSelect = document.getElementById('layanan');
  const docChecklistList = document.getElementById('docChecklistList');
  const pageLang = document.documentElement.lang || 'id';

  function updateChecklist() {
    if (!layananSelect || !docChecklistList) return;
    const key = layananSelect.value;
    const list = (DOC_CHECKLIST[pageLang] && DOC_CHECKLIST[pageLang][key]) || [];
    docChecklistList.innerHTML = list.map(item => `<li>${item}</li>`).join('');
    const titleEl = document.querySelector('#docChecklist h4');
    if (titleEl) titleEl.textContent = DOC_CHECKLIST_TITLE[pageLang] || DOC_CHECKLIST_TITLE.id;
  }
  layananSelect?.addEventListener('change', updateChecklist);
  updateChecklist();

  // File upload UI (client-side selection; names are included in the WhatsApp message)
  const fileInput = document.getElementById('dokumen');
  const uploadDrop = document.querySelector('.upload-drop');
  const fileListEl = document.getElementById('uploadFileList');
  let selectedFiles = [];

  function renderFileList() {
    if (!fileListEl) return;
    fileListEl.innerHTML = selectedFiles.map((f, i) =>
      `<div class="upload-file-chip"><span>${f.name}</span><span class="rm" data-idx="${i}">&#10005;</span></div>`
    ).join('');
    fileListEl.querySelectorAll('.rm').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedFiles.splice(Number(btn.dataset.idx), 1);
        renderFileList();
      });
    });
  }

  fileInput?.addEventListener('change', () => {
    selectedFiles = selectedFiles.concat(Array.from(fileInput.files || []));
    fileInput.value = '';
    renderFileList();
  });

  if (uploadDrop) {
    ['dragover'].forEach(evt => uploadDrop.addEventListener(evt, (e) => { e.preventDefault(); uploadDrop.classList.add('dragover'); }));
    ['dragleave','drop'].forEach(evt => uploadDrop.addEventListener(evt, (e) => { e.preventDefault(); uploadDrop.classList.remove('dragover'); }));
    uploadDrop.addEventListener('drop', (e) => {
      const dropped = Array.from(e.dataTransfer?.files || []);
      selectedFiles = selectedFiles.concat(dropped);
      renderFileList();
    });
  }

  const contactForm = document.querySelector('.contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = (id) => (document.getElementById(id)?.value || '').trim();
    const nama = val('nama');
    const perusahaan = val('perusahaan');
    const email = val('email');
    const telepon = val('telepon');
    const layananEl = document.getElementById('layanan');
    const layanan = layananEl?.options[layananEl.selectedIndex]?.text || '';
    const pesan = val('pesan');
    const lang = document.documentElement.lang || 'id';

    let lines;
    const fileNames = selectedFiles.map(f => f.name).join(', ');
    if (lang === 'en') {
      lines = [`Hello AD SNI Consultant, I am ${nama}${perusahaan ? ' from ' + perusahaan : ''}.`];
      lines.push(`I would like to consult regarding: ${layanan}.`);
      if (pesan) lines.push(`Details: ${pesan}`);
      if (fileNames) lines.push(`Documents I will attach: ${fileNames}`);
      lines.push(`Email: ${email}`);
      lines.push(`WhatsApp: ${telepon}`);
    } else if (lang === 'zh') {
      lines = [`您好 AD SNI Consultant，我是 ${nama}${perusahaan ? '，来自 ' + perusahaan : ''}。`];
      lines.push(`我想咨询关于：${layanan}。`);
      if (pesan) lines.push(`需求详情：${pesan}`);
      if (fileNames) lines.push(`我将附上文件：${fileNames}`);
      lines.push(`邮箱：${email}`);
      lines.push(`联系电话：${telepon}`);
    } else {
      lines = [`Halo AD SNI Consultant, saya ${nama}${perusahaan ? ' dari ' + perusahaan : ''}.`];
      lines.push(`Saya ingin konsultasi mengenai layanan: ${layanan}.`);
      if (pesan) lines.push(`Detail kebutuhan: ${pesan}`);
      if (fileNames) lines.push(`Dokumen yang akan saya lampirkan: ${fileNames}`);
      lines.push(`Email: ${email}`);
      lines.push(`No. WhatsApp: ${telepon}`);
    }

    if (lang === 'zh') {
      const subject = encodeURIComponent('网站咨询 - AD SNI Consultant');
      const body = encodeURIComponent(lines.join('\n'));
      window.location.href = `mailto:ademasnun70@gmail.com?subject=${subject}&body=${body}`;
    } else {
      const text = encodeURIComponent(lines.join('\n'));
      window.open(`https://wa.me/6281119469678?text=${text}`, '_blank');
    }
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
