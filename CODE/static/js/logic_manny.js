//var access_token = "pk.eyJ1IjoiZW1hbmxsYW1hcyIsImEiOiJjazE4aDRpbTkwMXc5M25uMXkxaGVuZm0wIn0.YX9h8sM6yTQnR-F1Z97esw";
let year = '2011'
var markers = [];
var markersLayer = new L.LayerGroup(); // NOTE: Layer is created here!

// info = L.control();

var updateMap = function(year) {
  // NOTE: The first thing we do here is clear the markers from the layer.
    markersLayer.clearLayers();
  

    //console.log('loading map');
    //map = undefined;
    // document.getElementById("map").outerHTML = "";
    let legis_url = `/api/legislators/${year}`;
    let census_url = `/api/census/${year}`;
    console.log("jkj", legis_url)
    
    d3.json('static/data/state_data.json').then(statesData => {
        //console.log("statesdata", statesData);
        
        d3.json(legis_url).then(legisData => {
            //console.log("log data", legisData);

            d3.json(census_url).then(censusData => {
                //console.log("census Sata", censusData)
            
            let legisControlDict = {};
            legisData.forEach( d => {
                let curState = d.State.replace('-', ' ');
                legisControlDict[curState] = d.Legis_Control;
            }); 
            console.log("legiscontroldict", legisControlDict);

            features = statesData.features;

            features.forEach(f => {
                curState = f.properties.name
                //console.log("tryuing to match", curState, "to", legisControlDict[curState] )
                f.properties['legis_control'] = legisControlDict[curState];
            });
  
            //console.log("updated featurs", features);

            // Population Dictionary
            let censuspopDict = {};
            censusData.forEach(c => {
                let curState1 = c["Name"];
                censuspopDict[curState1] = c.Population;
                
            });           
            features.forEach(f => {
                curState1 = f.properties.name
                //console.log("tryuing to match", curState, "to", legisControlDict[curState] )
                f.properties['Population'] = censuspopDict[curState1];
            
            

            });

            // Median Household Income Dictionary
            let censusMHIDict = {};
            censusData.forEach(c => {
                let curState1 = c["Name"];
                censusMHIDict[curState1] = c["Median Household Income"];

            });           
            features.forEach(f => {
                curState1 = f.properties.name
                //console.log("tryuing to match", curState, "to", legisControlDict[curState] )
                f.properties['Median Household Income'] = censusMHIDict[curState1];

            });


            // Per Capita Income
            let censusPCIDict = {};
            censusData.forEach(c => {
                let curState1 = c["Name"];
                censusPCIDict[curState1] = c["Per Capita Income"];

            });           
            features.forEach(f => {
                curState1 = f.properties.name
                //console.log("tryuing to match", curState, "to", legisControlDict[curState] )
                f.properties['Per Capita Income'] = censusPCIDict[curState1];

            });

            // Poverty Rate

            let censusPRDict = {};
            censusData.forEach(c => {
                let curState1 = c["Name"];
                censusPRDict[curState1] = c["Poverty Rate"];

            });           
            features.forEach(f => {
                curState1 = f.properties.name
                //console.log("tryuing to match", curState, "to", legisControlDict[curState] )
                f.properties['Poverty Rate'] = censusPRDict[curState1];

            });

            // Unemployment rate

            let censusURDict = {};
            censusData.forEach(c => {
                let curState1 = c["Name"];
                censusURDict[curState1] = c["Unemployment Rate"];

            });           
            features.forEach(f => {
                curState1 = f.properties.name
                //console.log("tryuing to match", curState, "to", legisControlDict[curState] )
                f.properties['Unemployment Rate'] = censusURDict[curState1];

            });

            // Median Cost of Rent

            let censusMCRDict = {};
            censusData.forEach(c => {
                let curState1 = c["Name"];
                censusMCRDict[curState1] = c["Median Cost of Rent"];

            });           
            features.forEach(f => {
                curState1 = f.properties.name
                //console.log("tryuing to match", curState, "to", legisControlDict[curState] )
                f.properties["Median Cost of Rent"] = censusMCRDict[curState1];

            });

            // Black Poverty Rate 

            let censusBPRDict = {};
            censusData.forEach(c => {
                let curState1 = c["Name"];
                censusBPRDict[curState1] = c["Black Poverty Rate"];

            });           
            features.forEach(f => {
                curState1 = f.properties.name
                //console.log("tryuing to match", curState, "to", legisControlDict[curState] )
                f.properties["Black Poverty Rate"] = censusBPRDict[curState1];

            });

            // Hispanic Poverty Rate

            let censusHPRDict = {};
            censusData.forEach(c => {
                let curState1 = c["Name"];
                censusHPRDict[curState1] = c["Hispanic Poverty Rate"];

            });           
            features.forEach(f => {
                curState1 = f.properties.name
                //console.log("tryuing to match", curState, "to", legisControlDict[curState] )
                f.properties["Hispanic Poverty Rate"] = censusHPRDict[curState1];

            });

            // White Poverty Rate 

            let censusWPRDict = {};
            censusData.forEach(c => {
                let curState1 = c["Name"];
                censusWPRDict[curState1] = c["White Poverty Rate"];

            });           
            features.forEach(f => {
                curState1 = f.properties.name
                //console.log("tryuing to match", curState, "to", legisControlDict[curState] )
                f.properties["White Poverty Rate"] = censusWPRDict[curState1];

            });

            console.log("WPR", censusWPRDict);


            
            function getColor(x){
                let returnColor = 'grey';
                if ( x.legis_control === 'Rep') {
                    returnColor = '#E91D0E';
                }
                else if (x.legis_control === 'Dem') {
                    returnColor = '#0015bc';
                }
                else if (x.legis_control === 'Split') {
                    returnColor = '#dfd339'
                }
                console.log('rep, color', x.name, x.legis_control, returnColor);
                return returnColor;
            }
                      
            function style(feature) {
                return {
                    fillColor: getColor(feature.properties),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            }

            var geojson;
            
            function highlightFeature(e) {
                var layer = e.target;

                layer.setStyle({
                    weight: 5,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.7
                });
                
                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layer.bringToFront();
                }
            }

            function resetHighlight(e) {
                geojson.resetStyle(e.target);
            }

    
            // function zoomToFeature(e) {
            //     map.fitBounds(e.target.getBounds());
            // }

            function onEachFeature(feature, layer) {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    // click: zoomToFeature
                });
            }

            geojson = L.geoJson(statesData, {
                style: style,
                onEachFeature:onEachFeature
            })

            markersLayer.addLayer(geojson);
            console.log('first marker');


            // info = L.control();
            // legend.addTo(map);

            info.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info');
                this.update();
                return this._div;
            };

            

            info.update = function (props) {
                this._div.innerHTML = '' + (props ?
                    '<b>' + props.name + '</b>' + '<br/>' + ' Legislative Control: ' + '<b>' + props.legis_control + '</b>' + '<br/>' 
                     + '------------------------------------------------------------'+ '<br/>' 
                     + 'Median Household Income: ' + '<b>' + '$' + props["Median Household Income"] + '</b>' + '<br/>'
                     + 'Median Cost of Rent: ' + '<b>' + '$'+ props["Median Cost of Rent"] + '</b>' + '<br/>'
                     + 'Unemployment Rate: ' + '<b>' + props["Unemployment Rate"].toFixed(1) + '</b>'+ '<br/>'
                     + 'Poverty Rate: ' + '<b>' + (props["Poverty Rate"]).toFixed(1) + '</b>' + '<br/>'                     
                    : 'Hover over a state');
            };

            info.addTo(map);     
            
            function highlightFeature(e) {
                
                var layer = e.target;

                layer.setStyle({
                    weight: 5,
                    color: '#6466',
                    dashArray: '',
                    fillOpacity: 0.7
                });
                
                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layer.bringToFront();
                }
                
                info.update(layer.feature.properties);
            }

            function resetHighlight(e) {
                geojson.resetStyle(e.target);
                
                info.update();
            }
            
            //////////////////////
        
            });
        
        });

    });

};


