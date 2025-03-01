// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
console.log(earthquakeData);
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function createPopups(feature, layer) {
      layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }
  
    // Define a function to get color based on depth
    function getColor(depth) {
        if (depth < 10) return "#13a849"; // Green
        else if (depth < 30) return "#bdd109ee"; // Yellow
        else if (depth < 60) return "#f59f0bca"; // Orange
        else if (depth < 100) return "#e5410b"; // Red
        else return "#9a0b0b"; // Dark Red
    }
    
    // Define a function to size the markers based on magnitude
    function pointToLayer(feature, latlng) {
        // Set the size of the marker based on the magnitude
        let magnitude = feature.properties.mag;
        let radius = (magnitude-1)**2; // Adjust the multiplier to change the size scaling
        let depth = feature.geometry.coordinates[2];
    
        return L.circleMarker(latlng, {
        radius: radius,
        fillColor: getColor(depth), // Call the getColor function here
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
        });
    }     
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: createPopups,
      pointToLayer: pointToLayer // Add the pointToLayer function here
    });
  
    // Send our earthquakes layer to the createMap function
    createMap(earthquakes);
  }

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}
