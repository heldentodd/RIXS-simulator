// Copyright 2014-2019, University of Colorado Boulder

/**
 * Drag handler for manipulating orientation of an image node.
 *
 * @author Todd Holden (Queensborough Community College of CUNY)
 * @author Modified from MoleculeAngleDragHandler by Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  //var moleculePolarity = require( 'MOLECULE_POLARITY/moleculePolarity' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Node} ImageNode
   * @param {Node} relativeNode - angles are computed relative to this Node
   * @constructor
   */
  function AngleDragHandler( ImageNode, relativeNode, model ) {

    const r = new Vector2(ImageNode.centerX - relativeNode.centerX, ImageNode.centerY - relativeNode.centerY ).magnitude;
    const originalX = relativeNode.centerX;
    const originalY = relativeNode.centerY;

    var previousAngle; // angle between the pointer and the ImageNode when the drag started

    /**
     * Gets the angle of the pointer relative to relativeNode.
     * @param {Event} event
     * @returns {number} angle in radians
     */
    var getAngle = function( event ) {
      var point = (relativeNode.globalToParentPoint( event.pointer.point ) );
      //console.log(ImageNode.centerX);
      //return new Vector2( point.x , point.y ).angle;
      return new Vector2( point.x - relativeNode.centerX, point.y - relativeNode.centerY ).angle;
    };

    SimpleDragHandler.call( this, {

      allowTouchSnag: true,

      start: function( event ) {
        //ImageNode.dragging = true;
        previousAngle = getAngle( event );
      },

      drag: function( event ) {
        var currentAngle = getAngle( event );
        //ImageNode.rotation = ImageNode.rotation + currentAngle - previousAngle ;
        ImageNode.rotation = ImageNode.rotation + currentAngle - previousAngle ;
        ImageNode.centerX = originalX + r * Math.cos(currentAngle);
        ImageNode.centerY = originalY + r * Math.sin(currentAngle);
        var currentTheta = model.Sample.orientationP.value - currentAngle + previousAngle ;
        if ( currentTheta < -Math.PI ) {currentTheta += 2 * Math.PI } 
        else if ( currentTheta > Math.PI ) {currentTheta -= 2 * Math.PI }
        model.Sample.orientationP.value = currentTheta;
        previousAngle = currentAngle ;
      },

      end: function( event ) {
        ImageNode.dragging = false;
      }
    } );
  }

  //moleculePolarity.register( 'AngleDragHandler', AngleDragHandler );

  return inherit( SimpleDragHandler, AngleDragHandler );
} );
