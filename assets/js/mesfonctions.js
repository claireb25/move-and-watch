    
    
    var mymap = L.map('map').setView([48.8566, 2.3522], 12);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoibmljb2xhc2phYyIsImEiOiJjamk1czB5YXowbjhyM2txb2Y4YXVnbjQxIn0.5PuCZmNu4RWZu1FlU0Kbqg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoibmljb2xhc2phYyIsImEiOiJjamk1czB5YXowbjhyM2txb2Y4YXVnbjQxIn0.5PuCZmNu4RWZu1FlU0Kbqg'
}).addTo(mymap);


L.Routing.control({
    waypoints: [
      L.latLng(57.74, 11.94),
      L.latLng(57.6792, 11.949)
    ]
  }).addTo(mymap);


  function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}

mymap.on('click', function(e) {
    var container = L.DomUtil.create('div'),
        startBtn = createButton('Start from this location', container),
        destBtn = createButton('Go to this location', container);

    L.popup()
        .setContent(container)
        .setLatLng(e.latlng)
        .openOn(mymap);
});

mymap.locate({setView: true, maxZoom: 15});

function onLocationFound(e) {
    var radius = e.accuracy/2;


    L.marker(e.latlng).addTo(mymap)
        .bindPopup("Vous êtes ici").openPopup();

//     L.circle(e.latlng, radius).addTo(mymap);
    mymap.initlat = e.latlng.lat;
    mymap.initlng = e.latlng.lng;
}

mymap.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

mymap.on('locationerror', onLocationError);
mymap.on('move', function(){
  var zm = mymap.getZoom();
  var ctr = mymap.getCenter(); 
  var ll = 'ZOOM:' + zm + ' | MAPCENTER: Lat: '+ ctr['lat'].toFixed(4) + ' Lng: '+ ctr['lng'].toFixed(4) + ' | <span id="recenter">Re-center</span>';
   $('#data').html(ll); 
});

$('#data').on('click', '#recenter',function(){
  mymap.panTo({lon: mymap.initlng, lat: mymap.initlat}, {'animate': true});                  
});



var tournages =$.getJSON("tournages.geojson",function(dataTournages)
{var iconeTournage=L.icon({
    iconUrl:'clap.png',
    iconSize:[19,21]
});
L.geoJSON(dataTournages,{
    pointToLayer:function(feature,latlng){
        var marker=L.marker(latlng,{icon:iconeTournage});
        marker.bindPopup('<b><u>Description du tournage</u></b><br>'
        +'<b>Nom du film : </b>' +feature.properties.titre+'</br>'
        +'<b>Réalisateur : </b>' +feature.properties.realisateur+'</br>'
        +'<b>Format : </b>' +feature.properties.type_de_tournage+'</br>'
        +'<b>Organisme demandeur : </b>' +feature.properties.organisme_demandeur+'</br>'
        +'<b>Adresse : </b>' +feature.properties.adresse+'</br>'
        +'<b>Arrondissement : </b>' +feature.properties.ardt+'</br>'
    );
        return marker;
    }
}).addTo(mymap);
}
);

L.DomEvent.on(startBtn, 'click', function() {
    control.spliceWaypoints(0, 1, e.latlng);
    map1.closePopup();
});

L.DomEvent.on(destBtn, 'click', function() {
    control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
    map1.closePopup();
});