export async function checkLoginStatus() {
  const res = await fetch('/auth/me');
  const data = await res.json();

  const loginBtn = document.querySelector('.login-btn');
  const header = document.querySelector('header');

  if (data.loggedIn) {
    const userDiv = document.createElement('div');
    const person = data.user.person;
    userDiv.dataset.id = data.user.id;
    userDiv.className = 'user-info';
    userDiv.innerHTML = `
      <div class="user-toggle">👋 Hallo, ${data.user.name} ▾</div>
      <div class="dropdown-menu hidden">
        ${person === "kunde" ? `<a href="/html/reservierungen.html" class="dropdown-link">Reservierungen anzeigen</a>` 
        : `<a href="/html/mitarbeiterStartseite.html" class="dropdown-link">Startseite</a>`}
        <button id="logout-button" class="dropdown-link logout">Logout</button>
      </div>
    `;

    loginBtn?.remove();
    header.append(userDiv);
    const toggle = userDiv.querySelector('.user-toggle');
    const menu = userDiv.querySelector('.dropdown-menu');

    toggle.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });

    document.getElementById('logout-button').addEventListener('click', async () => {
      await fetch('/login/logout', { method: 'POST' });
      location.reload();
    });

    document.addEventListener('click', (e) => {
      if (!userDiv.contains(e.target)) {
        menu.classList.add('hidden');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', checkLoginStatus);
