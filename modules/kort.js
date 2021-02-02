
import { View } from 'ol';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { get as getProjection } from 'ol/proj';
import LayerTile from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import LayerGroup from 'ol/layer/Group';
import TileWMS from 'ol/source/TileWMS';
import ImageWMS from 'ol/source/ImageWMS';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import * as futil from '/modules/futil';
import { optionsFromCapabilities } from 'ol/source/WMTS';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';

proj4.defs('EPSG:25832', "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs");
register(proj4);
var dkProjection = getProjection('EPSG:25832');
dkProjection.setExtent([120000, 5661139.2, 1378291.2, 6500000]);

var kfTileGrid = new WMTSTileGrid({
  extent: [120000, 5661139.2, 1378291.2, 6500000],
  resolutions: [1638.4, 819.2, 409.6, 204.8, 102.4, 51.2, 25.6, 12.8, 6.4, 3.2, 1.6, 0.8, 0.4, 0.2],
  matrixIds: ['L00', 'L01', 'L02', 'L03', 'L04', 'L05', 'L06', 'L07', 'L08', 'L09', 'L10', 'L11', 'L12', 'L13'],
});

const dfTileGrid = new WMTSTileGrid({
  extent: [120000, 5900000, 1000000, 6500000],
  resolutions: [1638.4, 819.2, 409.6, 204.8, 102.4, 51.2, 25.6, 12.8, 6.4, 3.2, 1.6, 0.8, 0.4, 0.2],
  matrixIds: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13']
})

export const view = new View({
  minZoom: 2,
  maxZoom: 13,
  center: [654500, 6176450], // start center position
  zoom: 13, // start zoom level
  resolutions: [1638.4, 819.2, 409.6, 204.8, 102.4, 51.2, 25.6, 12.8, 6.4, 3.2, 1.6, 0.8, 0.4, 0.2, 0.1], // Equal to WMTS resolutions with three more detailed levels
  projection: dkProjection // use our custom projection defined earlier
})

function getAttributions(platform) {
  let attribution= 'Ukendt platorm';
  if (platform === 'kf') {
    attribution= '<p>Kort fra <a href="https://kortforsyningen.dk" target="_blank">Kortforsyningen</a>.';
  }
  else if (platform === 'daf') {
    attribution=  '<p>Kort fra <a href="https://datafordeler.dk" target="_blank">Datafordeleren</a>.';
  }
  return attribution;
}

let kftoken = futil.getKortforsyningstoken(); 
let dafusrpw = futil.getDatafordelerensUseridPw(); 

