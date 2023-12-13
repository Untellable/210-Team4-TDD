/**
 * Function to validate the user ID entered in the input box
 * @param {String} userID user ID entered in the input box
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

/**
 * Function to validate the number of maximum nodes entered in the input box
 * @param {Number} maxNodes maxNodes entered in the input box
 * @returns {Boolean} true if the maxNodes is valid, else false
 */
export function verifyMaxNodes(maxNodes) {
    if (maxNodes > 500 || maxNodes < 1) {
        console.log('Invalid maxNodes entered');
        return false;
    }

    console.log('Max Nodes', maxNodes);

    return true;
}

/**
 * Function to validate the locality entered in the input box
 * @param {Number} locality locality entered in the input box
 * @returns {Boolean} true if the locality is valid, else false
 */
export function verifyLocality(locality) {
    if (locality > 10 || locality < 1) {
        console.log('Invalid locality entered');
        return false;
    }

    console.log('Locality', locality);

    return true;
}
