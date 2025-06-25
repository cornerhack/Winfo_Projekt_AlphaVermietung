import { checkLoginStatus } from './auth.js';

fetch('/html/popup.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('popup-placeholder').innerHTML = html;
    document.addEventListener('headerLoaded', () => {
      initPopupEvents();
    })
});

function closeLoginPopup() {
    document.getElementById('popup').style.display = 'none';
}

function initPopupEvents() {
  const closePopup = document.getElementById('close-popup');
  const openPopup = document.getElementById('open-popup');

  if (openPopup) {
    openPopup.addEventListener('click', () => {
      document.getElementById('popup').style.display = 'flex';
    });
  }

  closePopup.addEventListener('click', () => {
    closeLoginPopup();
  });

  // Form-Umschaltung
  const loginToggle = document.getElementById('login-toggle');
  const registerToggle = document.getElementById('register-toggle');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const companyCheckbox = document.getElementById('isCompany');

  loginToggle.addEventListener('click', () => {
    loginToggle.classList.add('active');
    registerToggle.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  });

  registerToggle.addEventListener('click', () => {
    registerToggle.classList.add('active');
    loginToggle.classList.remove('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  });

  companyCheckbox.addEventListener('change', () => {
    
  })

  // Registrierung
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('firstPassword').value;
    const confirm = document.getElementById('secondPassword').value;

    if (password !== confirm) {
      alert('Passwörter stimmen nicht überein');
      return;
    }

    try {
      const res = await fetch('/login/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: document.getElementById('usernameR').value,
          email: document.getElementById('emailR').value,
          password
        })
      });

      if (!res.ok) throw new Error('Registrierung fehlgeschlagen');
      closeLoginPopup();
      await checkLoginStatus();

    } catch (err) {
      console.error(err);
      alert('Fehler bei der Registrierung');
    }
  });

  // Login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('emailL').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    const res = await fetch('/login/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.success) {
      closeLoginPopup();
      await checkLoginStatus();
    } else {
      alert(data.error || 'Login fehlgeschlagen');
    }
  });
}
