/*global document,sessionStorage*/

const baseURL = 'http://localhost:10000';

/**
 * function shows the error message box
 */
export function showError() {
    const errorContainer = document.querySelector('.error-message');
    errorContainer.style.display = 'flex';
}
/**
 * function hides the error message box
 */
export function hideError() {
    const errorContainer = document.querySelector('.error-message');
    errorContainer.style.display = 'none';
}

/**
 * function shows the main input form on welcome page
 */
export function showForm() {
    const formContainer = document.querySelector('.form-container');
    formContainer.style.display = 'block';
}

/**
 * function hides the main input form on welcome page
 */
export function hideForm() {
    const formContainer = document.querySelector('.form-container');
    formContainer.style.display = 'none';
}

/**
 * function shows the account search result
 */
export function showAccount() {
    const accountContainer = document.querySelector('.account-container');
    accountContainer.style.display = 'block';
}

/**
 * function hides the account search result
 */
export function hideAccount() {
    const accountContainer = document.querySelector('.account-container');
    accountContainer.style.display = 'none';
}

/**
 * function clears the input in username and server domain input boxes
 */
export function clearInput() {
    const inputUsername = document.getElementById('input-username');
    const inputServerDomain = document.getElementById('input-serverdomain');
    inputUsername.value = '';
    inputServerDomain.value = '';
}

/**
 * function recovers the error message back to the default: invalid instead of empty
 */
export function recoverErrorMessage() {
    const inputErrorMessage = document.querySelector('#input-error-message');
    inputErrorMessage.textContent = 'Invalid username or server domain.';
}

/**
 * function that determines whether the input is empty, show empty input error message if any of the input is empty
 * @param {*} username the username of the user's Mastodon account
 * @param {*} serverDomain the server domain of the user's Mastodon account
 * @returns true if any of the input is empty, and false otherwise
 */
export function emptyInputHandler(username, serverDomain) {
    const inputErrorMessage = document.querySelector('#input-error-message');
    if (username === '' || serverDomain === '') {
        inputErrorMessage.textContent = 'Empty username or server domain.';
        showError();
        return true;
    }
    return false;
}

/**
 * function gets the input from the 2 input boxes
 * @returns the username input and the server doamin input
 */
export function getInput() {
    let username = document.getElementById('input-username').value;
    let serverDomain = document.getElementById('input-serverdomain').value;
    return [username, serverDomain];
}

/**
 * function concatenates the username and the serverdomain with @ for valid account format
 * @param {*} username the username of the user's Mastodon's account
 * @param {*} serverDomain the server domain of the user's Mastodon's account
 * @returns the concatenated account
 */
export function combineInput(username, serverDomain) {
    return '@' + username + '@' + serverDomain;
}

/**
 * function parses useful info/data from json file, and show error if json has error
 * @param {*} json the json file as the response from the api
 * @returns an array of userid, user display name, user avatar url, and user number of followers
 */
export function processResponse(json) {
    if ('error' in json) {
        showError();
        clearInput();
        return;
    } else {
        hideError();
        let id = json.id;
        let displayName = json.display_name;
        let profImgUrl = json.avatar;
        let numFollowers = json.followers_count;
        return [id, displayName, profImgUrl, numFollowers];
    }
}

/**
 * function that saves the id to sessionStorage
 * @param {*} id the user id that is in number form
 */
export function saveId(id) {
    sessionStorage.setItem('account_id', id);
}

/**
 * function that updates the corresponding html element in the account search result view
 */
export function updateFromResponse(
    combinedInputData,
    id,
    displayName,
    profImgUrl,
    numFollowers
) {
    saveId(id);

    let displayNameElement = document.getElementById('display-name');
    displayNameElement.textContent = displayName;

    let displayAccountElement = document.getElementById('display-account');
    displayAccountElement.textContent = combinedInputData;

    let followersCountElement = document.getElementById('followers-count');
    followersCountElement.textContent = numFollowers;

    let avatarElement = document.getElementById('avatar');
    avatarElement.src = profImgUrl;
}

/**
 * function that calls the lookup api and get json response and process that json data,
 * making changes on the display correspondingly
 * @param {*} username the username of the user's Mastodon account
 * @param {*} serverDomain the server domain of the user's Mastodon account
 */
export function validateInput(username, serverDomain) {
    let combinedInputData = combineInput(username, serverDomain);

    let apiURL = `${baseURL}/api/v1/account/lookup?acct=${combinedInputData}`;
    console.log('apiURL: ', apiURL);

    fetch(apiURL)
        .then((response) => response.json())
        .then((json) => {
            console.log('json:', json);

            let [id, displayName, profImgUrl, numFollowers] =
                processResponse(json);

            console.log(
                'user_acct, id, display_name, profile_img_url, num_followers: ',
                combinedInputData,
                id,
                displayName,
                profImgUrl,
                numFollowers
            );

            // show the username if the user has never set the display name
            if (displayName === '') {
                displayName = username;
            }

            // update the account info using parsed data from api fetching
            updateFromResponse(
                combinedInputData,
                id,
                displayName,
                profImgUrl,
                numFollowers
            );

            // switch to welcome/input page display
            hideForm();
            showAccount();
        })
        .catch((error) => {
            console.log('Error Caught in api fetch', error);

            // switch to account info display
            showForm();
            hideAccount();
        });
}
