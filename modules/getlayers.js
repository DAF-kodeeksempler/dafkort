import xpath from 'xpath';
import {DOMParser as dom} from 'xmldom';
import 'whatwg-fetch';
 
export async function getlayers(url) {
    
  let response= await fetch(url) ; 
  let text= await response.text();

  var doc = new dom().parseFromString(text);
  var select = xpath.useNamespaces({"ns": "http://www.opengis.net/wms"});
  var nodes = select("//ns:Layer/ns:Layer/ns:Name/text()", doc)

  let layers= [];
  for (let i= 0; i<nodes.length; i++) {
    layers.push(nodes[i].toString());
  }

  layers= layers.sort();

  return layers;
}
