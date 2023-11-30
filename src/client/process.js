// Read the json file example.json




fetch('./example2.json')
    .then((response) => response.json())
    .then((json) => {
        console.log(json)
        const [nodes,edges] = processData(json)
        console.log("Nodes and edges",nodes,edges)
        drawFromResponse(nodes, edges)
    });


// Process the json file to visualize graph in visjs
function processData(json, mainID = 109252111498807689){
    // console.log(json.accountFollowers)

    const MAIN_USER = json.accountInfo;
    const CLUSTER_MAX_SIZE = 10;
    const FOLLOWER_NUM = 10;
    const FOLLOWING_NUM = 10;

    nodes_json = json.accountInfoList;
    edges_json = json.relations;

    main_node = nodes_json.filter(node => node.id == mainID)[0];

    let nodes = [];
    let count = 0;
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

    // num_followers = Math.min(FOLLOWER_NUM, main_node.followers_count) // get the minimum of the two numbers

    // for (let i = 0; i < num_followers; i++) {
    //     let follower = json.accountFollowers[i];
    //     if (follower != null) {
    //         if (!nodesCreated.has(follower.id)) {
    //             nodes.push(
    //                 {
    //                     id: follower.id,
    //                     value: 10,
    //                     label: follower.display_name
    //                 }
    //             );
    //             console.log("Added node", follower.display_name)
    //             nodesCreated.add(follower.id); 
    //         }
    //         edges.push(
    //             {
    //                 from: follower.id,
    //                 to: MAIN_USER.id
    //             }
    //         );
    //     }

    //     // Adding followers of followers
    //     let num_followers_of_follower = Math.min(FOLLOWER_NUM, follower.follower.length) // get the minimum of the two numbers
    //     for (let j = 0; j < num_followers_of_follower; j++) {
    //         let follower_of_follower = follower.follower[j];
    //         if (follower_of_follower != null) {
    //             if (!nodesCreated.has(follower_of_follower.id)) {
    //                 nodes.push(
    //                     {
    //                         id: follower_of_follower.id,
    //                         value: 10,
    //                         label: follower_of_follower.display_name
    //                     }
    //                 );
    //                 console.log("Added node", follower_of_follower.display_name)
    //                 nodesCreated.add(follower_of_follower.id); 
    //             }
    //             edges.push(
    //                 {
    //                     from: follower_of_follower.id,
    //                     to: follower.id
    //                 }
    //             );
    //         }
    //     }
    // }
    
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
    //network.cluster();
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