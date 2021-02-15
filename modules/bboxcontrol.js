
import {Control} from 'ol/control';
import {DragBox, Draw, Modify, Snap} from 'ol/interaction';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {getBottomLeft, getTopLeft, getTopRight} from 'ol/extent';

export var BBOXControl = (function (Control) {
  var popup;
  function BBOXControl(opt_options) {
    var options = opt_options || {};
    popup= options.popup;

    var button = document.createElement('button');
    button.innerHTML = 'B';

    var element = document.createElement('div');
    element.className = 'bboxcontrol ol-unselectable ol-control';
    element.appendChild(button);

    Control.call(this, {
      element: element,
      target: options.target
    });

    button.addEventListener('click', this.tegnBBOX.bind(this), false);
  }

  if ( Control ) BBOXControl.__proto__ = Control;
  BBOXControl.prototype = Object.create( Control && Control.prototype );
  BBOXControl.prototype.constructor = BBOXControl;

  BBOXControl.prototype.tegnBBOX = async function tegnBBOX () {
    var dragBox = new DragBox();
    dragBox.once('boxend', function () {
      var extent = dragBox.getGeometry().getExtent();
      let bl= getBottomLeft(extent);
      let tr= getTopRight(extent);
      //alert('boxend' + tl + ' - ' + br); 
      let tekst= 'Vest=' + bl[0] + '&Syd=' + bl[1] + '&Oest=' + tr[0] + '&Nord=' + tr[1];
      popup.show(bl, tekst); 
      navigator.permissions.query({name: "clipboard-write"}).then(result => {
        if (result.state == "granted" || result.state == "prompt") {
          navigator.clipboard.writeText(tekst);
        }
      });      
      this.getMap().removeInteraction(dragBox);
    });
    dragBox.on('boxstart', function () {
      //alert('boxstart');
    });
    this.getMap().addInteraction(dragBox);
  }

  return BBOXControl;
}(Control));