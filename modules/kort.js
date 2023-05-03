
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

import xpath from 'xpath';
import {DOMParser} from 'xmldom';

proj4.defs('EPSG:25832', "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs");
register(proj4);
var dkProjection = getProjection('EPSG:25832');
dkProjection.setExtent([120000, 5661139.2, 1378291.2, 6500000]);

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
  if (platform === 'daf') {
    attribution=  '<p>Kort fra <a href="https://datafordeler.dk" target="_blank">Datafordeleren</a>.';
  }
  return attribution + ' <a href="https://github.com/DAF-kodeeksempler/dafkort">Koden</a>';
}
 
let dafusrpw = futil.getDatafordelerensUseridPw();

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
  return new Promise(async (resolved, rejected) => {
    let skrmurl= new URL(url + '?' + dafusrpw);
    skrmurl.searchParams.append('service','WMS');
    skrmurl.searchParams.append('request', 'GetCapabilities');
    const response= await fetch(skrmurl);
    if (response.ok) {
      const text= await response.text();

      var doc = new DOMParser().parseFromString(text);
      var select = xpath.useNamespaces({"ns": "http://www.opengis.net/wms"}); //WMS
      var nodes = select("//ns:Layer/ns:Layer/ns:Name/text()", doc)
    
      let layers= [];
      for (let i= 0; i<nodes.length; i++) {
        layers.push(nodes[i].toString());
      };
      resolved(layers);
    }
    else {
      rejected();
    }
  });
}

var wmsskaermkortlayers= [];
var wmsortoforaarlayers= [];
var wmsdtk25layers= [];
var wmsdtk250layers= [];
var wmsdtk500layers= [];
var wmsdtk1000layers= [];
var wmsstednavnelayers= [];
var wmsmatrikellayers= [];
var wmsgeodanmarklayers= [];
var wmsdhmlayers= [];
var wmsdagilayers= [];
var wmsfikspunktlayers= [];
var wmsdtk50layers= [];
var wmsdtk100layers= [];
var wmsdtk200layers= [];
var wmstopo4cm_1953_1976layers= [];
var wmshøjemålebordsbladelayers= [];
var wmslavemålebordsbladelayers= [];
var wmspreussiskemålebordsbladelayers= [];

var wmsskaermkorturl= 'https://services.datafordeler.dk/Dkskaermkort/topo_skaermkort/1.0.0/wms';
var wmsortoforaarurl= 'https://services.datafordeler.dk/GeoDanmarkOrto/orto_foraar/1.0.0/WMS';
var wmsdtk25url= 'https://services.datafordeler.dk/DKtopokort/dtk_25/1.0.0/WMS';
var wmsdtk250url= 'https://services.datafordeler.dk/DKtopokort/dtk_250/1.0.0/WMS';
var wmsdtk500url= 'https://services.datafordeler.dk/DKtopokort/dtk_500/1.0.0/WMS';
var wmsdtk1000url= 'https://services.datafordeler.dk/DKtopokort/dtk_1000/1.0.0/WMS';
var wmsstednavneurl= 'https://services.datafordeler.dk/STEDNAVN/Danske_Stednavne/1.0.0/WMS';
var wmsmatrikelurl= 'https://services.datafordeler.dk/Matrikel/MatrikelGaeldendeOgForeloebigWMS/1.0.0/WMS';
var wmsgeodanmarkurl='https://services.datafordeler.dk/GeoDanmarkVektor/GeoDanmark_60_NOHIST/1.0.0/WMS';
var wmsdhmurl= 'https://services.datafordeler.dk/DHMNedboer/dhm/1.0.0/WMS';
var wmsdagiurl= 'https://services.datafordeler.dk/DAGIM/dagi/1.0.0/WMS';
var wmsfikspunkturl= 'https://services.datafordeler.dk/FIKSPUNKT/FikspunktDK/1.0.0/WMS';
var wmsdtk50url= 'https://services.datafordeler.dk/DKtopokort/dtk_50/1.0.0/WMS';
var wmsdtk100url= 'https://services.datafordeler.dk/DKtopokort/dtk_100/1.0.0/WMS';
var wmsdtk200url= 'https://services.datafordeler.dk/DKtopokort/dtk_200/1.0.0/WMS';
var wmstopo4cm_1953_1976url= 'https://services.datafordeler.dk/DKTopografiskeKortvaerk/topo4cm_1953_1976/1.0.0/wms';
var wmshøjemålebordsbladeurl= 'https://services.datafordeler.dk/HoejeMaalebordsblade/topo20_hoeje_maalebordsblade/1.0.0/wms';
var wmslavemålebordsbladeurl= 'https://services.datafordeler.dk/LaveMaalebordsblade/topo20_lave_maalebordsblade/1.0.0/wms';
var wmspreussiskemålebordsbladeurl= 'https://services.datafordeler.dk/PreussiskeMaalebordsblade/topo25_preussen_maalebordsblade/1.0.0/wms';