export var baggrundskortWMTS = new LayerGroup({
  'title': 'Baggrundskort - WMTS',
  'fold': 'open',
  layers: [
    new LayerTile({
      //opacity: 1.0,
      title: 'Ortofoto - forår (KF)',
      type: 'base',
      visible: false, 
      source: new WMTS({
        url: "https://services.kortforsyningen.dk/orto_foraar?token=" + kftoken,
        layer: "orto_foraar",
        matrixSet: "View1",
        format: "image/jpeg",
        tileGrid: kfTileGrid,
        style: 'default',
        size: [256, 256],
        attributions: getAttributions('kf')
      })
    }),
    new LayerTile({
      //opacity: 1.0,
      title: 'Ortofoto - forår (DAF)',
      type: 'base',
      visible: false, 
      source: new WMTS({
        url: "https://services.datafordeler.dk/GeoDanmarkOrto/orto_foraar_wmts/1.0.0/WMTS?"+dafusrpw,
        layer: "orto_foraar_wmts",
        matrixSet: "KortforsyningTilingDK",
        format: "image/jpeg",
        style: 'default',
        size: [256, 256],
        tileGrid: dfTileGrid,      
        attributions: getAttributions('daf')
      })
    }),
    new LayerTile({
      //opacity: 1.0,
      title: 'Skærmkort - grå (KF)',
      type: 'base',
      visible: false, 
      source: new WMTS({
        url: "https://services.kortforsyningen.dk/topo_skaermkort_graa?token=" + kftoken,
        layer: "dtk_skaermkort_graa",
        matrixSet: "View1",
        format: "image/jpeg",
        tileGrid: kfTileGrid,
        style: 'default',
        size: [256, 256],
        attributions: getAttributions('kf')
      })
    }),
    new LayerTile({
      //opacity: 1.0,
      title: 'Skærmkort - grå (DAF)',
      type: 'base',
      visible: false, 
      source: new WMTS({
        url: "https://services.datafordeler.dk/DKskaermkort/topo_skaermkort_graa/1.0.0/wmts?"+dafusrpw,
        layer: "topo_skaermkort_graa",
        matrixSet: "View1",
        format: "image/jpeg",
        style: 'default',
        size: [256, 256],
        tileGrid: dfTileGrid,      
        attributions: getAttributions('daf')
      })
    }),
    new LayerTile({
      //opacity: 1.0,
      title: 'Skærmkort - dæmpet (KF)',
      type: 'base',
      visible: false, 
      source: new WMTS({
        url: "https://services.kortforsyningen.dk/topo_skaermkort_daempet?token=" + kftoken,
        layer: "dtk_skaermkort_daempet",
        matrixSet: "View1",
        format: "image/jpeg",
        tileGrid: kfTileGrid,
        style: 'default',
        size: [256, 256],
        attributions: getAttributions('kf')
      })
    }),
    new LayerTile({
      //opacity: 1.0,
      title: 'Skærmkort - dæmpet (DAF)',
      type: 'base',
      visible: false, 
      source: new WMTS({
        url: "https://services.datafordeler.dk/DKskaermkort/topo_skaermkort_daempet/1.0.0/wmts?"+dafusrpw,
        layer: "topo_skaermkort_daempet",
        matrixSet: "View1",
        format: "image/jpeg",
        style: 'default',
        size: [256, 256],
        tileGrid: dfTileGrid,      
        attributions: getAttributions('daf')
      })
    }),
    new LayerTile({
      //opacity: 1.0,
      title: 'Skærmkort (KF)',
      type: 'base',
      visible: false, 
      source: new WMTS({
        url: "https://services.kortforsyningen.dk/topo_skaermkort?token=" + kftoken,
        layer: "dtk_skaermkort",
        matrixSet: "View1",
        format: "image/jpeg",
        tileGrid: kfTileGrid,
        style: 'default',
        size: [256, 256],
        attributions: getAttributions('kf')
      })
    }),
    new LayerTile({
      //opacity: 1.0,
      title: 'Skærmkort (DAF)',
      type: 'base',
      visible: true, // by default this layer is visible
      source: new WMTS({
        url: "https://services.datafordeler.dk/Dkskaermkort/topo_skaermkort_wmts/1.0.0/wmts?" + dafusrpw,
        layer: "topo_skaermkort",
        matrixSet: "View1",
        format: "image/jpeg",
        style: 'default',
        size: [256, 256],
        tileGrid: dfTileGrid,      
        attributions: getAttributions('daf')
      })
    })
  ]
});


