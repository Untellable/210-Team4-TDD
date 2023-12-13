const baseURL = 'http://localhost:10000';

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
        
        [username, serverDomain] = getInput();
        console.log('Got Input After Submit Button is Clicked, username: ', username, 'serverDomain: ', serverDomain);      
        
        validateInput(username, serverDomain);
        
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






function getInput() {
    let username = document.getElementById('input-username').value;
    let serverDomain = document.getElementById('input-serverdomain').value;
    return [username, serverDomain];
}

function combineInput(username, serverDomain){
    return "@" + username + "@" + serverDomain;
}


function processResponse(json) {
    const errorContainer = document.querySelector('.error-message');
    const inputUsername = document.getElementById('input-username');
    const inputServerDomain = document.getElementById('input-serverdomain');
    if ('error' in json) {
        errorContainer.style.display = 'flex';
        inputUsername.value = '';
        inputServerDomain.value = '';
        return;
    }
    
    else {
        errorContainer.style.display = 'none';
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
    
    const formContainer = document.querySelector('.form-container');
    const accountContainer = document.querySelector('.account-container');

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
            
            formContainer.style.display = 'none';
            accountContainer.style.display = 'block';

            // wait for user to confirm on the account (yes / no button)
        })
        .catch((error) => {
            console.log(
              'Invalid username or server domain.'
            );
            // alert('Invalid username or server domain.');
            console.log('Error Caught in api fetch', error);
            
            // todo
            formContainer.style.display = 'block';
            accountContainer.style.display = 'none';
  
        });
}

