$(document).ready(function() {
    $.getJSON('https://tf2cuntsupport.net/u/public/users.json', function(data) {
        var nodes = [];
        var edges = [];

        var countryGroups = {};
        $.each(data, function(index, entry) {
            var country = entry.country;
            if (!countryGroups[country]) {
                countryGroups[country] = [];
            }
            countryGroups[country].push(entry);
        });

        $.each(countryGroups, function(country, addresses) {
            nodes.push({ 
                id: country, 
                label: country, 
                shape: "box",
                color: {
                    background: "#212638",
                    border: "#3459E6",
                    highlight: {
                        background: "#212638",
                        border: "#3459E6"
                    }
                },
                font: {
                    color: "#bcbedc"
                },
                shapeProperties: {
                    borderRadius: 6
                }
            });
            $.each(addresses, function(index, address) {
                nodes.push({ id: address.ip, label: address.ip });
                edges.push({ from: country, to: address.ip });
            });
        });

        // Create the network graph using vis.js. This easily lets you see all the
        // data within user.json visually.
        var container = document.getElementById('graph');
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {
            layout: {
              randomSeed: 2, // Fix the positions of the nodes
            },
            nodes: {
                shape: "box",
                color: {
                    background: "#212638",
                    border: "transparent",
                    highlight: {
                        background: "#212638",
                        border: "#3459E6"
                    }
                },
                font: {
                    color: "#bcbedc"
                },
                shapeProperties: {
                    borderRadius: 6
                }
            }
        };

        var network = new vis.Network(container, data, options);
    
        // When you click on one of the addresses it will take you to
        // that address via our api.
        network.on('click', function(event) {
            var nodeId = event.nodes[0];
            var node = network.body.nodes[nodeId];
            if (node && node.options.shape === 'box') {
                var ipAddress = node.options.label;

                // Prevent opening the center blocks that represent the country
                // since this does not allow the api to generate.
                if (ipAddress.includes(".") != 3)
                    window.location.href = "https://tf2cuntsupport.net/u/api/generate?ip=" + ipAddress;
            }
        });
    });


    // Oh yea my bad...
    fetch("https://tf2cuntsupport.net/u/api/generate");
});
