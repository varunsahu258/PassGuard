document.getElementById('passwordInput').addEventListener('input', function () {
  const password = this.value;
  const score = evaluatePassword(password);
  updateUI(score);
  updateChecklist(password);
  document.getElementById('crackTime').innerText = `Estimated crack time: ${estimateCrackTime(password)}`;
});


document.getElementById("togglePassword").addEventListener("click", function () {
  const passwordInput = document.getElementById("passwordInput");
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  this.textContent = isPassword ? "🙈" : "👁️"; // Swap emoji
});

function evaluatePassword(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function updateUI(score) {
  const bar = document.getElementById('strengthBar');
  bar.className = '';
  if (score <= 2) bar.classList.add('weak');
  else if (score <= 4) bar.classList.add('medium');
  else bar.classList.add('strong');
}

function updateChecklist(password) {
  const checklist = [
    { check: password.length >= 12, message: "Use at least 12 characters." },
    { check: /[A-Z]/.test(password), message: "Add uppercase letters." },
    { check: /[a-z]/.test(password), message: "Add lowercase letters." },
    { check: /[0-9]/.test(password), message: "Include numbers." },
    { check: /[^A-Za-z0-9]/.test(password), message: "Use special characters." },
  ];

  const list = document.getElementById('feedbackList');
  list.innerHTML = checklist.map(item => {
    const icon = item.check ? '✅' : '❌';
    return `<li>${icon} ${item.message}</li>`;
  }).join('');
}

function estimateCrackTime(password) {
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32;

  const guesses = Math.pow(charsetSize, password.length);
  const guessesPerSecond = 1e9;
  const seconds = guesses / guessesPerSecond;

  return formatTime(seconds);
}

function formatTime(seconds) {
  const units = ['seconds', 'minutes', 'hours', 'days', 'years', 'centuries'];
  const values = [60, 60, 24, 365, 100];
  let i = 0;
  while (i < values.length && seconds >= values[i]) {
    seconds /= values[i];
    i++;
  }
  return `${seconds.toFixed(2)} ${units[i]}`;
}

function generatePassword() {
  const length = parseInt(document.getElementById('lengthSelect').value);
  const includeUpper = document.getElementById('includeUpper').checked;
  const includeLower = document.getElementById('includeLower').checked;
  const includeNumbers = document.getElementById('includeNumbers').checked;
  const includeSymbols = document.getElementById('includeSymbols').checked;

  let chars = '';
  if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeLower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (includeNumbers) chars += '0123456789';
  if (includeSymbols) chars += '!@#$%^&*()_+-={}[]<>?';

  if (chars.length === 0) {
    alert("Please select at least one character type.");
    return;
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  document.getElementById('generatedPassword').value = password;
}

function copyPassword() {
  const passInput = document.getElementById('generatedPassword');
  navigator.clipboard.writeText(passInput.value).then(() => {
    alert("Password copied to clipboard!");
  });
}
