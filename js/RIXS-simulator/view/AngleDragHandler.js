// Copyright 2014-2019, University of Colorado Boulder

/**
 * Drag handler for manipulating orientation of an image node.
 *
 * @author Todd Holden (Queensborough Community College of CUNY)
 * @author Modified from MoleculeAngleDragHandler by Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import SimpleDragHandler from '../../../../scenery/js/input/SimpleDragHandler.js';
import Vector2 from '../../../../dot/js/Vector2.js';

  /**
   * @param {Node} ImageNode
   * @param {Node} relativeNode - angles are computed relative to this Node
   * @constructor
   */
  function AngleDragHandler( ImageNode, rotationCenter, modelangleP ) {

    const r = new Vector2(ImageNode.centerX - rotationCenter.x, ImageNode.centerY - rotationCenter.y ).magnitude;
    let previousAngle = 0; // angle between the pointer and the ImageNode when the drag started

    /**
     * Gets the angle of the pointer relative to relativeNode.
     * @param {Event} event
     * @returns {number} angle in radians
     */
    const getAngle = function( event ) {
      const point = (ImageNode.globalToParentPoint( event.pointer.point ) );
      return new Vector2( point.x - rotationCenter.x, point.y - rotationCenter.y ).angle;
    };

    SimpleDragHandler.call( this, {

      allowTouchSnag: true,

      start: function( event ) {
        //ImageNode.dragging = true;
        previousAngle = getAngle( event );
      },

      drag: function( event ) {
        const currentAngle = getAngle( event );
        ImageNode.rotation = ImageNode.rotation + currentAngle - previousAngle ;
        ImageNode.centerX = rotationCenter.x - r * Math.sin(ImageNode.rotation);
        ImageNode.centerY = rotationCenter.y + r * Math.cos(ImageNode.rotation);
        modelangleP.value = modelangleP.value - currentAngle + previousAngle ;
        if ( modelangleP.value < 0 ) { modelangleP.value += 2 * Math.PI; }
        else if ( modelangleP.value > 2 * Math.PI ) { modelangleP.value -= 2 * Math.PI; }
  //      console.log(ImageNode.centerX, ImageNode.centerY, r, modelangleP.value*180/Math.PI);
        previousAngle = currentAngle ;
      },

      end: function( event ) {
        ImageNode.dragging = false;
      }
    } );
  }

  //moleculePolarity.register( 'AngleDragHandler', AngleDragHandler );

  inherit( SimpleDragHandler, AngleDragHandler );
  export default AngleDragHandler;