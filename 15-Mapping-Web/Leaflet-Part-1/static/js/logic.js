$(document).ready(function () {

    pageLoad();
  
    $("#filter").on("click", function () {
        pageLoad();
    });
  
  });
  
  function pageLoad() {

    let queryUrl = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson`;
    let geoURL = "static/data/PB2002_boundaries.json"
    $("#mapContainer").empty();
    $("#mapContainer").append("<div style='height:800px' id='map'></div>")
  
    d3.json(geoURL).then(function (geoData) {

      d3.json(queryUrl).then(function (data) {
        
        console.log(data);
        makeMap(geoData, data);
  
      });

    });
  }
  
  function makeRadius(mag) {

    return mag ** 8

  }
  
  function getColor(depth) {

    switch (true) {

      case depth > 90:
        return "#ea2c2c";
      case depth > 70:
        return "#ea822c";
      case depth > 50:
        return "#ee9c00";
      case depth > 30:
        return "#eecc00";
      case depth > 10:
        return "#d4ee00";
      default:
        return "#98ee00";

    }

  }
  
  function makeMap(geoData, data) {
  
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    let circles = [];
  
    for (let i = 0; i < data.features.length; i++) {
      let earthquake = data.features[i];
      let location = earthquake.geometry.coordinates;
  
      let date = new Date(earthquake.properties.time);
  
      if (location) {
        let circle = L.circle([location[1], location[0]], {
                              fillOpacity: 0.75,
                              color: getColor(location[2]),
                              weight: 7,
                              fillColor: getColor(location[2]),
                              radius: makeRadius(earthquake.properties.mag)
                            }).bindPopup(`<h2> ${earthquake.properties.title} </h2><hr> <h3>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</h3>`);
  
        circles.push(circle);
      }
    }
  
    let circleLayer = L.layerGroup(circles)
  
    let geoLayer = L.geoJSON(geoData);
  
    let baseMaps = {
      Street: street,
      Topography: topo
    };
  
    let overlayMaps = {
      Markers: circleLayer,
      "Tectonic Plates": geoLayer
    };

    let myMap = L.map("map", {
      center: [37.7749, -122.4194],
      zoom: 3,
      layers: [street, circleLayer, geoLayer]
    });
  
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
  
    var legend = L.control({
      position: "bottomright"
    });
  
    legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend");
  
      div.innerHTML += "<i style='background: #98ee00'></i> -10 - 10<br>";
      div.innerHTML += "<i style='background: #d4ee00'></i> 10 - 30<br>";
      div.innerHTML += "<i style='background: #eecc00'></i> 30 - 50<br>";
      div.innerHTML += "<i style='background: #ee9c00'></i> 50 - 70<br>";
      div.innerHTML += "<i style='background: #ea822c'></i> 70 - 90<br>";
      div.innerHTML += "<i style='background: #ea2c2c'></i> 90+";
  
      return div;
    };
  
    legend.addTo(myMap);
 }