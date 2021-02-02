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

const map = new Map({
  target: 'map',
  layers: [kort.baggrundskortWMS, kort.baggrundskortWMTS],
  loadTilesWhileAnimating: true,
  view: kort.view, 
  controls: defaultControls().extend([
    new LayerSwitcher()
  ]),
});

geolocation.show(map);

// PWA stuff
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swfile= '/service-worker.js';
    navigator.serviceWorker.register(swfile)
      .then((reg) => {
        console.log('Service worker registered.', reg);
      })
      .catch(function (err) {
        console.log('Service Worker registration failed: ', err)
      });
  });
}
