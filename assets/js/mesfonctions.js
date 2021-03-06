  window.onload = function() {
    L.mapquest.key = 'MAxEGKsMuGoi5Y7FMzaxC1RirEkOI5xg';
    fg = L.featureGroup();
    map = L.mapquest.map('map', {
        center: [48.8566,2.3522],
        layers: L.mapquest.tileLayer("map"),
        zoom: 12
    });
        map.addLayer(L.mapquest.trafficLayer());
        map.addLayer(L.mapquest.incidentsLayer());
        map.addLayer(L.mapquest.marketsLayer());

      
  //   function geolocationErrorOccurred(geolocationSupported, popup, latLng) {
  //     popup.setLatLng(latLng);
  //     popup.setContent(geolocationSupported ?
  //             '<b>Error:</b> The Geolocation service failed.' :
  //             '<b>Error:</b> This browser doesn\'t support geolocation.');
  //     popup.openOn(geolocationMap);
  // }

  // if (navigator.geolocation) {
   
  //     navigator.geolocation.getCurrentPosition(function(position) {
  //         var latLng = {
  //             lat: position.coords.latitude,
  //             lng: position.coords.longitude
  //         };

  //         popup.setLatLng(latLng);
  //         popup.setContent('This is your current location');
  //         popup.openOn(geolocationMap);

  //         geolocationMap.setView(latLng);
  //     }, function() {
  //         geolocationErrorOccurred(true, popup, geolocationMap.getCenter());
  //     });
  // } else {
  //     //No browser support geolocation service
  //     geolocationErrorOccurred(false, popup, geolocationMap.getCenter());
  // }
  

//console.log( malatitude );
//   map = L.mapquest.map('map', {     
//   center: [malatitude,malongitude],
//   layers: L.mapquest.tileLayer('map'),
//   zoom: 11
// });
layerAllMarkers = L.layerGroup().addTo(map);
map.addControl(L.mapquest.control());
map.addControl(L.mapquest.geocodingControl({
  position: 'topleft'
}));

L.mapquest.directionsControl({
  className: '',
  directions: {
    options: {
      timeOverage: 25,
      doReverseGeocode: false,
    }
  },
  directionsLayer: {
    startMarker: {
      draggable: true,
      icon: 'marker-start',
      iconOptions: {},
    },
    endMarker: {
      draggable: true,
      icon: 'marker-end',
      iconOptions: {},
    },
    routeRibbon: {
      showTraffic: true
    },
    alternateRouteRibbon: {
      showTraffic: true
    },
    paddingTopLeft: [450, 20],
    paddingBottomRight: [20, 20],
  },
  startInput: {
    compactResults: true,
    disabled: false,
    location: {},
    placeholderText: 'Starting point or click on the map...',
    geolocation: {
      enabled: true
    }
  },
  endInput: {
    compactResults: true,
    disabled: false,
    location: {},
    placeholderText: 'Destination',
    geolocation: {
      enabled: true
    }
  },
  addDestinationButton: {
    enabled: true,
    maxLocations: 10,
  },
  routeTypeButtons: {
    enabled: true,
  },
  reverseButton: {
    enabled: true,
  },
  optionsButton: {
    enabled: true,
  },
  routeSummary: {
    enabled: true,
    compactResults: false,
  },
  narrativeControl: {
    enabled: true,
    compactResults: false,
    interactive: true,
  },
}).addTo(map);



}
// L.marker([malatitude,malongitude], {
//   icon: L.mapquest.icons.flag({
//     primaryColor: '#22407F',
//     secondaryColor: '#3B5998',
//     shadow: true,
//     size: 'md',
//     symbol: 'Ici'
//   })
// }).addTo(layerAllMarkers);



function itineraire(){

L.mapquest.directionsControl({
  routeSummary: {
    enabled: true
   
  },
  narrativeControl: {
    enabled: true,
    compactResults: false,
    interactive: true

  }
}).addTo(map);

};
    
  
var Ardt = new Vue({
el: '#checkboxArdt',
data: {
  checkedArdt: [],
  infosByArdt: null,
  items: []
},
beforeCreate: function () {
  var self = this;
  $.ajax({
    url: 'models/model_allardt.php',
    success: function (response) {
      self.items = JSON.parse(response);
    },
    error: function (error) {
      console.log(error);
    }
  });
},
methods: {
  loadlist: function () {

    var formData = new FormData();
    map.removeLayer(layerAllMarkers);
    layerAllMarkers = L.layerGroup().addTo(map);
    formData.append('ardt', Ardt.checkedArdt);
    axios({
        method: 'post',
        url: '/move-and-watch/models/model_ardt.php',
        data: formData
      }).then(function (response) {
        Ardt.infosByArdt = response.data;
        L.geoJson(Ardt.infosByArdt, {
          onEachFeature: function (feature, layer) {
            layer.on({
              click: function showResultsInDiv() {
                var d = document.getElementById('click-tournage');
                d.innerHTML = "";
                d.innerHTML +=
                  '<h4>Tout savoir sur:</h4>' +
                  '<p><span>'+feature.properties.titre + '</span></br></p>' +
                 '<p><b>Réalisateur : </b>' + feature.properties.realisateur + '</br></p>' +
                  '<p><b>Format : </b>' + feature.properties.type_de_tournage + '</br></p>' +
                  '<p><b>Organisme demandeur : </b>' + feature.properties.organisme_demandeur + '</br></p>' +
                  '<p><b>Adresse : </b>' + feature.properties.adresse + '</br></p>' +
                  '<p><b>Arrondissement : </b>' + feature.properties.ardt + '</br></p>'
              }
            });
          }
        }).addTo(layerAllMarkers);
        // console.log(response.data);
      })
      .catch(function (error) {
        // console.log(error);
      })
  }
}
});

