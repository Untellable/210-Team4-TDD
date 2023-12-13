document.addEventListener('DOMContentLoaded', (event) => {
    const expandableContainers = document.querySelectorAll('.expandable-container');

    expandableContainers.forEach(container => {
        const expandableTrigger = container.querySelector('.expandable-trigger');
        const expandableContent = container.querySelector('.expandable-content');
        
        expandableTrigger.addEventListener('click', () => {
            // Toggle the content visibility
            const isVisible = expandableContent.style.display === "block";
            expandableContent.style.display = isVisible ? "none" : "block";
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-btn');

    submitBtn.addEventListener('click', (event) => {
        // disable the submit button prevent multiple submission when waiting for response
        submitBtn.disabled = true;
        
        // recover the error message to default: invalid
        recoverErrorMessage();

        [username, serverDomain] = getInput();

        // show error msg directly without api fetching
        isEmpty = emptyInputHandler(username, serverDomain);

        console.log('Got Input After Submit Button is Clicked, username: ', username, 'serverDomain: ', serverDomain);      
        
        // only do api fetching for non-empty input
        if (!isEmpty) {
            validateInput(username, serverDomain);
        }
        
        // reactivate the submit button
        submitBtn.disabled = false;
    });
});


document.getElementById('no-btn').addEventListener('click', () => {
    clearInput();
    showForm();
    hideAccount();
    hideError();
});


// TODO: implement save logic and open new page
document.getElementById('yes-btn').addEventListener('click', () => {

    console.log('Yes button clicked');

    window.location.href = 'visjs.html';
});
