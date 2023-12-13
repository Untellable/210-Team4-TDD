

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

        isEmpty = emptyInputHandler(username, serverDomain);

        console.log('Got Input After Submit Button is Clicked, username: ', username, 'serverDomain: ', serverDomain);      
        
        if (!isEmpty) {
            validateInput(username, serverDomain);
        }
        
        // reactivate the submit button
        submitBtn.disabled = false;

    });
});


document.getElementById('no-btn').addEventListener('click', () => {
    const formContainer = document.querySelector('.form-container');
    const accountContainer = document.querySelector('.account-container');
    const errorContainer = document.querySelector('.error-message');
    const inputUsername = document.getElementById('input-username');
    const inputServerDomain = document.getElementById('input-serverdomain');
    
    formContainer.style.display = 'block';
    accountContainer.style.display = 'none';
    errorContainer.style.display = 'none';
    inputUsername.value = '';
    inputServerDomain.value = '';
});




// TODO: implement save logic and open new page
document.getElementById('yes-btn').addEventListener('click', () => {

    console.log('Yes button clicked');

});
