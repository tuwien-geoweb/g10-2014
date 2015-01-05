// TUTORIAL #1
// Base map
var osmLayer = new ol.layer.Tile({source: new ol.source.OSM()});

// Census map layer
var wmsLayer = new ol.layer.Image({
  source: new ol.source.ImageWMS({
    url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
    params: {'LAYERS': 'g10_2014:normailzed_data,g10_2014:comments'}
  }),
  opacity: 0.6
});

//Checkboxen
var haltestellen = new ol.layer.Vector({
  source: new ol.source.GeoJSON({
    url: 'http://student.ifip.tuwien.ac.at/geoserver/g10_2014/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=g10_2014:HALTESTELLEWLOGDPoint&outputFormat=json',
    projection: 'EPSG:3857'
  }),
    style: new ol.style.Style({
       image: new ol.style.Icon({
          src: 'images/haltestelle.png',
        })
    })
});

var bildung = new ol.layer.Vector({
source: new ol.source.GeoJSON({
    url: 'http://student.ifip.tuwien.ac.at/geoserver/g10_2014/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=g10_2014:SCHULEOGDPoint&outputFormat=json',
    projection: 'EPSG:3857'
  }),
    style: new ol.style.Style({
       image: new ol.style.Icon({
          src: 'images/schule.png',
        })
    })
});

var wlan = new ol.layer.Vector({
source: new ol.source.GeoJSON({
    url: 'http://student.ifip.tuwien.ac.at/geoserver/g10_2014/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=g10_2014:WLANWIENATOGDPoint&outputFormat=json',
    projection: 'EPSG:3857'
  }),
    style: new ol.style.Style({
       image: new ol.style.Icon({
          src: 'images/wlan.png',
        })
    })
});

var markt = new ol.layer.Vector({
source: new ol.source.GeoJSON({
    url: 'http://student.ifip.tuwien.ac.at/geoserver/g10_2014/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=g10_2014:MAERKTEOGDPoint&outputFormat=json',
    projection: 'EPSG:3857'
  }),
    style: new ol.style.Style({
       image: new ol.style.Icon({
          src: 'images/markt.png',
        })
    })
});

var citybike = new ol.layer.Vector({
source: new ol.source.GeoJSON({
    url: 'http://student.ifip.tuwien.ac.at/geoserver/g10_2014/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=g10_2014:CITYBIKEOGDPoint&outputFormat=json',
    projection: 'EPSG:3857'
  }),
    style: new ol.style.Style({
       image: new ol.style.Icon({
          src: 'images/citybike.png',
        })
    })
});

var spielplatz = new ol.layer.Vector({
source: new ol.source.GeoJSON({
    url: 'http://student.ifip.tuwien.ac.at/geoserver/g10_2014/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=g10_2014:SPIELPLATZOGDPoint&outputFormat=json',
    projection: 'EPSG:3857'
  }),
    style: new ol.style.Style({
       image: new ol.style.Icon({
          src: 'images/spielplatz.png',
        })
    })
});

var sportplatz = new ol.layer.Vector({
source: new ol.source.GeoJSON({
    url: 'http://student.ifip.tuwien.ac.at/geoserver/g10_2014/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=g10_2014:SPORTSTAETTENOGDPoint&outputFormat=json',
    projection: 'EPSG:3857'
  }),
    style: new ol.style.Style({
       image: new ol.style.Icon({
          src: 'images/sportplatz.png',
        })
    })
});


// Map object
olMap = new ol.Map({
  target: 'map',
  renderer: 'canvas',
  layers: [osmLayer, wmsLayer],
  view: new ol.View({
  center: ol.proj.transform([16.4, 48.2], 'EPSG:4326', 'EPSG:3857'),
  zoom: 11,
  maxZoom: 18
})
});
// !TUTORIAL #1

// TUTORIAL #2
// Load variables into dropdown
$.get("data/DataDict.txt", function(response) {
  // We start at line 3 - line 1 is column names, line 2 is not a variable
  $(response.split('\n').splice(2)).each(function(index, line) {
    $('#topics').append($('<option>')
      .val(line.substr(0, 19).trim())
      .html(line.substr(19, 105).trim()));
  });
});

