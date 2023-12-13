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


function updateFromResponse(combinedInputData, displayName, profImgUrl, numFollowers) {
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
            
            console.log('user_acct, display_name, profile_img_url, num_followers: ', combinedInputData, displayName, profImgUrl, numFollowers);
            
            if (displayName === '') {
                displayName = username;
            }
            
            updateFromResponse(combinedInputData, displayName, profImgUrl, numFollowers);
            
            hideForm();
            showAccount();
        })
        .catch((error) => {
            console.log(
              'Invalid username or server domain.'
            );

            console.log('Error Caught in api fetch', error);
            
            showForm();
            hideAccount();
  
        });
}