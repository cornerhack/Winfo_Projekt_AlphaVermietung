document.addEventListener('DOMContentLoaded', function() {
    const loginToggle = document.getElementById('login-toggle');
    const registerToggle = document.getElementById('register-toggle');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const testButton = document.getElementById('test');

    testButton.addEventListener('click', function() {
        test();
    });
    
    loginToggle.addEventListener('click', function() {
        loginToggle.classList.add('active');
        registerToggle.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });
    
    registerToggle.addEventListener('click', function() {
        registerToggle.classList.add('active');
        loginToggle.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });
    
    // Form submission (simulated)
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        login(
            this.querySelector('input[id="emailLogin"]').value,
            this.querySelector('input[id="passwordLogin"]').value
        );
    });
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = this.querySelector('input[id="firstPassword"]').value;
        const secondPassword = this.querySelector('input[id="secondPassword"]').value;
        const errorMessage = document.getElementById('password-error');

        if (password !== secondPassword) {
            errorMessage.textContent = 'Die Passwörter stimmen nicht überein!';
            return;
        }
        register(
            this.querySelector('input[id="companyName"]').value,
            this.querySelector('input[id="vorname"]').value,
            this.querySelector('input[id="nachname"]').value,
            this.querySelector('input[id="emailRegister"]').value,
            password
        );
    });

    document.getElementById('firstPassword').addEventListener('input', function(e) {
        const password = e.target.value;
        const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}/;
        const isValid = regex.test(password);
        const errorMessage = document.getElementById('password-error');

        if (!isValid)
            errorMessage.textContent = "Passwort muss mindestens 8 Zeichen lang sein, Groß- und Kleinbuchstaben sowie Sonderzeichen enthalten.";
        else
            errorMessage.textContent = "";
      });

      document.getElementById('secondPassword').addEventListener('input', function(e) {
        const password = e.target.value;
        const firstPassword = document.getElementById('firstPassword').value;
        const errorMessage = document.getElementById('password-error');

        if (password !== firstPassword)
            errorMessage.textContent = "Die Passwörter stimmen nicht überein!";
        else
            errorMessage.textContent = "";
      });

    document.getElementById('isCompany').addEventListener('change', function () {
        const companyField = document.getElementById('companyNameContainer');
        companyField.classList.toggle('hidden', !this.checked);
    });

    async function login(email, password) {
        try {
            const response = await fetch('/login/login', { 
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok)
                alert(data.message);
            else
                alert(data.error);
            
        } catch (error) {
            alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        }
    }

    async function register(companyName, vorname, nachname, email, password) {
        try {
            const response = await fetch('/login/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ companyName, vorname, nachname, email, password })
            });
            const data = await response.json();
            if (response.ok)
                alert(data.message);
            else
                alert(data.error);

        } catch (error) {
            alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        }
    }
});