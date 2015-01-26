$("zuruck").function() {       
  var geolocation = new ol.Geolocation({
    projection: 'EPSG:3857'
  });
  geolocation.setTracking(true);
  geolocation.on('change:position', function() {
  geolocation.setTracking(false);
  map.getView().setCenter(geolocation.getPosition());
  marker.setGeometry(new ol.geom.Point(map.getView().getCenter()));
  });
}     
var marker = new ol.Feature();        
// Karte
var osmLayer = new ol.layer.Tile({source: new ol.source.OSM()});
var wmsLayer = new ol.layer.Image({
  source: new ol.source.ImageWMS({
    url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
    params: {'LAYERS': 'g10_2014:normalized_data_vie,g10_2014:comments'}
  }),
  opacity: 0.6
});
var markerLayer = new ol.layer.Vector({
      source: new ol.source.Vector ({
            features: [marker]
      }),
      style: new ol.style.Style({
            image: new ol.style.Icon(({
              src: 'http://student.ifip.tuwien.ac.at/geoweb/2014/g10/website_g10/red.png'
            }))
      })
})
var olMap = new ol.Map({
  target: 'map',
  layers: [osmLayer, wmsLayer, markerLayer],
  view: new ol.View({
  center: ol.proj.transform([16.4, 48.2], 'EPSG:4326', 'EPSG:3857'),
  zoom: 11,
  maxZoom: 18
})
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










// !TUTORIAL #1

// TUTORIAL #2
// Load variables into dropdown

// Submit query to Nominatim and zoom map to the result's extent
var form = document.forms[0];
form.onsubmit = function(searching) {
  var iadrr = 'http://nominatim.openstreetmap.org/search?format=json&q=';
  iadrr += form.query.value;
  var yhr = new XMLHttpRequest();
  yhr.open("GET", iadrr, true);
  yhr.onload = function() {
    var erg = JSON.parse(yhr.responseText);
    if (erg.length > 0) {
      var bbox = erg[0].boundingbox;
      olMap.getView().fitExtent(ol.proj.transform([parseFloat(bbox[2]),
          parseFloat(bbox[0]), parseFloat(bbox[3]), parseFloat(bbox[1])],
          'EPSG:4326', 'EPSG:3857'), olMap.getSize());
          marker.setGeometry(new ol.geom.Point(olMap.getView().getCenter()));
    }
     
  };
  yhr.send();
  searching.preventDefault();
};


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
