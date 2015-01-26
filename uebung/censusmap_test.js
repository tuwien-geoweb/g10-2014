var marker = new ol.Feature();
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
