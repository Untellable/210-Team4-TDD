/*global document,alert,vis,FileReader*/
import {
    stylingType,
    metricType,
    // eslint-disable-next-line no-unused-vars
    baseURL,
    defaultNodeColor,
    defaultNodeSize,
} from './util/constants.js';
import {
    showSpinner,
    hideSpinner,
    hideLegend,
    displayLegend,
    generateTitle,
} from './util/ui.js';
import { verifyUserID, verifyLocality, verifyMaxNodes } from './util/utils.js';
import './util/modal.js';
import './util/instructions-modal.js';
import { hideModal } from './util/modal.js';

let nodes = []; // array of nodes
let edges = [];
let currentStyle;
let currentMetric;
let responseJson; // Stores the response from the API

const legendHeading = document.getElementById('legendHeading');

/**
 * Function is called when the user clicks on the "Update" button
 * Updates the network graph with the user ID entered in the input box
 */
export function updateID() {
    showSpinner();

    // Clear the nodes and edges array
    nodes = [];
    edges = [];

    let userID = document.getElementById('idInput').value;
    let maxNodes = document.getElementById('maxNodesInput').value;
    let locality = document.getElementById('localityInput').value;
    let nodeRank = document.getElementById('rankingOptions').value;

    if (!verifyUserID(userID)) {
        alert('Please enter a valid number.');
        hideSpinner();
        return;
    }

    if (!verifyMaxNodes(maxNodes)) {
        alert('Please enter a number between 1 and 500 for number of nodes.');
        hideSpinner();
        return;
    }

    if (!verifyLocality(locality)) {
        alert('Please enter a number between 1 and 10 for locality.');
        hideSpinner();
        return;
    }

    let apiURL = `${baseURL}/api/v1/account/${userID}/initialize`;

    let queryParams = new URLSearchParams({
        maxNodes: maxNodes,
        locality: locality,
        nodeRank: nodeRank,
    });

    let apiURLWithParams = `${apiURL}?${queryParams}`;

    // Need to write a common http request function with error handling
    fetch(apiURLWithParams)
        .then((response) => response.json())
        .then((json) => {
            responseJson = json;
            console.log(json);
            const [nodes, edges] = processData(json, userID);
            console.log('Nodes and edges', nodes, edges);
            applyNodeStyling(nodes, currentStyle, currentMetric);
            hideSpinner();
        })
        .catch((error) => {
            console.log(
                'Error fetching data from API. Please try again later.'
            );
            alert('Error fetching data from API. Please try again later.');
            console.log('Error', error);
            hideSpinner();
        });
}

/**
 *
 * @param {JSON} json Response json from the API
 * @param {Number} mainID
 * @returns {Array} [nodes,edges]
 *
 * Function takes in the JSON response from the API and the main user ID
 * Returns an array of nodes and edges to be used in the network graph
 *
 *
 */
export function processData(json, mainID) {
    let nodesCreated = new Set(); // to keep track of nodes created using the ids of accounts
    let main_node;

    if (mainID != null) {
        main_node = json.filter((node) => node?.id === mainID)[0];
        nodes.push({
            id: main_node.id,
            value: 20, // size of the node in the graph
            label: main_node.displayName,
            followersCount: main_node.followersCount,
            followingCount: main_node.followingCount,
            statusesCount: main_node.statusesCount,
            title: generateTitle(main_node),
        });
        nodesCreated.add(main_node.id);
    }

    // Add nodes

    json.forEach((node) => {
        if (!main_node || node.id !== main_node.id) {
            nodes.push({
                id: node.id,
                value: 15, // lower size for followers
                label: node.displayName,
                followersCount: node.followersCount,
                followingCount: node.followingCount,
                statusesCount: node.statusesCount,
                title: generateTitle(node),
            });
            console.log('Added node', node.displayName);
            nodesCreated.add(node.id);
        }
    });

    // Add edges

    json.forEach((node) => {
        node.following?.forEach((followingID) => {
            edges.push({
                from: node.id,
                to: followingID,
                value: 1,
            });
            console.log('Added edge', node.displayName, followingID);
        });
    });

    return [nodes, edges];
}