var wmtsskaermkortgraaurl= "https://services.datafordeler.dk/DKskaermkort/topo_skaermkort_graa/1.0.0/wmts";
var wmtsskaermkortdaempeturl= "https://services.datafordeler.dk/DKskaermkort/topo_skaermkort_daempet/1.0.0/wmts";
var wmtsskaermkorturl= "https://services.datafordeler.dk/DKskaermkort/topo_skaermkort_wmts/1.0.0/wmts";
var wmtsortoforaarurl= "https://services.datafordeler.dk/GeoDanmarkOrto/orto_foraar_wmts/1.0.0/WMTS";

function skifthost(url,host) {
  let hurl= new URL(url);    
  hurl.host= host;
  return hurl.href;
}

export async function init() {

  const host= futil.gethost();
  if (host !== null) {
    wmsskaermkorturl= skifthost(wmsskaermkorturl,host); 
    wmsortoforaarurl= skifthost(wmsortoforaarurl,host); 
    wmsdtk25url= skifthost(wmsdtk25url,host); 
    wmsdtk250url= skifthost(wmsdtk250url,host); 
    wmsdtk500url= skifthost(wmsdtk500url,host); 
    wmsdtk1000url= skifthost(wmsdtk1000url,host); 
    wmsstednavneurl= skifthost(wmsstednavneurl,host); 
    wmsmatrikelurl= skifthost(wmsmatrikelurl,host); 
    wmsgeodanmarkurl= skifthost(wmsgeodanmarkurl,host); 
    wmsdhmurl= skifthost(wmsdhmurl,host); 
    wmsdagiurl= skifthost(wmsdagiurl,host); 
    wmsfikspunkturl= skifthost(wmsfikspunkturl,host); 
    wmtsskaermkortgraaurl= skifthost(wmtsskaermkortgraaurl,host); 
    wmtsskaermkortdaempeturl= skifthost(wmtsskaermkortdaempeturl,host); 
    wmtsskaermkorturl= skifthost(wmtsskaermkorturl,host); 
    wmtsortoforaarurl= skifthost(wmtsortoforaarurl,host); 
    wmsdtk50url= skifthost(wmsdtk50url,host); 
    wmsdtk100url= skifthost(wmsdtk100url,host); 
    wmsdtk200url= skifthost(wmsdtk200url,host); 
    wmstopo4cm_1953_1976url= skifthost(wmstopo4cm_1953_1976url,host); 
    wmshøjemålebordsbladeurl= skifthost(wmshøjemålebordsbladeurl,host); 
    wmslavemålebordsbladeurl= skifthost(wmslavemålebordsbladeurl,host); 
    wmspreussiskemålebordsbladeurl= skifthost(wmspreussiskemålebordsbladeurl,host); 
  }
  let services= [];
  services.push(getWMSlag(wmsskaermkorturl));
  services.push(getWMSlag(wmsortoforaarurl));
  services.push(getWMSlag(wmsdtk25url));
  services.push(getWMSlag(wmsdtk250url));
  services.push(getWMSlag(wmsdtk500url));
  services.push(getWMSlag(wmsdtk1000url));
  services.push(getWMSlag(wmsstednavneurl));
  services.push(getWMSlag(wmsmatrikelurl));
  services.push(getWMSlag(wmsgeodanmarkurl));
  services.push(getWMSlag(wmsdhmurl));
  services.push(getWMSlag(wmsdagiurl));
  services.push(getWMSlag(wmsfikspunkturl));
  services.push(getWMSlag(wmsdtk50url));
  services.push(getWMSlag(wmsdtk100url));
  services.push(getWMSlag(wmsdtk200url));
  services.push(getWMSlag(wmstopo4cm_1953_1976url));
  services.push(getWMSlag(wmshøjemålebordsbladeurl));
  services.push(getWMSlag(wmslavemålebordsbladeurl));
  services.push(getWMSlag(wmspreussiskemålebordsbladeurl));
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
  if (servicelag[11].status === "fulfilled") {
    wmsfikspunktlayers= servicelag[11].value;
  }
  if (servicelag[12].status === "fulfilled") {
    wmsdtk50layers= servicelag[12].value;
  }
  if (servicelag[13].status === "fulfilled") {
    wmsdtk100layers= servicelag[13].value;
  }
  if (servicelag[14].status === "fulfilled") {
    wmsdtk200layers= servicelag[14].value;
  }
  if (servicelag[15].status === "fulfilled") {
    wmstopo4cm_1953_1976layers= servicelag[15].value;
  }
  if (servicelag[16].status === "fulfilled") {
    wmshøjemålebordsbladelayers= servicelag[16].value;
  }
  if (servicelag[17].status === "fulfilled") {
    wmslavemålebordsbladelayers= servicelag[17].value;
  }
  if (servicelag[18].status === "fulfilled") {
    wmspreussiskemålebordsbladelayers= servicelag[18].value;
  }
}

