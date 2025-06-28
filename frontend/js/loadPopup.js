import { checkLoginStatus } from './auth.js';

fetch('/html/popup.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('popup-placeholder').innerHTML = html;
    document.addEventListener('headerLoaded', () => {
      initPopupEvents();
    })
});

let versuche = 0;

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
  const companyText = document.getElementById('companyNameContainer');

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
    if (companyCheckbox.checked) {
      companyText.classList.add('active');
      companyText.classList.remove('hidden');
    }else{
      companyText.classList.add('hidden');
      companyText.classList.remove('active');
    }
  })

  // Registrierung
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const companyName = companyText.value;
    const vorname = document.getElementById('vorname').value;
    const nachname = document.getElementById('nachname').value;
    const email = document.getElementById('emailR').value;
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
          companyName,
          vorname,
          nachname,
          email,
          password
        })
      });

      if (!res.ok) throw new Error('Registrierung fehlgeschlagen');
      closeLoginPopup();
      await checkLoginStatus();
      location.reload();
    } catch (err) {
      alert('Fehler bei der Registrierung');
    }
  });

  // Login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = document.getElementById('login-form').querySelector('button[type="submit"]');
    const email = document.getElementById('emailL').value;
    const password = loginForm.querySelector('input[type="password"]').value;
    const gesperrt = await fetch(`/login/istGesperrt?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    });
    const istGesperrt = await gesperrt.json();
    if(istGesperrt === 0){
      const res = await fetch('/login/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email: email, password: password })
      });
      const data = await res.json();
      if (res.ok) {
        versuche = 0;
        closeLoginPopup();
        await checkLoginStatus();
        if(data.person === "kunde")
          location.reload();
        else
          window.location.href = "/html/mitarbeiterStartseite.html";
      } else {
        versuche += 1;
        if(versuche === 3){
          button.disabled = true;
          alert('Zu viele Fehlversuche! Bitte ändern sie ihr Passwort über "passwort vergessen?".');
          await fetch('/login/sperren',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: email})
          });
          return;
        }
        alert(data.error || data.message || 'Email oder Passwort ist falsch!');
      }
    }else if(istGesperrt === 1) {
      button.disabled = true;
      alert('Ihr Account wurde gesperrt! Bitte ändern sie ihr Passwort über "passwort vergessen?".');
    }else{
      alert(istGesperrt.error || istGesperrt.message || 'Email oder Passwort ist falsch!');
    }
  });
}
