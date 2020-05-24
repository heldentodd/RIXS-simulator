// Copyright 2013-2018, University of Colorado Boulder

/**
 * View for the sample, which can be rotated updating Theta.
 *
 * @author Todd Holden (Queensborough Community College of CUNY)
 *
 */

  // modules
  import rixsSimulator from '../../rixsSimulator.js';
  import AngleDragHandler from './AngleDragHandler.js';
  import Image from '../../../../scenery/js/nodes/Image.js';
  import inherit from '../../../../phet-core/js/inherit.js';
  import Node from '../../../../scenery/js/nodes/Node.js';
  
  // strings

  /**
   * Constructor for the RotatingNode which renders the Sample as a scenery node.
   *
   * @param positionX - the x position of the center of the image on the canvas
   * @param positionY - the y position of the center of the image on the canvas
   * @param {RixsSimulatorModel} model - the main model for the simulation
   * @param {Tandem} tandem
   * @constructor 
   */
  function RotatingNode(imageBitmap, imageCenter, rotationCenter, orientationP , tandem) {

    this._initialCenter = imageCenter;

    // Call the super constructor
    Node.call( this, {

      // Show a cursor hand over the sample
      cursor: 'pointer'
    } );

    // Add the sample
    this.Image = new Image( imageBitmap, {
        //rotation: orientationP.value - Math.PI / 6, // =0
        centerX: imageCenter.x,
        centerY: imageCenter.y
    } );
    
    this.addChild( this.Image );
    
    // rotate molecule by dragging anywhere
    const dragHandler = new AngleDragHandler( this.Image, rotationCenter, orientationP );
    this.addInputListener( dragHandler );

  }

  rixsSimulator.register( 'RotatingNode', RotatingNode );

  inherit( Node, RotatingNode, {

    /**
    * Restores the initial orientation of the Sample. // ToDo - reset not running
    * @public
    */
   reset: function() {
    this.Image.rotation = 0;
    this.Image.centerX = this._initialCenter.x;
    this.Image.centerY = this._initialCenter.y;
    }
} );

export default RotatingNode;