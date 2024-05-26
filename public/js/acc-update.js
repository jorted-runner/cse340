const form_1 = document.querySelector('#updateAccountInfo');
form_1.addEventListener('change', function() {
    const updateBtn = form_1.querySelector('button[type="submit"]');
    updateBtn.removeAttribute('disabled');
});

const passwordInput = document.getElementById('password');
passwordInput.addEventListener('input', function() {
    if (passwordInput.value.length >= 12) {
        const updateBtn = document.querySelector('#passwordBtn');
        updateBtn.removeAttribute('disabled');
    }
});

document.getElementById('togglePassword').addEventListener('click', function (e) {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '🙈';
});