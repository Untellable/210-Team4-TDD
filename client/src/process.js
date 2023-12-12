/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
const baseURL = 'http://localhost:10000';

// Enum for options
const metricType = {
    FOLLOWERS: 'followers',
    ACTIVITY: 'activity',
    NONE: 'none',
};

const stylingType = {
    SIZE: 'size',
    COLOR: 'color',
};

const defaultNodeColor = '#666666';
const defaultNodeSize = 15;

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

let nodes = []; // array of nodes
let edges = []; 

/**
 * Funntion to validate the user ID entered in the input box
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

/**
 * Function is called when the user clicks on the "Update" button
 * Updates the network graph with the user ID entered in the input box
 */

export function updateID() {
    console.log('Update ID called');
    showSpinner();

    let userID = document.getElementById('idInput').value;

    if (!verifyUserID(userID)) {
        alert('Please enter a valid number.');
        hideSpinner();
        return;
    }

    // let apiURL = `${baseURL}/api/v1/account/${userID}/initialize`;
    let apiURL = `example_response.json`;

    // Need to write a common http request function with error handling
    fetch(apiURL)
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            const [nodes, edges] = processData(json, userID);
            console.log('Nodes and edges', nodes, edges);
            drawFromResponse(nodes, edges);
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
    let nodes_json = json.accountInfoList;
    let edges_json = json.relations;

    let main_node = nodes_json.filter((node) => node.id == mainID)[0];

    let nodesCreated = new Set(); // to keep track of nodes created using the ids of accounts
    nodes.push({
        id: main_node.id,
        value: 20, // size of the node in the graph
        label: main_node.display_name,
        followers_count: main_node.followers_count,
    });

    nodesCreated.add(main_node.id);

    nodes_json.forEach((node) => {
        if (node.id != main_node.id) {
            nodes.push({
                id: node.id,
                value: 15, // lower size for followers
                label: node.display_name,
                followers_count: node.followers_count,
            });
            console.log('Added node', node.display_name);
            nodesCreated.add(node.id);
        }
    });

    for (let key in edges_json) {
        let followers = edges_json[key];
        followers.forEach((follower) => {
            edges.push({
                from: follower,
                to: key,
            });
        });
    }

    return [nodes, edges];
}

/**
 * Function to display a legend for the styles applied to the nodes
 */

export function displayLegend() {
    let legend = document.getElementById('legend');
    legend.style.display = 'block';
    legend.innerHTML = `
    <div class="legend-item">
        <div class="legend-color" style="background-color: #ff0000;"></div>
        <div class="legend-text">0 - 99 followers</div>
    </div>
    <div class="legend-item">
        <div class="legend-color" style="background-color: #ff6600;"></div>
        <div class="legend-text">100 - 999 followers</div>
    </div>
    <div class="legend-item">
        <div class="legend-color" style="background-color: #ffcc00;"></div>
        <div class="legend-text">1000 - 9999 followers</div>
    </div>
    <div class="legend-item">
        <div class="legend-color" style="background-color: #99ff00;"></div>
        <div class="legend-text">10000 - 99999 followers</div>
    </div>
    <div class="legend-item">
        <div class="legend-color" style="background-color: #00ff00;"></div>
        <div class="legend-text">100000 - 999999 followers</div>
    </div>
    <div class="legend-item">
        <div class="legend-color" style="background-color: #00ff99;"></div>
        <div class="legend-text">1000000+ followers</div>
    </div>
    `;
}


export function applyFollowerMetric(nodes,type) {

    if(type == stylingType.SIZE) {
        nodes.forEach((node) => {
            if(node.followers_count == 0) {
                node.value = 1;
            } else {
                node.value = parseInt(1 + Math.log(node.followers_count) * 10);
            }
            console.log('Node value', node.followers_count, node.value);
        });
    } else if (type == stylingType.COLOR) {
        nodes.forEach((node) => {
            if (node.followers_count < 100) {
                node.color = '#ff0000';
            } else if (node.followers_count < 1000) {
                node.color = '#ff6600';
            } else if (node.followers_count < 10000) {
                node.color = '#ffcc00';
            } else if (node.followers_count < 100000) {
                node.color = '#99ff00';
            } else if (node.followers_count < 1000000) {
                node.color = '#00ff00';
            } else {
                node.color = '#00ff99';
            }
        });
    }

    return nodes;

}

/**
 * 
 * @param {*} nodes 
 * @param {*} type 
 * @returns 
 */

export function applyNoneMetric(nodes,type){

    if(type == stylingType.SIZE) {
        nodes.forEach((node) => {
            node.value = defaultNodeSize;
        });
    } else if (type == stylingType.COLOR) {
        nodes.forEach((node) => {
            node.color = defaultNodeColor;
        });
    }
    return nodes;
}

/**
 * Function to apply styling to the nodes -
 * - Size of the nodes based on the number of followers
 * - or color of the nodes based on the number of followers
 * @param string nodes
 * @param string type
 * @param string metric  
 * @returns {*} nodesdrawFromResponse
 */

export function applyNodeStyling(nodes, type, metric) {

    if (metric == metricType.FOLLOWERS) {
        nodes = applyFollowerMetric(nodes,type);  
    } else if (metric == metricType.ACTIVITY) {
       //Relevant code to be added here
    } else if (metric == metricType.NONE) {
        nodes = applyNoneMetric(nodes,type);
    }

    drawFromResponse(nodes,edges);
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
            length: 100,
        },
        physics: {
            adaptiveTimestep: true,
            barnesHut: {
                gravitationalConstant: -8000,
                springConstant: 0.04,
                springLength: 95,
            },
            stabilization: {
                iterations: 2000,
            },
        },
        layout: {
            randomSeed: 191006,
            improvedLayout: true,
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

    network.on('click', function (params) {
        params.event = '[original event]';
        console.log(
            'click event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM)
        );
    });
}

/**
 * Function to handle node size option selection
 * @param {*} event 
 */
export function handleNodeSizeSelection(event) {
    const selectedValue = event.target.value;
    applyNodeStyling(nodes,stylingType.SIZE,selectedValue);
}

// Function to handle node color option selection
export function handleNodeColorSelection(event) {
    const selectedValue = event.target.value;
    applyNodeStyling(nodes,stylingType.COLOR,selectedValue);
}
