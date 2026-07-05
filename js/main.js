(function () {
  'use strict';

  /* Scroll reveal */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('in');
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(function (el) {
      io.observe(el);
    });
  }

  /* Application form */
  var form = document.getElementById('apply-form');
  var success = document.getElementById('form-success');
  var resetBtn = document.getElementById('form-reset');

  if (!form) return;

  var LEVEL_LABELS = {
    novice: 'Никогда не погружался(-ась)',
    amateur: 'Пробовал(а), хочет увереннее',
    group: 'Группа / семья / компания друзей',
    other: 'Другое',
  };

  function clearErrors() {
    form.querySelectorAll('.field-error').forEach(function (el) {
      el.classList.remove('field-error');
    });
  }

  function markInvalid(el) {
    if (el) el.classList.add('field-error');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    var email = form.email.value.trim();
    var level = form.level.value;
    var message = form.message.value.trim();
    var consent = form.consent.checked;
    var valid = true;

    if (!name) { markInvalid(form.name); valid = false; }
    if (!phone || phone.replace(/\D/g, '').length < 10) { markInvalid(form.phone); valid = false; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { markInvalid(form.email); valid = false; }
    if (!level) { markInvalid(form.level); valid = false; }
    if (!consent) { valid = false; }

    if (!valid) return;

    var body = [
      'Заявка на водолазную программу — Кроличья Нора',
      '',
      'Имя: ' + name,
      'Телефон: ' + phone,
      email ? 'Email: ' + email : '',
      'Уровень: ' + (LEVEL_LABELS[level] || level),
      message ? 'Комментарий: ' + message : '',
      '',
      'Отправлено с временного landing «Кроличья Нора»',
    ]
      .filter(Boolean)
      .join('\n');

    /* Static fallback: mailto to the address configured in index.html (data-contact="email"). */
    var emailLink = document.querySelector('[data-contact="email"]');
    var targetEmail = emailLink ? emailLink.getAttribute('href').replace(/^mailto:/, '') : 'CONTACT_EMAIL';
    var mailto =
      'mailto:' + targetEmail +
      '?subject=' +
      encodeURIComponent('Заявка: водолазная программа — ' + name) +
      '&body=' +
      encodeURIComponent(body);

    try {
      window.location.href = mailto;
    } catch (_) {
      /* ignore */
    }

    var applyHead = document.querySelector('#apply .lp-head');
    var applyAside = document.querySelector('.apply-aside');
    var applyGrid = document.querySelector('.apply-grid');

    form.hidden = true;
    if (applyHead) applyHead.hidden = true;
    if (applyAside) applyAside.hidden = true;
    if (applyGrid) applyGrid.style.display = 'none';
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      form.reset();
      form.hidden = false;
      clearErrors();
      var applyHead = document.querySelector('#apply .lp-head');
      var applyAside = document.querySelector('.apply-aside');
      var applyGrid = document.querySelector('.apply-grid');
      if (applyHead) applyHead.hidden = false;
      if (applyAside) applyAside.hidden = false;
      if (applyGrid) applyGrid.style.display = '';
      success.hidden = true;
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
})();
