/* eslint-disable no-console */
import 'ol/ol.css';
import 'ol-layerswitcher/src/ol-layerswitcher.css';
import 'ol-popup/src/ol-popup.css';
import './styles/style.css';
import 'babel-polyfill';
import 'whatwg-fetch';
import {Map} from 'ol';
import LayerSwitcher from 'ol-layerswitcher';
import {defaults as defaultControls} from 'ol/control';
import * as kort from '/modules/kort';
import * as geolocation from '/modules/geolocation';

var map;

async function main() {
  
  let url= new URL(window.location.href); 
  const query = url.searchParams;
  //console.log('hostparameter: ' + query.get('host'));

  await kort.init(query.get('host'));

  map = new Map({
    target: 'map',
    layers: [kort.wmsfikspunktdaf(), kort.wmsdagidaf(), kort.wmsdhmdaf(), kort.wmsgeodanmarkdaf(), kort.wmsmatrikeldaf(), kort.wmsstednavnedaf(),  kort.wmsdtk1000daf(), kort.wmsdtk500daf(), kort.wmsdtk250daf(), kort.wmsdtk25daf(), kort.wmtsortoforaar, kort.wmsortoforaardaf(), kort.wmtsskaermkort, kort.wmsskaermkortdaf()],
    loadTilesWhileAnimating: true,
    view: kort.view, 
    controls: defaultControls().extend([
      new LayerSwitcher()
    ]),
  });

  geolocation.show(map);
}

main();