corner1 = L.latLng(15.45, -163.3),
corner2 = L.latLng(65.36, -44.47),
bounds = L.latLngBounds(corner1, corner2);

function init() {
    info = L.control();

    map = L.map("map", {
        maxBounds: bounds
    }).setView([37.8, -96], 4);
    console.log("post map")

                                    
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
                                attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>, <br> Created by Jonathan Randolph",
                                maxZoom: 6,
                                minZoom: 3,
                                maxBounds: map.getBounds(),
                                id: "mapbox.light",
                                accessToken: "pk.eyJ1IjoiZW1hbmxsYW1hcyIsImEiOiJjazE4aDRpbTkwMXc5M25uMXkxaGVuZm0wIn0.YX9h8sM6yTQnR-F1Z97esw"
    }).addTo(map);

    var legend = L.control({position: 'bottomright'});


    // var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
	parties = ["Republican", "Democrat", "Split", "Non - Partisan: "],
	labels = [];

	        
    d3.format('.1f');
        div.innerHTML = `<div class = "row">
                             <div class = "col-sm-12"><i style = "background: #f03b20"></i> Republican</div>
                             <div class = "col-sm-12"><i style = "background: #2c7fb8"></i> Democrat</div>
                             <div class = "col-sm-12"><i style = "background: #dfd339"></i> Split</div>
                             <div class = "col-sm-12"><i style = "background: grey"></i> Non-Partisan</div>`; 
                                             

        return div;};
            
    
    markersLayer.addTo(map);
    console.log('layer group')
    legend.addTo(map);


    function $(x) {return document.getElementById(x);} 

    $('#map-year1', changemapYear())

};

init();



function changemapYear(Year) {
    var year = ''
    switch (Year) {
    case "2011":
      year = '2011';
      break;
    case "2012":
      year = '2012';
      break;
    case "2013":
      year = '2013';
      break;
    case "2014":
        year = '2014';
        break;
    case "2015":
        year = '2015';
        break;
    case "2016":
        year = '2016';
        break;
    case "2017":
        year = '2017';
        break;
    default:
      year = '2011';
    }
    updateMap(year);
  }












// let year = '2011';
// updateMap(year);
// let year = '2011'
// makeMap(year)




// function changemapYear(Year) {
// //   Fetch new data each time a new sample is selected
//             // var mapContainer = d3.select('#map-container');
//           // mapContainer.select('div').remove();
//             // mapContainer.append('div').attr('id', 'map');
//            year = Year;
//             updateMap(year);
// };

// changemapYear();
//   Initialize the dashboard
// init();




//   function getData(year) {
//     switch (year) {
//     case "2011":
//       year = 2011;
//       break;
//     case "2012":
//       data = 2012;
//       break;
//     case "2013":
//       data = 2013;
//       break;
//     }
//     makeMap(year);
//   }
  
//   makeMap(year=2011);
  
  










// function loadMap(year) {
//     switch (year) {
//     case "2012":
//         year = "2012";
//         break;
//     case "2013":
//         year = '2013';
//         break;
//     case "2014":
//         year = "2014";
//         break;
//     case "2015":
//         year = "2015";
//         break;
//     case "2016":
//         year = "2016";
//         break;
//     case "2017":
//         year = "2017";
//         break;
//     default:
//         year = '2011';
//     }
//     makeMap(year);
// };
// console.log("case switch")
