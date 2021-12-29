const buyBtns = document.querySelectorAll('.js-buy-ticket');
const closeBtn = document.querySelector('.js-modal-close');
const modal = document.querySelector('.js-modal')
const modalContainer = document.querySelector('.js-modal-container')

function showModal() {
    modal.classList.add('open')
}

function closeModal() {
    modal.classList.remove('open');
}

// Show modal
buyBtns.forEach((buyBtn) => {
    buyBtn.onclick = () => {
        showModal();
    }
})

// Close modal
closeBtn.onclick = () => {
    closeModal();
}

// Click out of the modal to close
modal.onclick = (e) => {
    closeModal();
}
    // Stop propagation from close modal event
modalContainer.onclick = (e) => {
    e.stopPropagation();
}