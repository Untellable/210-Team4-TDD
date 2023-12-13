/*global document*/
/**
 * Function displays the overlay
 */

export function showOverlay() {
    document.getElementById('overlay').style.display = 'block';
}

/**
 * Function hides the overlay
 */

export function hideOverlay() {
    document.getElementById('overlay').style.display = 'none';
}

/**
 * Function displays the loading spinner and overlay
 */

export function showSpinner() {
    showOverlay();
    document.getElementById('loadingSpinner').style.display = 'block';
}

/**
 * Function hides the loading spinner and overlay
 */

export function hideSpinner() {
    hideOverlay();
    document.getElementById('loadingSpinner').style.display = 'none';
}

/**
 * Function to display a legend for the styles applied to the nodes
 */

export function displayLegend() {
    let legend = document.getElementById('legend');
    legend.style.display = 'block';
}

/**
 * Function to hide legend
 */

export function hideLegend() {
    document.getElementById('legend').style.display = 'none';
}

/**
 * Function to generate the title for the popup
 * @param {Object} node the node on which the user clicks
 */
export function generateTitle(node) {
    let title = `
        <div class="popup-title">
            <div class="popup-title-text">${node.displayName}</div>
            <div>Followers: ${node.followersCount}</div>
            <div>Following: ${node.followingCount}</div>
            <div>Status count: ${node.statusesCount}</div>
            <div>Username: ${node.username}</div>
        </div>
    `;

    var element = document.createElement('div');
    element.innerHTML = title;

    return element;
}
