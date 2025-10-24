document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeBtn = document.getElementById('theme-btn');

  // Default to dark mode
  body.classList.remove('light-mode');
  body.classList.add('dark-mode');

  // Check if user previously chose a theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.classList.toggle('light-mode', savedTheme === 'light');
    body.classList.toggle('dark-mode', savedTheme === 'dark');
  }

  // Toggle theme
  themeBtn.addEventListener('click', () => {
    const isDark = body.classList.contains('dark-mode');
    body.classList.toggle('dark-mode', !isDark);
    body.classList.toggle('light-mode', isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });

  // Simple login simulation with basic malicious input detection
  const form = document.getElementById('login-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = form.username.value.trim();
    const password = form.password.value.trim();
    const msg = document.getElementById('message');

    // Basic malicious input detection (XSS, SQLi, or script injection)
    const maliciousPattern = /<|>|script|onerror|onload|alert|['";=]|--|\/\*|\*\/|drop\s+table|select\s+|insert\s+|update\s+|delete\s+/i;

    if (maliciousPattern.test(username) || maliciousPattern.test(password)) {
      msg.textContent = '⚠️ Suspicious input detected. Please enter valid credentials.';
      msg.style.color = '#f39c12';
      return; // stop further processing
    }

    // Simulated authentication
    if (username === 'admin' && password === 'password') {
      msg.textContent = '✅ Login successful!';
      msg.style.color = '#2ea043';
    } else {
      msg.textContent = '❌ Invalid credentials';
      msg.style.color = '#f85149';
    }
  });
});
