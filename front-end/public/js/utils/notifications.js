// public/js/utils/notifications.js

export function showNotification(message, type, callback = null) {
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.innerText = message;

    const modalTitle = document.getElementById('notificationModalLabel');
    if (type === 'success') {
        modalTitle.classList.add('text-success');
        modalTitle.classList.remove('text-danger');
    } else {
        modalTitle.classList.add('text-danger');
        modalTitle.classList.remove('text-success');
    }

    const notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));
    notificationModal.show();

    if (callback) {
        const modalElement = document.getElementById('notificationModal');
        modalElement.addEventListener('hidden.bs.modal', function () {
            callback();
        });
    }
}
