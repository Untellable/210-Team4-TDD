/* eslint-disable no-undef */
const baseURL = "http://localhost:10000";

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
 * Function is called when the user clicks on the "Update" button
 * Updates the network graph with the user ID entered in the input box
 */

export function updateID(){ 
    console.log("Update ID called");
    showSpinner();

    let userID = document.getElementById("idInput").value;


    if (!/^\d+$/.test(userID)) {
        alert("Please enter a valid number.");
        console.log("Invalid user ID entered");
        hideSpinner();
        return;
    }

    console.log("User ID", userID);

    let apiURL = `${baseURL}/api/v1/account/${userID}/initialize`;


    // Need to write a common http request function with error handling
    try {
        fetch(apiURL)
            .then((response) => response.json())
            .then((json) => {
                try {
                    console.log(json);
                    const [nodes, edges] = processData(json, userID);
                    console.log("Nodes and edges", nodes, edges);
                    drawFromResponse(nodes, edges);
                    hideSpinner();
                } catch (error) {
                    console.log("Error in processing response", error);
                    // Handle or rethrow the error as needed
                }
            });
    } catch (error) {
        alert("Error fetching data from API. Please try again later.");
        console.log("Error", error);
        hideSpinner();
    }
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

export function processData(json, mainID = '109252111498807689'){

    nodes_json = json.accountInfoList;
    edges_json = json.relations;

    main_node = nodes_json.filter(node => node.id == mainID)[0];

    let nodes = [];
    let nodesCreated = new Set(); // to keep track of nodes created using the ids of accounts
    nodes.push(
        {
            id: main_node.id,
            value: 20,
            label: main_node.display_name
        }
    );

    nodesCreated.add(main_node.id); 

    let edges = [];

    nodes_json.forEach(node => {
        if (node.id != main_node.id) {
            nodes.push(
                {
                    id: node.id,
                    value: 10,
                    label: node.display_name
                }
            );
            console.log("Added node", node.display_name);
            nodesCreated.add(node.id); 
        }
    });
    
    for (let key in edges_json){
        let followers = edges_json[key];
        followers.forEach(follower => {
            edges.push(
                {
                    from: follower,
                    to: key
                }
            );
        });
    }


    return [nodes,edges];
}

/**
 * Draws the network graph using the nodes and edges array
 * @param {*} nodes  
 * @param {*} edges 
 */

export function drawFromResponse(nodes, edges) {
    let container = document.getElementById("mynetwork");
    let data = {
        nodes: nodes,
        edges: edges,
    };
    let options = {
        nodes: {
            shape: "dot",
            color: {
                border: "#222222",
                background: "#666666",
            },
            font: { color: "#eeeeee" },
        },
        edges: {
            color: "lightgray",
            arrows: {
                to: {
                    enabled: true
                }
            },
            smooth: {
                enabled: false,
                type: 'continuous'
            },
            scaling: {
                min: 1,
                max: 3,
                label: {
                    enabled: true,
                    min: 14,
                    max: 30,
                    maxVisible: 30,
                    drawThreshold: 5
                }
            },
            length: 100
        },
        physics: {
            adaptiveTimestep: true,
            barnesHut: {
                gravitationalConstant: -8000,
                springConstant: 0.04,
                springLength: 95
            },
            stabilization: {
                iterations: 2000
            }
        },
        layout: {
            randomSeed: 191006,
            improvedLayout: true
        }
    };
    network = new vis.Network(container, data, options);
    network.once("beforeDrawing", function () {
        network.focus(0, {
            scale: 12,
        });
    });
    network.once("afterDrawing", function () {
        network.fit({
            animation: {
                duration: 1500,
                easingFunction: "linear",
            },
        });
    });
}