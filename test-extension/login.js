document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeBtn = document.getElementById('theme-btn');
  const form = document.getElementById('login-form');
  const msgEl = document.getElementById('message');

  if (!form || !msgEl) return console.error('❌ Missing form or message element in DOM.');

  // ---------- Theme handling ----------
  body.classList.remove('light-mode');
  body.classList.add('dark-mode');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.classList.toggle('light-mode', savedTheme === 'light');
    body.classList.toggle('dark-mode', savedTheme === 'dark');
  }
  themeBtn?.addEventListener('click', () => {
    const isDark = body.classList.contains('dark-mode');
    body.classList.toggle('dark-mode', !isDark);
    body.classList.toggle('light-mode', isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });

  // ---------- Elements ----------
  const passwordInput = form.querySelector('input[name="password"]');
  const usernameInput = form.querySelector('input[name="username"]');

  // Add a live password strength indicator
  let pwStrengthEl = document.getElementById('password-strength');
  if (!pwStrengthEl && passwordInput) {
    pwStrengthEl = document.createElement('div');
    pwStrengthEl.id = 'password-strength';
    pwStrengthEl.style.marginTop = '6px';
    pwStrengthEl.style.fontSize = '0.9em';
    pwStrengthEl.style.lineHeight = '1.2';
    passwordInput.parentNode.insertBefore(pwStrengthEl, passwordInput.nextSibling);
  }

  // ---------- Helper functions ----------
  const maliciousPattern = /<|>|script\b|onerror\b|onload\b|alert\b|['";=]|--|\/\*|\*\/|\b(drop|select|insert|update|delete)\b/i;

  function showMessage(text, color = '#000') {
    msgEl.textContent = text;
    msgEl.style.color = color;
  }

  function setPasswordStrengthDisplay({ label = '', color = '#000', hints = [] } = {}) {
    if (!pwStrengthEl) return;
    let text = label ? `Password: ${label}` : '';
    if (hints && hints.length) text += ` — ${hints.slice(0, 2).join(' • ')}`;
    pwStrengthEl.textContent = text;
    pwStrengthEl.style.color = color;
  }

  function isPasswordMalicious(pw = '') {
    if (!pw) return false;
    const lower = pw.toLowerCase();
    const jsKeywords = [
      'eval(', 'document.cookie', 'document.write', 'innerhtml', 'window.location',
      'settimeout(', 'fetch(', '<script', 'onerror', 'onload'
    ];
    const sqlShell = [
      'select ', 'union ', 'insert ', 'update ', 'delete ', 'drop ', 'truncate ',
      'exec ', 'bash -c', 'wget ', 'curl ', 'rm -rf'
    ];
    if (jsKeywords.some(k => lower.includes(k))) return true;
    if (sqlShell.some(k => lower.includes(k))) return true;
    if (/%[0-9a-f]{2,}/i.test(pw) && pw.length > 20) return true;
    if (/^[A-Za-z0-9+/=]{40,}$/.test(pw)) return true;
    if (/\\x[0-9a-f]{2}/i.test(pw) || /\\u[0-9a-f]{4}/i.test(pw)) return true;
    if (pw.length > 300) return true;
    if (/(.)\1{20,}/.test(pw)) return true;
    if (maliciousPattern.test(pw)) return true;
    return false;
  }

  function evaluatePassword(password) {
    const feedback = [];
    if (!password) return { isWeak: true, feedback, label: 'Empty' };

    const common = ['123456', 'password', 'qwerty', 'abc123', 'admin', 'letmein'];
    const lower = password.toLowerCase();
    if (common.includes(lower) || /^123456+$/.test(password)) {
      feedback.push('Common password');
      return { isWeak: true, feedback, label: 'Very weak' };
    }

    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>[\]\/\\\-_=+`~;:]/.test(password)) score += 1;

    if (/(.)\1\1/.test(password)) feedback.push('Avoid repeated characters');
    if (/(0123|1234|2345|3456|abcd|qwer|asdf)/i.test(password)) feedback.push('Avoid sequences');

    let label = 'Weak';
    if (score >= 5) label = 'Strong';
    else if (score >= 3) label = 'Medium';

    const isWeak = score < 3 || password.length < 8;
    return { isWeak, feedback, label };
  }

  // ---------- Live password strength detection ----------
  passwordInput?.addEventListener('input', (e) => {
    const pw = e.target.value || '';
    if (!pw) {
      setPasswordStrengthDisplay({ label: 'Empty', color: '#666' });
      return;
    }

    if (isPasswordMalicious(pw)) {
      setPasswordStrengthDisplay({ label: 'Suspicious', color: '#f39c12', hints: ['Possible script or payload'] });
      return;
    }

    const result = evaluatePassword(pw);
    const color = result.label === 'Strong' ? '#2ea043' : result.label === 'Medium' ? '#f0ad4e' : '#e67e22';
    setPasswordStrengthDisplay({ label: result.label, color, hints: result.feedback });
  });

  // ---------- Form submit handler ----------
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = usernameInput?.value?.trim() || '';
    const password = passwordInput?.value || '';

    // Empty password or username → Invalid credentials
    if (!username || !password) {
      showMessage('❌ Invalid credentials', '#f85149');
      return;
    }

    // Malicious input detection
    if (maliciousPattern.test(username) || maliciousPattern.test(password) || isPasswordMalicious(password)) {
      showMessage('⚠️ Suspicious input detected. Please enter valid credentials.', '#f39c12');
      return;
    }

    // Simulated login authentication
    const validUser = username === 'admin' && password === 'Adm1n@123?';

    if (validUser) {
      showMessage('✅ Login successful!', '#2ea043');
    } else {
      // Enforced: Always "Invalid credentials" for wrong login attempts
      showMessage('❌ Invalid credentials', '#f85149');
    }
  });
});
