/**
 * Function to validate the user ID entered in the input box
 * @param {Number} userID user ID entered in the input box
 * @returns {Boolean} true if the user ID is valid, else false
 */
export function verifyUserID(userID) {
    if (!/^\d+$/.test(userID)) {
        console.log('Invalid user ID entered');
        return false;
    }

    console.log('User ID', userID);

    return true;
}
