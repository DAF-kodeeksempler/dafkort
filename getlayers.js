const xpath = require('xpath')
  , dom = require('xmldom').DOMParser
  , fetch = require('node-fetch')
  , fs = require('fs');
 
async function main() {
    
    let response= await fetch('https://services.datafordeler.dk/DAGIM/dagi/1.0.0/WMS?service=WMS&version=1.3.0&request=GetCapabilities&username=KEXVKJDPAA&password=DAFTest777!')
    let text= await response.text();

    var doc = new dom().parseFromString(text);
    //var select = xpath.useNamespaces({"ns": "http://www.opengis.net/wmts/1.0"}); //WMS
    var select = xpath.useNamespaces({"ns": "http://www.opengis.net/wms"}); //WMS
    var nodes = select("//ns:Layer/ns:Layer/ns:Name/text()", doc)
  
    let layers= [];
    for (let i= 0; i<nodes.length; i++) {
      layers.push(nodes[i].toString());
    }
  
    layers= layers.sort();

    let layertekst= JSON.stringify(layers);
    fs.writeFileSync('WMTSdagilayers.js',layertekst);


}

main();