/**
 * Applies styling to the nodes based on the number of followers
 * @param {*} nodes
 * @param {*} type
 * @returns
 */
export function applyFollowerMetric(nodes, type) {
    legendHeading.innerHTML = 'Number of followers';
    if (type === stylingType.SIZE) {
        nodes.forEach((node) => {
            if (node.followersCount === 0) {
                node.value = 1;
            } else {
                node.value = parseInt(1 + Math.log(node.followersCount) * 10);
            }
            console.log('Node value', node.followersCount, node.value);
        });
    } else if (type === stylingType.COLOR) {
        nodes.forEach((node) => {
            if (node.followersCount < 100) {
                node.color = '#ff0000';
            } else if (node.followersCount < 1000) {
                node.color = '#ff6600';
            } else if (node.followersCount < 10000) {
                node.color = '#ffcc00';
            } else if (node.followersCount < 100000) {
                node.color = '#99ff00';
            } else if (node.followersCount < 1000000) {
                node.color = '#00ff00';
            } else {
                node.color = '#00ff99';
            }
        });
    }

    if (type === stylingType.COLOR) {
        displayLegend();
    }

    return nodes;
}
/**
 * Default styling for nodes
 * @param {*} nodes
 * @param {*} type
 * @returns
 */
export function applyNoneMetric(nodes, type) {
    if (type === stylingType.SIZE) {
        nodes.forEach((node) => {
            node.value = defaultNodeSize;
        });
    } else if (type === stylingType.COLOR) {
        nodes.forEach((node) => {
            node.color = defaultNodeColor;
        });
        hideLegend();
    }
    return nodes;
}

/**
 * Applies styling to the nodes based on the number of posts
 * @param {*} nodes
 * @param {*} type
 * @returns
 */
export function applyActivityMetric(nodes, type) {
    legendHeading.innerHTML = 'Number of posts';
    if (type === stylingType.SIZE) {
        nodes.forEach((node) => {
            if (node.statusesCount === 0) {
                node.value = 1;
            } else {
                node.value = parseInt(1 + Math.log(node.statusesCount) * 10);
            }
            console.log('Node value', node.statusesCount, node.value);
        });
    } else if (type === stylingType.COLOR) {
        nodes.forEach((node) => {
            if (node.statusesCount < 100) {
                node.color = '#ff0000';
            } else if (node.statusesCount < 1000) {
                node.color = '#ff6600';
            } else if (node.statusesCount < 10000) {
                node.color = '#ffcc00';
            } else if (node.statusesCount < 100000) {
                node.color = '#99ff00';
            } else if (node.statusesCount < 1000000) {
                node.color = '#00ff00';
            } else {
                node.color = '#00ff99';
            }
        });
    }

    if (type === stylingType.COLOR) {
        displayLegend();
    }

    return nodes;
}

/**
 * Function to apply styling to the nodes -
 * - Size of the nodes based on the number of followers
 * - or color of the nodes based on the number of followers
 * @param {string} nodes
 * @param {string} type
 * @param {string} metric
 * @returns {*} nodesdrawFromResponse
 */

export function applyNodeStyling(nodes, type, metric) {
    currentMetric = metric;
    currentStyle = type;

    if (metric === metricType.FOLLOWERS) {
        nodes = applyFollowerMetric(nodes, type);
    } else if (metric === metricType.ACTIVITY) {
        nodes = applyActivityMetric(nodes, type);
    } else if (metric === metricType.NONE) {
        nodes = applyNoneMetric(nodes, type);
    }

    drawFromResponse(nodes, edges);
    return nodes;
}