export var baggrundskortWMS = new LayerGroup({
  'title': 'Baggrundskort - WMS',
  'fold': 'open',
  layers: [
    new LayerTile({  
      title:'Skærmkort - grå (KF)',    
      type:'base',
      visible: false, 
      source: new TileWMS({       
        url: 'https://services.kortforsyningen.dk/topo_skaermkort?token='+kftoken,
        params: {
          'LAYERS':'dtk_skaermkort_graa',
          'VERSION':'1.1.1',
          'TRANSPARENT':'false',
          'FORMAT': "image/png",
          'STYLES':'' 
        },      
        attributions: getAttributions('kf')
      })
    }), 
    new LayerTile({  
      title:'Skærmkort - grå (DAF)',    
      type:'base',
      visible: false, 
      source: new TileWMS({       
        url: 'https://services.datafordeler.dk/Dkskaermkort/topo_skaermkort/1.0.0/wms?'+dafusrpw,
        params: {
          'LAYERS':'dtk_skaermkort_graa',
          'VERSION':'1.1.1',
          'TRANSPARENT':'FALSE',
          'FORMAT': "image/png",
          'STYLES':'' 
        },      
        attributions: getAttributions('daf')
      })
    }), 
    new LayerTile({  
      title:'Skærmkort - dæmpet(KF)',    
      type:'base',
      visible: false, 
      source: new TileWMS({       
        url: 'https://services.kortforsyningen.dk/topo_skaermkort?token='+kftoken,
        params: {
          'LAYERS':'dtk_skaermkort_daempet',
          'VERSION':'1.1.1',
          'TRANSPARENT':'false',
          'FORMAT': "image/png",
          'STYLES':'' 
        },      
        attributions: getAttributions('kf')
      })
    }), 
    new LayerTile({  
      title:'Skærmkort - dæmpet (DAF)',    
      type:'base',
      visible: false, 
      source: new TileWMS({       
        url: 'https://services.datafordeler.dk/Dkskaermkort/topo_skaermkort/1.0.0/wms?'+dafusrpw,
        params: {
          'LAYERS':'dtk_skaermkort_daempet',
          'VERSION':'1.1.1',
          'TRANSPARENT':'FALSE',
          'FORMAT': "image/png",
          'STYLES':'' 
        },      
        attributions: getAttributions('daf')
      })
    }), 
    new LayerTile({  
      title:'Skærmkort (KF)',    
      type:'base',
      visible: false, 
      source: new TileWMS({       
        url: 'https://services.kortforsyningen.dk/topo_skaermkort?token='+kftoken,
        params: {
          'LAYERS':'dtk_skaermkort',
          'VERSION':'1.1.1',
          'TRANSPARENT':'false',
          'FORMAT': "image/png",
          'STYLES':'' 
        },      
        attributions: getAttributions('kf')
      })
    }), 
    new LayerTile({  
      title:'Skærmkort (DAF)',    
      type:'base',
      visible: false, 
      source: new TileWMS({       
        url: 'https://services.datafordeler.dk/Dkskaermkort/topo_skaermkort/1.0.0/wms?'+dafusrpw,
        params: {
          'LAYERS':'dtk_skaermkort',
          'VERSION':'1.1.1',
          'TRANSPARENT':'FALSE',
          'FORMAT': "image/png",
          'STYLES':'' 
        },      
        attributions: getAttributions('daf')
      })
    }), 
  ]
});


function beregnAfstand(location1, location2) {
  let l = Math.sqrt(Math.pow(location1[0] - location2[0], 2) + Math.pow(location1[0] - location2[0], 2));
  return l;
}

function beregnZoomniveau(afstand, zoom) {
  let z = 3;
  if (afstand < 1000) z = 13;
  else if (afstand < 1500) z = 12;
  else if (afstand < 2000) z = 11;
  else if (afstand < 5000) z = 10;
  else if (afstand < 9000) z = 9;
  else if (afstand < 11000) z = 8;
  else if (afstand < 13000) z = 7;
  else if (afstand < 50000) z = 6;
  else if (afstand < 75000) z = 5;
  else if (afstand < 100000) z = 4;
  return (z > zoom) ? zoom : z;
}

function beregnVarighed(afstand) {
  let v = 4000;
  if (afstand < 500) v = 1000;
  else if (afstand < 2500) v = 1500;
  else if (afstand < 5000) v = 1750;
  else if (afstand < 7500) v = 2000;
  else if (afstand < 10000) v = 2500;
  else if (afstand < 12500) v = 3000;
  else if (afstand < 15000) v = 3500;
  return v;
}

export function flyTo(location, view, done) {
  let afstand = beregnAfstand(location, view.getCenter());
  var duration = beregnVarighed(afstand);
  var zoom = view.getZoom();
  //console.log('Afstand: ' + afstand + 'Zoom start: ' + zoom);
  var parts = 2;
  var called = false;
  function callback(complete) {
    --parts;
    if (called) {
      return;
    }
    if (parts === 0 || !complete) {
      called = true;
      done(complete);
    }
  }
  view.animate({
    center: location,
    duration: duration
  }, callback);
  view.animate({
    zoom: beregnZoomniveau(afstand, zoom),
    duration: duration / 2
  }, {
    zoom: zoom,
    duration: duration / 2
  }, callback);
}

export function flyToGeometry(location, geometry, view, done) {
  let afstand = location ? beregnAfstand(location, view.getCenter()) : 1000;
  var duration = beregnVarighed(afstand);
  var zoom = view.getZoom();
  //console.log('Afstand: ' + afstand + 'Zoom start: ' + zoom);
  function callback() {
    view.fit(geometry, { 'duration': duration / 2 });
    done(true);
  }
  if (location) {
    view.animate({
      center: location,
      duration: duration
    });
  }
  view.animate({
    zoom: beregnZoomniveau(afstand, zoom),
    duration: duration / 2
  }, callback);
}