// Add behaviour to dropdown
$('#topics').change(function() {
  wmsLayer.getSource().updateParams({
    'viewparams': 'column:' + $('#topics>option:selected').val()
  });
});

// Create an ol.Overlay with a popup anchored to the map
var popup = new ol.Overlay({
  element: $('#popup')
});
olMap.addOverlay(popup);

// Handle map clicks to send a GetFeatureInfo request and open the popup
olMap.on('singleclick', function(evt) {
  var view = olMap.getView();
  var url = wmsLayer.getSource().getGetFeatureInfoUrl(evt.coordinate,
      view.getResolution(), view.getProjection(), {'INFO_FORMAT': 'text/html'});
  popup.setPosition(evt.coordinate);
  $('#popup-content iframe').attr('src', url);
  $('#popup')
    .popover({content: function() { return $('#popup-content').html(); }})
    .popover('show');
  // Close popup when user clicks on the 'x'
  $('.popover-title').click(function() {
    $('#popup').popover('hide');
  });
  
  $('.popover form')[0].onsubmit = function(e) {
  var feature = new ol.Feature();
  feature.setGeometryName('geom');
  feature.setGeometry(new ol.geom.Point(evt.coordinate));
  feature.set('comment', this.comment.value);
  var xml = new ol.format.WFS().writeTransaction([feature], null, null, {
    featureType: 'comments', featureNS: 'http://geoweb/2014/g10',
    gmlOptions: {srsName: 'EPSG:3857'}
  });
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://student.ifip.tuwien.ac.at/geoserver/wfs', true);
  xhr.onload = function() {
    wmsLayer.getSource().updateParams({});
    alert('Thanks for your comment.');
  };
  xhr.send(new XMLSerializer().serializeToString(xml));
  e.preventDefault();
};
  
});

// Submit query to Nominatim and zoom map to the result's extent
var form = document.forms[0];
form.onsubmit = function(evt) {
  var url = 'http://nominatim.openstreetmap.org/search?format=json&q=';
  url += form.query.value;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function() {
    var result = JSON.parse(xhr.responseText);
    if (result.length > 0) {
      var bbox = result[0].boundingbox;
      olMap.getView().fitExtent(ol.proj.transform([parseFloat(bbox[2]),
          parseFloat(bbox[0]), parseFloat(bbox[3]), parseFloat(bbox[1])],
          'EPSG:4326', 'EPSG:3857'), olMap.getSize());
    }
  };
  xhr.send();
  evt.preventDefault();
};
view: new ol.View({
  center: ol.proj.transform([16.4, 48.2], 'EPSG:4326', 'EPSG:3857'),
  zoom: 11,
  maxZoom: 18
})

document.getElementById('haltestellen').onclick = function(e){
  if(this.checked==1){
    olMap.addLayer(haltestellen);
  }else{
    olMap.removeLayer(haltestellen);
  }
};

document.getElementById('bildung').onclick = function(e){
  if(this.checked==1){
    olMap.addLayer(bildung);
  }else{
    olMap.removeLayer(bildung);
  }
};

document.getElementById('markt').onclick = function(e){
  if(this.checked==1){
    olMap.addLayer(markt);
  }else{
    olMap.removeLayer(markt);
  }
};

document.getElementById('spielplatz').onclick = function(e){
  if(this.checked==1){
    olMap.addLayer(spielplatz);
  }else{
    olMap.removeLayer(spielplatz);
  }
};

document.getElementById('sportplatz').onclick = function(e){
  if(this.checked==1){
    olMap.addLayer(sportplatz);
  }else{
    olMap.removeLayer(sportplatz);
  }
};

document.getElementById('wlan').onclick = function(e){
  if(this.checked==1){
    olMap.addLayer(wlan);
  }else{
    olMap.removeLayer(wlan);
  }
};

document.getElementById('citybike').onclick = function(e){
  if(this.checked==1){
    olMap.addLayer(citybike);
  }else{
    olMap.removeLayer(citybike);
  }
};
