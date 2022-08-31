
import { View } from 'ol';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { get as getProjection } from 'ol/proj';
import LayerTile from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import LayerGroup from 'ol/layer/Group';
import TileWMS from 'ol/source/TileWMS';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import * as futil from '/modules/futil';
//import {wmsskaermkortlayers} from '/layers/WMSskaermkortlayers.js';
// import {wmsdtk25layers} from '/layers/WMSdtk25layers.js';
// import {wmsdtk250layers} from '/layers/WMSdtk250layers.js';
// import {wmsdtk500layers} from '/layers/WMSdtk500layers.js';
// import {wmsdtk1000layers} from '/layers/WMSdtk1000layers.js';
// import {wmsstednavnelayers} from '/layers/WMSstednavnelayers.js';
// import {wmsmatrikellayers} from '/layers/WMSmatrikellayers.js';
// import {wmsgeodanmarklayers} from '/layers/WMSgeodanmarklayers.js';
// import {wmsdhmlayers} from '/layers/WMSdhmlayers.js';
//import {wmsortoforaarlayers} from '/layers/WMSortoforaarlayers.js';
// import {wmsdagilayers} from '/layers/WMSdagilayers.js';

import xpath from 'xpath';
import {DOMParser} from 'xmldom';

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
  return attribution + ' <a href="https://github.com/DAF-kodeeksempler/dafkort">Koden</a>';
}
 
let dafusrpw = futil.getDatafordelerensUseridPw();

function credentials(searchParams) { 
  searchParams.append('username',process.env.dafusername);
  searchParams.append('password', process.env.dafpassword); 
}

function daflayertile(url, layer, synligtlag) {
  return new LayerTile({  
    title: layer,    
    type: 'base',
    visible: (synligtlag!==undefined) && (layer.localeCompare(synligtlag)===0), 
    source: new TileWMS({       
      url: url,
      params: {
        'LAYERS':layer,
        'VERSION':'1.1.1',
        'TRANSPARENT':'FALSE',
        'FORMAT': "image/png",
        'STYLES':'' 
      },      
      attributions: getAttributions('daf')
    })
  }); 
}

function dafimagelayer(url, layer) {
  return new ImageLayer({  
    title:layer,    
    type:'overlay',
    visible: false,
    opacity: 1.0,
    zIndex:1000, 
    source: new ImageWMS({       
      url: url,
      params: {
        'LAYERS':layer,
        'VERSION':'1.1.1',
        'TRANSPARENT':'TRUE',
        'FORMAT': "image/png",
        'STYLES':'' 
      },      
      attributions: getAttributions('daf')
    })
  })
} 

function danlag(lagnavne, lagfunktion, url, synligtlag) {
  let layers = [];
  for (let i = lagnavne.length-1; i >= 0; i--) {
    layers.push(lagfunktion(url + '?' + dafusrpw, lagnavne[i], synligtlag));
  }
  return layers;
}

async function getWMSlag(url) {  
  return new Promise(async resolved => {
    let skrmurl= new URL(url);
    credentials(skrmurl.searchParams);
    skrmurl.searchParams.append('service','WMS');
    skrmurl.searchParams.append('request', 'GetCapabilities');
    const response= await fetch(skrmurl);
    const text= await response.text();

    var doc = new DOMParser().parseFromString(text);
    var select = xpath.useNamespaces({"ns": "http://www.opengis.net/wms"}); //WMS
    var nodes = select("//ns:Layer/ns:Layer/ns:Name/text()", doc)
  
    let layers= [];
    for (let i= 0; i<nodes.length; i++) {
      layers.push(nodes[i].toString());
    };
    resolved(layers);
  });
}

var wmsskaermkortlayers= [];
var wmsortoforaarlayers= [];
var wmsdtk25layers= [];
var wmsdagilayers= [];
var wmsdhmlayers= [];
var wmsgeodanmarklayers= [];
var wmsmatrikellayers= [];
var wmsstednavnelayers= [];
var wmsdtk1000layers= [];
var wmsdtk500layers= [];
var wmsdtk250layers= [];
var wmsdtk25layers= [];
export async function init() {
  let services= [];
  services.push(getWMSlag('https://services.datafordeler.dk/Dkskaermkort/topo_skaermkort/1.0.0/wms'));
  services.push(getWMSlag('https://services.datafordeler.dk/GeoDanmarkOrto/orto_foraar/1.0.0/WMS'));
  services.push(getWMSlag('https://services.datafordeler.dk/DKtopokort/dtk_25/1.0.0/WMS'));
  services.push(getWMSlag('https://services.datafordeler.dk/DKtopokort/dtk_250/1.0.0/WMS'));
  services.push(getWMSlag('https://services.datafordeler.dk/DKtopokort/dtk_500/1.0.0/WMS'));
  services.push(getWMSlag('https://services.datafordeler.dk/DKtopokort/dtk_1000/1.0.0/WMS'));
  services.push(getWMSlag('https://services.datafordeler.dk/STEDNAVN/Danske_Stednavne/1.0.0/WMS'));
  services.push(getWMSlag('https://services.datafordeler.dk/Matrikel/MatrikelGaeldendeOgForeloebigWMS/1.0.0/WMS'));
  services.push(getWMSlag('https://services.datafordeler.dk/GeoDanmarkVektor/GeoDanmark_60_NOHIST/1.0.0/WMS'));
  services.push(getWMSlag('https://services.datafordeler.dk/DHMNedboer/dhm/1.0.0/WMS'));
  services.push(getWMSlag('https://services.datafordeler.dk/DAGIM/dagi/1.0.0/WMS'));
  let servicelag= await Promise.allSettled(services);
  if (servicelag[0].status === "fulfilled") {
    wmsskaermkortlayers= servicelag[0].value;
  }
  if (servicelag[1].status === "fulfilled") {
    wmsortoforaarlayers= servicelag[1].value;
  }
  if (servicelag[2].status === "fulfilled") {
    wmsdtk25layers= servicelag[2].value;
  }
  if (servicelag[3].status === "fulfilled") {
    wmsdtk250layers= servicelag[3].value;
  }
  if (servicelag[4].status === "fulfilled") {
    wmsdtk500layers= servicelag[4].value;
  }
  if (servicelag[5].status === "fulfilled") {
    wmsdtk1000layers= servicelag[5].value;
  }
  if (servicelag[6].status === "fulfilled") {
    wmsstednavnelayers= servicelag[6].value;
  }
  if (servicelag[7].status === "fulfilled") {
    wmsmatrikellayers= servicelag[7].value;
  }
  if (servicelag[8].status === "fulfilled") {
    wmsgeodanmarklayers= servicelag[8].value;
  }
  if (servicelag[9].status === "fulfilled") {
    wmsdhmlayers= servicelag[9].value;
  }
  if (servicelag[10].status === "fulfilled") {
    wmsdagilayers= servicelag[10].value;
  }
}

