document.addEventListener('DOMContentLoaded', (event) => {
    const expandableContainers = document.querySelectorAll('.expandable-container');

    expandableContainers.forEach(container => {
        const expandableTrigger = container.querySelector('.expandable-trigger');
        const expandableContent = container.querySelector('.expandable-content');
        
        expandableTrigger.addEventListener('click', () => {
            // Toggle the content visibility
            const isVisible = expandableContent.style.display === "block";
            expandableContent.style.display = isVisible ? "none" : "block";

            // Toggle the arrow direction
            expandableTrigger.classList.toggle('active', !isVisible);

            // Toggle the background color of the expandable container and trigger
            container.style.backgroundColor = isVisible ? 'transparent' : 'rgb(19, 20, 25)';
            expandableTrigger.style.backgroundColor = isVisible ? 'transparent' : 'rgb(19, 20, 25)';
        });
    });
});