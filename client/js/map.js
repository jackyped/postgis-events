var maxFeatures = 100; //Maximum number of features to render at once

var editSource = new ol.source.GeoJSON({
  features: []
});

var edit = new ol.layer.Vector({
	source: editSource//,
});


var baseMap = new ol.layer.Tile({
  source: new ol.source.MapQuest({layer: 'sat'})
});

var map = new ol.Map({
  target: 'map',
  layers: [	baseMap ],
  view: new ol.View({
    center: ol.proj.transform([-77.0, 39.0], 'EPSG:4326', 'EPSG:3857'),
    zoom: 4
  })
});

map.addLayer(edit);

function updateFeatures (msg) {
  var geoJson = msg.st_asgeojson;
	var geoJsonFormat = new ol.format.GeoJSON({
	  defaultProjection: 'EPSG:4326'
	});
	var geomWGS84 = geoJsonFormat.readGeometry(geoJson);
	var geom = geomWGS84.transform('EPSG:4326','EPSG:3857');
 	var feature = new ol.Feature({
	  geometry: geom
	});
	if (editSource.getFeatures().length > maxFeatures) {
	  var lastFeature = editSource.getFeatures()[0];
		editSource.removeFeature(lastFeature);
	}
	editSource.addFeature(feature);
}