export function wmsskaermkortdaf() { 
  return new LayerGroup({
    'title': 'WMS Skærmkort' + (wmsskaermkortlayers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmsskaermkortlayers, daflayertile, wmsskaermkorturl, "dtk_skaermkort")
  });
}

export function wmsortoforaardaf() {
  return new LayerGroup({
    'title': 'WMS Ortofoto forår' + (wmsortoforaarlayers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmsortoforaarlayers, daflayertile, wmsortoforaarurl)
  });
}

export function wmsdtk25daf() {
  return new LayerGroup({
    'title': 'WMS Danmarks Topografiske Kortværk 1:25.000' + (wmsdtk25layers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmsdtk25layers, daflayertile, wmsdtk25url)
  });
}

export function wmsdtk250daf() {
  return new LayerGroup({
    'title': 'WMS Danmarks Topografiske Kortværk 1:250.000' + (wmsdtk250layers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmsdtk250layers, daflayertile, wmsdtk250url)
  });
}

export function wmsdtk500daf()  {
  return new LayerGroup({
    'title': 'WMS Danmarks Topografiske Kortværk 1:500.000' + (wmsdtk500layers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmsdtk500layers, daflayertile, wmsdtk500url)
  });
}

export function wmsdtk1000daf() {
  return new LayerGroup({
    'title': 'WMS Danmarks Topografiske Kortværk 1:1000.000' + (wmsdtk1000layers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmsdtk1000layers, daflayertile, wmsdtk1000url)
  });
}

export function wmsstednavnedaf() {
  return new LayerGroup({
    'title': 'WMS Danske Stednavne' + (wmsstednavnelayers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmsstednavnelayers, dafimagelayer, wmsstednavneurl)
  });
}

export function wmsmatrikeldaf() {
  return new LayerGroup({
    'title': 'WMS Matriklen' + (wmsmatrikellayers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmsmatrikellayers, dafimagelayer, wmsmatrikelurl)
  });
}

export function wmsgeodanmarkdaf() {
  return new LayerGroup({
    'title': 'WMS GeoDanmark' + (wmsgeodanmarklayers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmsgeodanmarklayers, dafimagelayer, wmsgeodanmarkurl)
  });
}

