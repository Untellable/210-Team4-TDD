/*global document,window*/

let modal = document.getElementById('instructionsModal');

// Get the button that opens the modal
let modalOpenButton = document.getElementById('instructionsButton');

// Get the <span> element that closes the modal
let modalSpan = document.getElementsByClassName('close')[1];

// When the user clicks on the button, open the modal
modalOpenButton.onclick = showModal;

// When the user clicks on <span> (x), close the modal
modalSpan.onclick = function () {
    modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

export function hideModal() {
    modal.style.display = 'none';
}

export function showModal() {
    modal.style.display = 'block';
}
