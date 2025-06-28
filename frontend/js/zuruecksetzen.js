document.addEventListener('headerLoaded', () => {
    const loginBtn = document.getElementById('open-popup');
    if (loginBtn) loginBtn.remove();
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('set-password-form');
    const firstPassword = document.getElementById('firstPassword');
    const secondPassword = document.getElementById('secondPassword');
    const feedback = document.getElementById('feedback');

    // Email aus der URL lesen
    const email = decodeURIComponent(new URLSearchParams(window.location.search).get('email'));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        feedback.textContent = '';

        if (!email) {
            feedback.textContent = 'Fehlende E-Mail-Adresse!';
            return;
        }

        if (firstPassword.value !== secondPassword.value) {
            feedback.textContent = 'Passwörter stimmen nicht überein.';
            return;
        }

        try {
            const res = await fetch('/login/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password: firstPassword.value
                })
            });

            const result = await res.json();
            feedback.textContent = result.message || result.error;

            if (res.ok) {
                feedback.style.color = 'green';
                setTimeout(() => {
                    window.location.href = '/html/startseite.html';
                }, 2000);
            } else {
                feedback.style.color = 'red';
            }
        } catch (err) {
            feedback.textContent = 'Fehler beim Zurücksetzen.';
            feedback.style.color = 'red';
        }
    });
});
