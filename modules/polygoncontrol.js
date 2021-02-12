
import {Control} from 'ol/control';
import {DragBox, Draw, Modify, Snap} from 'ol/interaction';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {getBottomLeft, getTopLeft, getBottomRight} from 'ol/extent';

export var PolygonControl = (function (Control) {
  var popup;
  function PolygonControl(opt_options) {
    var options = opt_options || {};
    popup= options.popup;

    var button = document.createElement('button');
    button.innerHTML = 'B';

    var element = document.createElement('div');
    element.className = 'polygoncontrol ol-unselectable ol-control';
    element.appendChild(button);

    Control.call(this, {
      element: element,
      target: options.target
    });

    button.addEventListener('click', this.tegnPolygon.bind(this), false);
  }

  if ( Control ) PolygonControl.__proto__ = Control;
  PolygonControl.prototype = Object.create( Control && Control.prototype );
  PolygonControl.prototype.constructor = PolygonControl;

  PolygonControl.prototype.tegnPolygon = async function tegnPolygon () {
    var dragBox = new DragBox();
    dragBox.once('boxend', function () {
      var extent = dragBox.getGeometry().getExtent();
      let tl= getTopLeft(extent);
      let br= getBottomRight(extent);
      //alert('boxend' + tl + ' - ' + br); 
      popup.show(br, JSON.stringify(tl) + ' - ' + JSON.stringify(br)); 
      navigator.permissions.query({name: "clipboard-write"}).then(result => {
        if (result.state == "granted" || result.state == "prompt") {
          navigator.clipboard.writeText(JSON.stringify(tl) + ' - ' + JSON.stringify(br));
        }
      });      
      this.getMap().removeInteraction(dragBox);
    });
    dragBox.on('boxstart', function () {
      //alert('boxstart');
    });
    this.getMap().addInteraction(dragBox);
  }

  return PolygonControl;
}(Control));