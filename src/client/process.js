// Read the json file example.json


const baseURL = "http://localhost:8991";

// fetch('./example2.json')
//     .then((response) => response.json())
//     .then((json) => {
//         console.log(json)
//         const [nodes,edges] = processData(json)
//         console.log("Nodes and edges",nodes,edges)
//         drawFromResponse(nodes, edges)
//     });


function updateID(){ 

    let userID = document.getElementById("idInput").value;

    if(userID == ""){
        console.log("No user ID entered")
        return
    }

    console.log("User ID", userID)

    let apiURL = `${baseURL}/api/v1/account/${userID}/initialize`

    fetch(apiURL)
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            const [nodes,edges] = processData(json, userID)
            console.log("Nodes and edges",nodes,edges)
            drawFromResponse(nodes, edges)
        });

}

// Process the json file to visualize graph in visjs
function processData(json, mainID = 109252111498807689){
    // console.log(json.accountFollowers)

    // const MAIN_USER = json.accountInfo;
    // const CLUSTER_MAX_SIZE = 10;
    // const FOLLOWER_NUM = 10;
    // const FOLLOWING_NUM = 10;

    nodes_json = json.accountInfoList;
    edges_json = json.relations;

    main_node = nodes_json.filter(node => node.id == mainID)[0];

    let nodes = [];
    let nodesCreated = new Set() // to keep track of nodes created using the ids of accounts
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
            console.log("Added node", node.display_name)
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


    return [nodes,edges]
}

function drawFromResponse(nodes, edges) {
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
                iterations: 987
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