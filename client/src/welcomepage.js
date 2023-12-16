/*global document,window*/
import {
    hideError,
    showForm,
    hideAccount,
    clearInput,
    recoverErrorMessage,
    emptyInputHandler,
    getInput,
    validateInput,
} from './validate.js';

/**
 * Add listener for expandable container, show the expandable content when clicked, and hide it when clicked again
 */
document.addEventListener('DOMContentLoaded', (event) => {
    const expandableContainers = document.querySelectorAll(
        '.expandable-container'
    );

    expandableContainers.forEach((container) => {
        const expandableTrigger = container.querySelector(
            '.expandable-trigger'
        );
        const expandableContent = container.querySelector(
            '.expandable-content'
        );

        expandableTrigger.addEventListener('click', () => {
            // Toggle the content visibility
            const isVisible = expandableContent.style.display === 'block';
            expandableContent.style.display = isVisible ? 'none' : 'block';
        });
    });
});

/**
 * Add listener to the submit button, disable it and reactivate it until reponse received
 * to prevent multiple submission, handle empty input, and call validateInput for updates
 */
document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-btn');

    submitBtn.addEventListener('click', (event) => {
        // disable the submit button prevent multiple submission when waiting for response
        submitBtn.disabled = true;

        // recover the error message to default: invalid
        recoverErrorMessage();

        let [username, serverDomain] = getInput();

        // show error msg directly without api fetching
        let isEmpty = emptyInputHandler(username, serverDomain);

        console.log(
            'Got Input After Submit Button is Clicked, username: ',
            username,
            'serverDomain: ',
            serverDomain
        );

        // only do api fetching for non-empty input
        if (!isEmpty) {
            validateInput(username, serverDomain);
        }

        // reactivate the submit button
        submitBtn.disabled = false;
    });
});

/**
 * Add listener to no button, go back to the input form
 */
document.getElementById('no-btn').addEventListener('click', () => {
    clearInput();
    showForm();
    hideAccount();
    hideError();
});

/**
 * Add listener to yes button, go the the visualization page
 */
document.getElementById('yes-btn').addEventListener('click', () => {
    console.log('Yes button clicked');

    window.location.href = 'visjs.html';
});
