const baseURL = 'http://localhost:10000';

function showError() {
    const errorContainer = document.querySelector('.error-message');
    errorContainer.style.display = 'flex';
}

function hideError() {
    const errorContainer = document.querySelector('.error-message');
    errorContainer.style.display = 'none';
}

function showForm() {
    const formContainer = document.querySelector('.form-container');
    formContainer.style.display = 'block';
}

function hideForm() {
    const formContainer = document.querySelector('.form-container');
    formContainer.style.display = 'none';
}

function showAccount() {
    const accountContainer = document.querySelector('.account-container');
    accountContainer.style.display = 'block';
}

function hideAccount() {
    const accountContainer = document.querySelector('.account-container');
    accountContainer.style.display = 'none';
}

function clearInput() {
    const inputUsername = document.getElementById('input-username');
    const inputServerDomain = document.getElementById('input-serverdomain');
    inputUsername.value = '';
    inputServerDomain.value = '';
}

function recoverErrorMessage(){
    const inputErrorMessage = document.querySelector('#input-error-message');
    inputErrorMessage.textContent = 'Invalid username or server domain.';
}

function emptyInputHandler(username, serverDomain) {
    const inputErrorMessage = document.querySelector('#input-error-message');
    if (username === '' || serverDomain === '') {
        inputErrorMessage.textContent = 'Empty username or server domain.';
        showError();
        return true;
    }
    return false;
}


function getInput() {
    let username = document.getElementById('input-username').value;
    let serverDomain = document.getElementById('input-serverdomain').value;
    return [username, serverDomain];
}

function combineInput(username, serverDomain){
    return "@" + username + "@" + serverDomain;
}


function processResponse(json) {
    if ('error' in json) {
        showError();
        clearInput();
        return;
    }
    else {
        hideError();
        id = json.id;
        displayName = json.display_name;
        profImgUrl = json.avatar;
        numFollowers = json.followers_count;
        return [id, displayName, profImgUrl, numFollowers];
    }
}

function saveId(id){
    sessionStorage.setItem('account_id', id);
}

function updateFromResponse(combinedInputData, id, displayName, profImgUrl, numFollowers) {
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



function validateInput(username, serverDomain) {
    combinedInputData = combineInput(username, serverDomain);

    let apiURL = `${baseURL}/api/v1/account/lookup?acct=${combinedInputData}`;
    console.log('apiURL: ', apiURL )

    fetch(apiURL)
        .then((response) => response.json())
        .then((json) => {
            console.log('json:', json);
            
            [id, displayName, profImgUrl, numFollowers] = processResponse(json);
            
            console.log('user_acct, id, display_name, profile_img_url, num_followers: ', combinedInputData, id, displayName, profImgUrl, numFollowers);
            
            // show the username if the user has never set the display name
            if (displayName === '') {
                displayName = username;
            }
            
            // update the account info using parsed data from api fetching
            updateFromResponse(combinedInputData, id, displayName, profImgUrl, numFollowers);
            
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