export function wmsdhmdaf() {
    return new LayerGroup({
    'title': 'WMS Danmarks Højdemodel' + (wmsdhmlayers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmsdhmlayers, dafimagelayer, wmsdhmurl)
  });
}

export function wmsdagidaf() {
  return new LayerGroup({
    'title': 'WMS DAGI' + (wmsdagilayers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmsdagilayers, dafimagelayer, wmsdagiurl)
  });
}

export function wmsfikspunktdaf() {
  return new LayerGroup({
    'title': 'WMS Fikspunkt' + (wmsfikspunktlayers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmsfikspunktlayers, dafimagelayer, wmsfikspunkturl)
  });
}

export function wmsdtk50daf() {
  return new LayerGroup({
    'title': 'WMS Danmarks Topografiske Kortværk 1:50.000' + (wmsdtk50layers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmsdtk50layers, daflayertile, wmsdtk50url)
  });
}

export function wmsdtk100daf() {
  return new LayerGroup({
    'title': 'WMS Danmarks Topografiske Kortværk 1:100.000' + (wmsdtk100layers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmsdtk100layers, daflayertile, wmsdtk100url)
  });
}

export function wmsdtk200daf() {
  return new LayerGroup({
    'title': 'WMS Danmarks Topografiske Kortværk 1:200.000' + (wmsdtk200layers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmsdtk200layers, daflayertile, wmsdtk200url)
  });
}

export function wmstopo4cm_1953_1976daf() {
  return new LayerGroup({
    'title': 'WMS Danmarks Topografiske Kortværk Topo4cm_1953_1976' + (wmstopo4cm_1953_1976layers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmstopo4cm_1953_1976layers, daflayertile, wmstopo4cm_1953_1976url)
  });
}

export function wmshøjemålebordsbladedaf() {
  return new LayerGroup({
    'title': 'WMS Høje målebordsblade ' + (wmshøjemålebordsbladelayers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmshøjemålebordsbladelayers, daflayertile, wmshøjemålebordsbladeurl)
  });
}

export function wmslavemålebordsbladedaf() {
  return new LayerGroup({
    'title': 'WMS Lave målebordsblade' + (wmslavemålebordsbladelayers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmslavemålebordsbladelayers, daflayertile, wmslavemålebordsbladeurl)
  });
}

export function wmspreussiskemålebordsbladedaf() {
  return new LayerGroup({
    'title': 'WMS Preussiske målebordsblade ' + (wmspreussiskemålebordsbladelayers.length===0?' - FEJLER':''),
    'fold': 'close',
    layers: danlag(wmspreussiskemålebordsbladelayers, daflayertile, wmspreussiskemålebordsbladeurl)
  });
}

export var wmtsskaermkort = new LayerGroup({
  'title': 'WMTS Skærmkort',
  'fold': 'close',
  layers: [
    new LayerTile({
      //opacity: 1.0,
      title: 'Skærmkort - grå ',
      type: 'base',
      visible: false, 
      source: new WMTS({
        url: wmtsskaermkortgraaurl+"?"+dafusrpw,
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
      title: 'Skærmkort - dæmpet ',
      type: 'base',
      visible: false, 
      source: new WMTS({
        url: wmtsskaermkortdaempeturl+"?"+dafusrpw,
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
      title: 'Skærmkort ',
      type: 'base',
      visible: true, // by default this layer is visible
      source: new WMTS({
        url: wmtsskaermkorturl+"?" + dafusrpw,
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

export var wmtsortoforaar = new LayerGroup({
  'title': 'WMTS Ortofoto forår',
  'fold': 'close',
  layers: [
    new LayerTile({
      //opacity: 1.0,
      title: 'Ortofoto - forår ',
      type: 'base',
      visible: false, 
      source: new WMTS({
        url: wmtsortoforaarurl+"?"+dafusrpw,
        layer: "orto_foraar_wmts",
        matrixSet: "KortforsyningTilingDK",
        format: "image/jpeg",
        style: 'default',
        size: [256, 256],
        tileGrid: dfTileGrid,      
        attributions: getAttributions('daf')
      })
    })
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