/**
 * Draws the network graph using the nodes and edges array
 * @param {*} nodes
 * @param {*} edges
 */

export function drawFromResponse(nodes, edges) {
    let container = document.getElementById('mynetwork');
    let data = {
        nodes: nodes,
        edges: edges,
    };
    let options = {
        nodes: {
            shape: 'dot',
            color: {
                border: '#222222',
                background: '#666666',
            },
            font: { color: '#eeeeee' },
        },
        edges: {
            color: 'lightgray',
            arrows: {
                to: {
                    enabled: true,
                },
            },
            smooth: {
                enabled: false,
                type: 'continuous',
            },
            scaling: {
                min: 1,
                max: 3,
                label: {
                    enabled: true,
                    min: 14,
                    max: 30,
                    maxVisible: 30,
                    drawThreshold: 5,
                },
            },
            length:
                100 +
                Math.log(document.getElementById('maxNodesInput').value) * 20,
        },
        physics: {
            adaptiveTimestep: true,
            barnesHut: {
                gravitationalConstant: -8000,
                springConstant: 0.04,
                springLength:
                    100 +
                    Math.log(document.getElementById('maxNodesInput').value) *
                        20,
            },
            stabilization: {
                iterations: 2000,
            },
        },
        layout: {
            randomSeed: 191006,
            improvedLayout: true,
        },
        interaction: {
            tooltipDelay: 20000, // a really long delay so that popup is displayed on click instead of hover
        },
    };
    let network = new vis.Network(container, data, options);
    network.once('beforeDrawing', function () {
        network.focus(0, {
            scale: 12,
        });
    });

    network.once('afterDrawing', function () {
        network.fit({
            animation: {
                duration: 1500,
                easingFunction: 'linear',
            },
        });
    });

    // Intercept the click event
    network.on('click', function (params) {
        // Check if you clicked on a node; if so, display the title (if any) in a popup
        network.interactionHandler._checkShowPopup(params.pointer.DOM);
    });
}

/**
 * Function to handle node size option selection
 * @param {*} event
 */
export function handleNodeSizeSelection(event) {
    const selectedValue = event.target.value;
    applyNodeStyling(nodes, stylingType.SIZE, selectedValue);
}

/**
 * Function to handle node color option selection
 * @param {*} event
 */
export function handleNodeColorSelection(event) {
    const selectedValue = event.target.value;
    applyNodeStyling(nodes, stylingType.COLOR, selectedValue);
}

/**
 * Function to export graph to a JSON file
 * Downloads a JSON file with the graph data
 */
export function exportGraph() {
    // Create a Blob with the JSON data
    if (responseJson == null) {
        alert(
            'Please enter a valid user ID and update the graph before exporting.'
        );
        return;
    }

    // Create a Blob with the JSON object
    const blob = new Blob([JSON.stringify(responseJson, null, 2)], {
        type: 'application/json',
    });

    // Create a download link
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = 'graph.json';

    // Append the link to the body
    document.body.appendChild(a);

    // Trigger a click on the link to start the download
    a.click();

    // Remove the link from the body
    document.body.removeChild(a);

    // Revoke the URL to free up resources
    URL.revokeObjectURL(url);
}

/**
 * Function to import graph from a JSON file
 */

export function importGraph() {
    // Get the file from the input element
    const file = document.getElementById('chooseFile').files[0];

    if (file == null) {
        alert('Please select a file to import.');
        return;
    }

    // Clear the nodes and edges array
    nodes = [];
    edges = [];

    // Create a new FileReader instance
    const reader = new FileReader();

    // Read the file
    reader.readAsText(file);

    // When the file has been read...
    reader.onload = function () {
        // ...call the `processData` function and pass the result
        const [nodes_response, edges_response] = processData(
            JSON.parse(reader.result)
        );
        edges = edges_response; // Updating global edges variable
        applyNodeStyling(nodes_response, currentStyle, currentMetric);
        hideModal();
    };
}
