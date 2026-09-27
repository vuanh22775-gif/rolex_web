const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const status = document.querySelector('.form-status');

        confirmPassword.setCustomValidity('');
        if (password.value === confirmPassword.value) return;

        event.preventDefault();
        confirmPassword.setCustomValidity('Mật khẩu xác nhận không khớp.');
        confirmPassword.reportValidity();
        if (status) {
            status.className = 'form-status error';
            status.textContent = 'Mật khẩu xác nhận không khớp.';
        }
    });
}