export function wmsskaermkortdaf() { 
  return new LayerGroup({
    'title': 'WMS Skærmkort - DAF',
    'fold': 'close',
    layers: danlag(wmsskaermkortlayers, daflayertile, 'https://services.datafordeler.dk/Dkskaermkort/topo_skaermkort/1.0.0/wms', "dtk_skaermkort")
  });
}

export function wmsortoforaardaf() {
  return new LayerGroup({
    'title': 'WMS Ortofoto forår - DAF',
    'fold': 'close',
    layers: danlag(wmsortoforaarlayers, daflayertile, 'https://services.datafordeler.dk/GeoDanmarkOrto/orto_foraar/1.0.0/WMS')
  });
}

export function wmsdtk25daf() {
  return new LayerGroup({
    'title': 'WMS Danmarks Topografiske Kortværk 1:25.000 - DAF',
    'fold': 'close',
    layers: danlag(wmsdtk25layers, daflayertile, 'https://services.datafordeler.dk/DKtopokort/dtk_25/1.0.0/WMS')
  });
}

export function wmsdtk250daf() {
  return new LayerGroup({
    'title': 'WMS Danmarks Topografiske Kortværk 1:250.000 - DAF',
    'fold': 'close',
    layers: danlag(wmsdtk250layers, daflayertile, 'https://services.datafordeler.dk/DKtopokort/dtk_250/1.0.0/WMS')
  });
}

export function wmsdtk500daf()  {
  return new LayerGroup({
    'title': 'WMS Danmarks Topografiske Kortværk 1:500.000 - DAF',
    'fold': 'close',
    layers: danlag(wmsdtk500layers, daflayertile, 'https://services.datafordeler.dk/DKtopokort/dtk_500/1.0.0/WMS')
  });
}

export function wmsdtk1000daf() {
  return new LayerGroup({
    'title': 'WMS Danmarks Topografiske Kortværk 1:1000.000 - DAF',
    'fold': 'close',
    layers: danlag(wmsdtk1000layers, daflayertile, 'https://services.datafordeler.dk/DKtopokort/dtk_1000/1.0.0/WMS')
  });
}

export function wmsstednavnedaf() {
  return new LayerGroup({
    'title': 'WMS Danske Stednavne - DAF',
    'fold': 'close',
    layers: danlag(wmsstednavnelayers, dafimagelayer, 'https://services.datafordeler.dk/STEDNAVN/Danske_Stednavne/1.0.0/WMS')
  });
}

export function wmsmatrikeldaf() {
  return new LayerGroup({
    'title': 'WMS Matriklen - DAF',
    'fold': 'close',
    layers: danlag(wmsmatrikellayers, dafimagelayer, 'https://services.datafordeler.dk/Matrikel/MatrikelGaeldendeOgForeloebigWMS/1.0.0/WMS')
  });
}

export function wmsgeodanmarkdaf() {
  return new LayerGroup({
    'title': 'WMS GeoDanmark - DAF',
    'fold': 'close',
    layers: danlag(wmsgeodanmarklayers, dafimagelayer, 'https://services.datafordeler.dk/GeoDanmarkVektor/GeoDanmark_60_NOHIST/1.0.0/WMS')
  });
}

export function wmsdhmdaf() {
    return new LayerGroup({
    'title': 'WMS Danmarks Højdemodel - DAF',
    'fold': 'close',
    layers: danlag(wmsdhmlayers, dafimagelayer, 'https://services.datafordeler.dk/DHMNedboer/dhm/1.0.0/WMS')
  });
}

export function wmsdagidaf() {
  return new LayerGroup({
    'title': 'WMS DAGI - DAF',
    'fold': 'close',
    layers: danlag(wmsdagilayers, dafimagelayer, 'https://services.datafordeler.dk/DAGIM/dagi/1.0.0/WMS')
  });
}



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
