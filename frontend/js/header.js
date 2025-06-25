document.addEventListener('DOMContentLoaded', function() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  fetch('/html/header.html')
      .then(response => response.text())
      .then(data => {
        headerPlaceholder.innerHTML = data;
        document.dispatchEvent(new Event('headerLoaded'));
      });
});