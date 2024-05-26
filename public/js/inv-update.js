const form = document.querySelector('#updateForm')
form_1.addEventListener('change', function() {
    const updateBtn = document.querySelector('button')
    updateBtn.removeAttribute('disabled')
})