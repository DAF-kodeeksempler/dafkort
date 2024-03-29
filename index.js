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
  
  await kort.init();

  map = new Map({
    target: 'map',
    layers: [kort.wmspreussiskemålebordsbladedaf(), kort.wmslavemålebordsbladedaf(), kort.wmshøjemålebordsbladedaf(), kort.wmstopo4cm_1953_1976daf(), kort.wmsdtk200daf(), kort.wmsdtk100daf(), kort.wmsdtk50daf(), kort.wmsfikspunktdaf(), kort.wmsdagidaf(), kort.wmsdhmdaf(), kort.wmsgeodanmarkdaf(), kort.wmsmatrikeldaf(), kort.wmsstednavnedaf(),  kort.wmsdtk1000daf(), kort.wmsdtk500daf(), kort.wmsdtk250daf(), kort.wmsdtk25daf(), kort.wmtsortoforaar, kort.wmsortoforaardaf(), kort.wmtsskaermkort, kort.wmsskaermkortdaf()],
    loadTilesWhileAnimating: true,
    view: kort.view, 
    controls: defaultControls().extend([
      new LayerSwitcher()
    ]),
  });

  geolocation.show(map);
}

main();