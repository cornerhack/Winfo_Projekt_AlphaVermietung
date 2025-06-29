document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch('/auth/me');
    const data = await res.json();

    if(!data.loggedIn || data.user.person !== "mitarbeiter")
        window.location.href = "/html/startseite.html"
})