var Realisateurs = new Vue({
el: '#realisateurs',
data: {
  selectedRea: [],
  infosByRea: null,
  items: []
},
beforeCreate: function () {
  var self = this;
  $.ajax({
    url: 'models/model_rea.php',
    success: function (response) {
      self.items = JSON.parse(response);
    },
    error: function (error) {
      console.log(error);
    }
  });
},
methods: {
  loadlist: function () {
    var formData = new FormData();
    map.removeLayer(layerAllMarkers);
    layerAllMarkers = L.layerGroup().addTo(map);
    formData.append('realisateur', Realisateurs.selectedRea);
    axios({
        method: 'post',
        url: '/move-and-watch/models/model_byrea.php',
        data: formData
      }).then(function (response) {
          Realisateurs.infosByRea = response.data;
          console.log(response.data);
          L.geoJson(Realisateurs.infosByRea, {
            onEachFeature: function (feature, layer) {
              layer.on({
                click: function showResultsInDiv() {
                  var d = document.getElementById('click-tournage');
                  d.innerHTML = "";
                  d.innerHTML +=
                  '<h4>Tout savoir sur:</h4>' +
                  '<p><span>'+feature.properties.titre + '</span></br></p>' +
                 '<p><b>Réalisateur : </b>' + feature.properties.realisateur + '</br></p>' +
                  '<p><b>Format : </b>' + feature.properties.type_de_tournage + '</br></p>' +
                  '<p><b>Organisme demandeur : </b>' + feature.properties.organisme_demandeur + '</br></p>' +
                  '<p><b>Adresse : </b>' + feature.properties.adresse + '</br></p>' +
                  '<p><b>Arrondissement : </b>' + feature.properties.ardt + '</br></p>'
                }
              });
            }
          }).addTo(layerAllMarkers);
        // console.log(response.data);
      })
      .catch(function (error) {
        // console.log(error);
      })
  }
}
});


var Format = new Vue({
el: '#format',
data: {
  selectedForm: [],
  infosByForm: null,
  items: []
},
beforeCreate: function () {
  var self = this;
  $.ajax({
    url: 'models/model_for.php',
    success: function (response) {
      self.items = JSON.parse(response);
    },
    error: function (error) {
      console.log(error);
    }
  });
},
methods: {
  loadlist: function () {
    var formData = new FormData();
    map.removeLayer(layerAllMarkers);
    layerAllMarkers = L.layerGroup().addTo(map);
    formData.append('format', Format.selectedForm);
    axios({
        method: 'post',
        url: '/move-and-watch/models/model_format.php',
        data: formData
      }).then(function (response) {
        Format.infosByForm = response.data;
        console.log(response.data);
        L.geoJson(Format.infosByForm, {
          onEachFeature: function (feature, layer) {
            layer.on({
              click: function showResultsInDiv() {
                var d = document.getElementById('click-tournage');
                d.innerHTML = "";
                d.innerHTML +=
                '<h4>Tout savoir sur:</h4>' +
                '<p><span>'+feature.properties.titre + '</span></br></p>' +
               '<p><b>Réalisateur : </b>' + feature.properties.realisateur + '</br></p>' +
                '<p><b>Format : </b>' + feature.properties.type_de_tournage + '</br></p>' +
                '<p><b>Organisme demandeur : </b>' + feature.properties.organisme_demandeur + '</br></p>' +
                '<p><b>Adresse : </b>' + feature.properties.adresse + '</br></p>' +
                '<p><b>Arrondissement : </b>' + feature.properties.ardt + '</br></p>'
              }
            });
          }
        }).addTo(layerAllMarkers);
        // console.log(response.data);
      })
      .catch(function (error) {
        // console.log(error);
      })
  }
}
});