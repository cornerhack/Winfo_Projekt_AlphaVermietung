document.addEventListener('headerLoaded', () => {
    const loginBtn = document.getElementById('open-popup');
    if (loginBtn) loginBtn.remove();
});

// Formular-Submit-Handler
document.getElementById('reset-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('reset-email').value;
    const feedback = document.getElementById('feedback');
    feedback.textContent = 'Sende E-Mail...';

    try {
        const res = await fetch('/mailer/newPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (res.ok) {
            feedback.style.color = 'green';
            feedback.textContent = 'E-Mail wurde versendet.';
        } else {
            feedback.style.color = 'red';
            feedback.textContent = data.error || 'Ein Fehler ist aufgetreten.';
        }
    } catch (err) {
        feedback.style.color = 'red';
        feedback.textContent = 'Verbindungsfehler beim Senden der E-Mail.';
    }
});