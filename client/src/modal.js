/*global document,window*/

var modal = document.getElementById('importModal');

// Get the button that opens the modal
var modalOpenButton = document.getElementById('importExportButton');

// Get the <span> element that closes the modal
var modalSpan = document.getElementsByClassName('close')[0];

// When the user clicks on the button, open the modal
modalOpenButton.onclick = function () {
    modal.style.display = 'block';
};

// When the user clicks on <span> (x), close the modal
modalSpan.onclick = function () {
    modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

export function hideModal() {
    modal.style.display = 'none';
};
