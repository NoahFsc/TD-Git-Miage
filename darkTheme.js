document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('theme-toggle');
  const body = document.body;
  // Récupère le thème sauvegardé
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    body.classList.add('dark-mode');
    btn.textContent = '☀️';
  }
  btn.addEventListener('click', function () {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    btn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
});