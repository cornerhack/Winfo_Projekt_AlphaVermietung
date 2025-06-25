export async function checkLoginStatus() {
  const res = await fetch('/auth/me');
  const data = await res.json();

  const loginBtn = document.querySelector('.login-button');
  const header = document.querySelector('header');

  if (data.loggedIn) {
    const userDiv = document.createElement('div');
    userDiv.className = 'user-info';
    userDiv.innerHTML = `
      👋 Hallo, ${data.user.name}
      <button class="logout-button" id="logout-button">Logout</button>
    `;

    loginBtn?.remove();
    header.prepend(userDiv);

    document.getElementById('logout-button').addEventListener('click', async () => {
      await fetch('/login/logout', { method: 'POST' });
      location.reload();
    });
  }
}

document.addEventListener('DOMContentLoaded', checkLoginStatus);
