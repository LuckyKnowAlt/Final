document.addEventListener('DOMContentLoaded', function () {
    const flashMessages = document.querySelectorAll('.alert');
    flashMessages.forEach(function (message) {
        setTimeout(function () {
            message.style.display = 'none';
        }, 5000);
    });
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(function (carousel) {
        $(carousel).carousel({
            interval: 3000
        });
    });
    const createForm = document.querySelector('form[action="/portfolio/create"]');
    if (createForm) {
        createForm.addEventListener('submit', function (event) {
            const imageInputs = document.querySelector('input[type="file"]');
            if (imageInputs && imageInputs.files.length !== 3) {
                event.preventDefault();
                alert('3 images.');
            }
        });
    }
    const deleteButtons = document.querySelectorAll('form[action^="/portfolio/delete"] button');
    deleteButtons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            if (!confirm('Confirm?')) {
                event.preventDefault();
            }
        });
    });
});
