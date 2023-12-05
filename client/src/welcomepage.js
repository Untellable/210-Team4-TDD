const hoverLink = document.querySelector('.hover-link');
const hoverImage = document.querySelector('.hover-image');

hoverLink.addEventListener('mouseover', () => {
    hoverImage.classList.add('visible'); // Add the 'visible' class for image transition animation
});

hoverLink.addEventListener('mouseout', () => {
    hoverImage.classList.remove('visible');
});