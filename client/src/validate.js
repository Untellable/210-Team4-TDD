/*global document,sessionStorage*/
const baseURL = 'http://localhost:10000';

export function showError() {
    const errorContainer = document.querySelector('.error-message');
    errorContainer.style.display = 'flex';
}

export function hideError() {
    const errorContainer = document.querySelector('.error-message');
    errorContainer.style.display = 'none';
}

export function showForm() {
    const formContainer = document.querySelector('.form-container');
    formContainer.style.display = 'block';
}

export function hideForm() {
    const formContainer = document.querySelector('.form-container');
    formContainer.style.display = 'none';
}

export function showAccount() {
    const accountContainer = document.querySelector('.account-container');
    accountContainer.style.display = 'block';
}

export function hideAccount() {
    const accountContainer = document.querySelector('.account-container');
    accountContainer.style.display = 'none';
}

export function clearInput() {
    const inputUsername = document.getElementById('input-username');
    const inputServerDomain = document.getElementById('input-serverdomain');
    inputUsername.value = '';
    inputServerDomain.value = '';
}

export function recoverErrorMessage() {
    const inputErrorMessage = document.querySelector('#input-error-message');
    inputErrorMessage.textContent = 'Invalid username or server domain.';
}

export function emptyInputHandler(username, serverDomain) {
    const inputErrorMessage = document.querySelector('#input-error-message');
    if (username === '' || serverDomain === '') {
        inputErrorMessage.textContent = 'Empty username or server domain.';
        showError();
        return true;
    }
    return false;
}

export function getInput() {
    let username = document.getElementById('input-username').value;
    let serverDomain = document.getElementById('input-serverdomain').value;
    return [username, serverDomain];
}

export function combineInput(username, serverDomain) {
    return '@' + username + '@' + serverDomain;
}

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

export function saveId(id) {
    sessionStorage.setItem('account_id', id);
}

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
